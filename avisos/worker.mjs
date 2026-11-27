import "../assets/js/produtos.js";
import { mensagem, cupom } from "./email.mjs";

const catalogo = globalThis.SIRIGUELA;
const diaLocal = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Sao_Paulo" }).format(new Date());
function proximaAbertura() {
  const [ano, mes, dia] = diaLocal().split("-").map(Number);
  return new Date(Date.UTC(ano, mes - 1 + Number(dia >= catalogo.janela.diaInicio), catalogo.janela.diaInicio)).toISOString().slice(0, 10);
}
// Peças fora do catálogo que só recolhem interesse: o e-mail recebe a confirmação e mais nada.
// A data distante impede o aviso automático de "safra aberta", que é das sungas.
const PRE_VENDA = {
  "camiseta-azulejo": { nome: "camiseta azulejo", url: "/camisetas/azulejo/", foto: "/assets/camisetas/azulejo/email-1x1.jpg" },
  "camiseta-catavento": { nome: "camiseta catavento", url: "/camisetas/catavento/", foto: "/assets/camisetas/catavento/email-1x1.jpg" },
  "camiseta-jardim": { nome: "camiseta jardim", url: "/camisetas/jardim/", foto: "/assets/camisetas/jardim/email-1x1.jpg" },
  "camiseta-meia-lua": { nome: "camiseta meia-lua", url: "/camisetas/meia-lua/", foto: "/assets/camisetas/meia-lua/email-1x1.jpg" },
  "camiseta-encaixe": { nome: "camiseta encaixe", url: "/camisetas/encaixe/", foto: "/assets/camisetas/encaixe/email-1x1.jpg" },
  "camiseta-blocos": { nome: "camiseta blocos", url: "/camisetas/blocos/", foto: "/assets/camisetas/blocos/email-1x1.jpg" },
  "camiseta-degraus": { nome: "camiseta degraus", url: "/camisetas/degraus/", foto: "/assets/camisetas/degraus/email-1x1.jpg" },
  "camiseta-ciranda": { nome: "camiseta ciranda", url: "/camisetas/ciranda/", foto: "/assets/camisetas/ciranda/email-1x1.jpg" },
  "camiseta-bandeirinhas": { nome: "camiseta bandeirinhas", url: "/camisetas/bandeirinhas/", foto: "/assets/camisetas/bandeirinhas/email-1x1.jpg" }
};
const SEM_DATA = "9999-12-31";
const CUPOM = "boas-vindas";
const EM_BREVE = "quando as sungas chegarem, você fica sabendo primeiro, por aqui.";
const preVenda = (slug) => {
  if (typeof slug !== "string") return null;
  if (Object.hasOwn(PRE_VENDA, slug)) return PRE_VENDA[slug];
  // pop-up de Black Friday (catalogo.boasVindas): o e-mail é o do cupom (cupom() em email.mjs)
  if (slug === CUPOM && catalogo.boasVindas) return { nome: "cupom de black friday", url: "/camisetas/", foto: "/assets/camisetas/ciranda/email-1x1.jpg" };
  // sungas em breve: o e-mail só confirma o interesse; o aviso de safra fica para quando elas abrirem
  if (!catalogo.sungasEmBreve) return null;
  const p = catalogo.produtos.find(x => x.slug === slug);
  if (p) return { nome: "sunga " + p.nome.toLowerCase(), url: "/colecao1/sunga/" + slug + "/", foto: "/assets/produtos/" + slug + "/email-1x1.jpg", texto: EM_BREVE };
  if (slug === "sungas") return { nome: "coleção de sungas", url: "/sungas/", foto: "/assets/produtos/pipa/email-1x1.jpg", texto: EM_BREVE };
  return null;
};
const json = (ok, status) => Response.json({ ok }, { status, headers: { "Cache-Control": "no-store" } });

const worker = {
  async fetch(req, env, ctx) {
    if (new URL(req.url).pathname !== "/api/avisos") return json(false, 404);
    if (req.method !== "POST") return json(false, 405);
    if (req.headers.get("Origin") !== "https://siriguela.site") return json(false, 403);
    if (!req.headers.get("Content-Type")?.startsWith("application/json")) return json(false, 415);
    if (Number(req.headers.get("Content-Length")) > 2048) return json(false, 413);
    const limited = await env.LIMITE.limit({ key: req.headers.get("CF-Connecting-IP") || "unknown" });
    if (!limited.success) return json(false, 429);
    const texto = await req.text().catch(() => "");
    if (texto.length > 2048) return json(false, 413);
    let data = null;
    try { data = JSON.parse(texto); } catch {}
    const email = typeof data?.email === "string" ? data.email.trim().toLowerCase() : "";
    if (email.length > 254 || !/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(email)) return json(false, 400);
    const slug = data.produto;
    if (slug !== "" && !preVenda(slug) && !catalogo.produtos.some(p => p.slug === slug)) return json(false, 400);
    await env.DB.prepare("INSERT INTO avisos(email, produto, abertura) VALUES(?,?,?) ON CONFLICT(email,produto,abertura) DO NOTHING")
      .bind(email, slug, preVenda(slug) ? SEM_DATA : proximaAbertura()).run();
    // o cupom sai na hora, sem esperar o cron de 5 em 5 minutos (que continua como reserva)
    if (slug === CUPOM && ctx) ctx.waitUntil(worker.scheduled(null, env).catch(() => {}));
    return json(true, 200);
  },
  async scheduled(event, env) {
    if (env.ENVIAR !== "sim") return;
    const hoje = diaLocal();
    const { results } = await env.DB.prepare(`SELECT * FROM avisos WHERE tentar_apos <= unixepoch()
      AND avisado_em IS NULL AND (confirmado_em IS NULL OR abertura <= ?) ORDER BY tentar_apos, id LIMIT 25`).bind(hoje).all();
    for (const item of results) {
      const aberta = item.abertura <= hoje;
      if (aberta && (item.abertura.slice(0,7) !== hoje.slice(0,7) || +hoje.slice(-2) > catalogo.janela.diaFim)) {
        await env.DB.prepare("UPDATE avisos SET tentar_apos = 253402300799 WHERE id = ?").bind(item.id).run();
        continue;
      }
      const campo = aberta ? "avisado_em" : "confirmado_em";
      const claim = await env.DB.prepare(`UPDATE avisos SET tentar_apos = unixepoch()+900 WHERE id=? AND ${campo} IS NULL AND tentar_apos<=unixepoch()`).bind(item.id).run();
      if (!claim.meta.changes) continue;
      // Quem cadastra o e-mail de outra pessoa em várias peças não lota a caixa dela:
      // a confirmação sai uma vez por endereço a cada 24 h; as outras ficam marcadas sem envio.
      if (!aberta && item.produto !== CUPOM) {
        const recente = await env.DB.prepare(`SELECT 1 FROM avisos WHERE email=? AND id<>?
          AND confirmado_em > datetime('now','-1 day') LIMIT 1`).bind(item.email, item.id).first();
        if (recente) {
          await env.DB.prepare("UPDATE avisos SET confirmado_em=CURRENT_TIMESTAMP, tentar_apos=0 WHERE id=?").bind(item.id).run();
          continue;
        }
      }
      const nome = catalogo.produtos.find(p => p.slug === item.produto)?.nome;
      try {
        await env.EMAIL.send({ from: { email: "ola@siriguela.site", name: "siriguela" }, to: item.email, ...(item.produto === CUPOM ? cupom(catalogo.boasVindas, catalogo.frete, catalogo.camisetas.preco) : mensagem(nome, item.produto, item.abertura, aberta, preVenda(item.produto))) });
      } catch {
        console.error("Falha no envio do aviso", item.id);
        continue;
      }
      await env.DB.prepare(`UPDATE avisos SET ${campo}=CURRENT_TIMESTAMP, tentar_apos=0 WHERE id=?`).bind(item.id).run();
    }
  }
};

export default worker;

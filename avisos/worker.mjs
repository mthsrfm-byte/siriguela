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
// Aviso no navegador (Web Push) das sungas: só aceita endereço dos serviços de push dos navegadores.
const PUSH_HOSTS = /^(fcm\.googleapis\.com|updates\.push\.services\.mozilla\.com|[a-z0-9.-]+\.push\.apple\.com|[a-z0-9.-]+\.notify\.windows\.com)$/;
const b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const b64urlTexto = (t) => b64url(new TextEncoder().encode(t));
const fromB64url = (t) => Uint8Array.from(atob(t.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
async function vapid(endpoint, env) {
  const jwk = JSON.parse(env.VAPID_JWK);
  const chave = await crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const corpo = b64urlTexto(JSON.stringify({ typ: "JWT", alg: "ES256" })) + "." +
    b64urlTexto(JSON.stringify({ aud: new URL(endpoint).origin, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: "mailto:suporte@siriguela.site" }));
  const assinatura = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, chave, new TextEncoder().encode(corpo));
  const publica = b64url(new Uint8Array([4, ...fromB64url(jwk.x), ...fromB64url(jwk.y)]));
  return `vapid t=${corpo}.${b64url(assinatura)}, k=${publica}`;
}
// Quando as sungas saem do "em breve", cada navegador inscrito recebe um push vazio; o sw.js mostra o texto.
async function enviarPush(env) {
  if (catalogo.sungasEmBreve || !env.VAPID_JWK) return;
  const { results } = await env.DB.prepare("SELECT id, endpoint FROM push WHERE avisado_em IS NULL AND tentar_apos <= unixepoch() LIMIT 50").all();
  for (const item of results) {
    let status = 0;
    try {
      const r = await fetch(item.endpoint, { method: "POST", headers: { TTL: "86400", Urgency: "normal", Authorization: await vapid(item.endpoint, env), "Content-Length": "0" } });
      status = r.status;
    } catch {}
    if (status >= 200 && status < 300 || status === 404 || status === 410) {
      await env.DB.prepare("UPDATE push SET avisado_em = CURRENT_TIMESTAMP, status = ? WHERE id = ?").bind(status, item.id).run();
    } else {
      await env.DB.prepare("UPDATE push SET tentar_apos = unixepoch() + 3600, status = ? WHERE id = ?").bind(status, item.id).run();
    }
  }
}
async function inscreverPush(data, env) {
  const endpoint = typeof data?.endpoint === "string" ? data.endpoint : "";
  let url = null;
  try { url = new URL(endpoint); } catch {}
  if (!url || url.protocol !== "https:" || endpoint.length > 1024 || !PUSH_HOSTS.test(url.hostname)) return json(false, 400);
  const { p256dh, auth } = data.keys || {};
  if (typeof p256dh !== "string" || typeof auth !== "string" || p256dh.length > 200 || auth.length > 100) return json(false, 400);
  await env.DB.prepare("INSERT INTO push(endpoint, p256dh, auth) VALUES(?,?,?) ON CONFLICT(endpoint) DO NOTHING").bind(endpoint, p256dh, auth).run();
  return json(true, 200);
}
const json = (ok, status) => Response.json({ ok }, { status, headers: { "Cache-Control": "no-store" } });

const worker = {
  async fetch(req, env, ctx) {
    const caminho = new URL(req.url).pathname;
    if (caminho !== "/api/avisos" && caminho !== "/api/avisos/push") return json(false, 404);
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
    if (caminho === "/api/avisos/push") return inscreverPush(data, env);
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
    await enviarPush(env).catch(() => console.error("Falha no envio dos avisos no navegador"));
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
        await env.EMAIL.send({ from: { email: "matheus@siriguela.site", name: "siriguela" }, to: item.email, ...(item.produto === CUPOM ? cupom(catalogo.boasVindas, catalogo.frete, catalogo.camisetas.preco) : mensagem(nome, item.produto, item.abertura, aberta, preVenda(item.produto))) });
      } catch {
        console.error("Falha no envio do aviso", item.id);
        continue;
      }
      await env.DB.prepare(`UPDATE avisos SET ${campo}=CURRENT_TIMESTAMP, tentar_apos=0 WHERE id=?`).bind(item.id).run();
    }
  }
};

export default worker;

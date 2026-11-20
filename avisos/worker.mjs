import "../assets/js/produtos.js";
import { mensagem } from "./email.mjs";

const catalogo = globalThis.SIRIGUELA;
const diaLocal = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Sao_Paulo" }).format(new Date());
function proximaAbertura() {
  const [ano, mes, dia] = diaLocal().split("-").map(Number);
  return new Date(Date.UTC(ano, mes - 1 + Number(dia >= catalogo.janela.diaInicio), catalogo.janela.diaInicio)).toISOString().slice(0, 10);
}
const json = (ok, status) => Response.json({ ok }, { status, headers: { "Cache-Control": "no-store" } });

export default {
  async fetch(req, env) {
    if (new URL(req.url).pathname !== "/api/avisos") return json(false, 404);
    if (req.method !== "POST") return json(false, 405);
    if (req.headers.get("Origin") !== "https://siriguela.site") return json(false, 403);
    if (!req.headers.get("Content-Type")?.startsWith("application/json")) return json(false, 415);
    if (Number(req.headers.get("Content-Length")) > 2048) return json(false, 413);
    const limited = await env.LIMITE.limit({ key: req.headers.get("CF-Connecting-IP") || "unknown" });
    if (!limited.success) return json(false, 429);
    const data = await req.json().catch(() => null);
    const email = typeof data?.email === "string" ? data.email.trim().toLowerCase() : "";
    if (email.length > 254 || !/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(email)) return json(false, 400);
    const slug = data.produto;
    if (slug !== "" && !catalogo.produtos.some(p => p.slug === slug)) return json(false, 400);
    await env.DB.prepare("INSERT INTO avisos(email, produto, abertura) VALUES(?,?,?) ON CONFLICT(email,produto,abertura) DO NOTHING")
      .bind(email, slug, proximaAbertura()).run();
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
      const nome = catalogo.produtos.find(p => p.slug === item.produto)?.nome;
      try {
        await env.EMAIL.send({ from: { email: "safra@avisos.siriguela.site", name: "siriguela" }, to: item.email, ...mensagem(nome, item.produto, item.abertura, aberta) });
      } catch {
        console.error("Falha no envio do aviso", item.id);
        continue;
      }
      await env.DB.prepare(`UPDATE avisos SET ${campo}=CURRENT_TIMESTAMP, tentar_apos=0 WHERE id=?`).bind(item.id).run();
    }
  }
};

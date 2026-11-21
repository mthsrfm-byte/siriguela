import "../assets/js/produtos.js";

const catalogo = globalThis.SIRIGUELA;
const origem = "https://siriguela.site";
const diaBrasilia = new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", day: "numeric" });

function responder(status, dados) {
  return Response.json(dados, { status, headers: { "Cache-Control": "no-store" } });
}

export default {
  async fetch(req, env) {
    if (new URL(req.url).pathname !== "/api/checkout") return responder(404, {});
    if (req.method !== "POST") return responder(405, { erro: "Use a sacola para iniciar uma encomenda." });
    if (req.headers.get("Origin") !== origem) return responder(403, {});
    const dia = Number(diaBrasilia.format(new Date()));
    if (dia < catalogo.janela.diaInicio || dia > catalogo.janela.diaFim) {
      return responder(409, { erro: "Encomendas fechadas. Sua sacola fica guardada para a próxima safra." });
    }
    if (!env.NEXTOUT_KEY) return responder(503, { erro: "Pagamento indisponível por enquanto. Sua sacola está salva." });
    if (!req.headers.get("Content-Type")?.startsWith("application/json")) return responder(415, {});
    if (Number(req.headers.get("Content-Length")) > 16384) return responder(413, {});
    const { success } = await env.LIMITE.limit({ key: req.headers.get("CF-Connecting-IP") || "local" });
    if (!success) return responder(429, { erro: "Aguarde um minuto e tente novamente." });
    const body = await req.json().catch(() => null);
    if (!Array.isArray(body?.items) || !body.items.length || body.items.length > 50) {
      return responder(400, { erro: "Confira os itens da sua sacola." });
    }
    const items = [];
    for (const item of body.items) {
      const produto = catalogo.produtos.find(p => p.slug === item?.slug);
      if (!produto || !catalogo.tamanhos.includes(item.size) || !Number.isSafeInteger(item.qty) || item.qty < 1 ||
          !Number.isSafeInteger(item.qty * Math.round(catalogo.preco * 100))) {
        return responder(400, { erro: "Confira o tamanho e a quantidade de cada peça." });
      }
      if (produto.esgotados?.includes(item.size)) {
        return responder(409, { erro: `Sunga ${produto.nome}, tamanho ${item.size}, esgotada. Remova essa peça para continuar.` });
      }
      items.push({
        name: `Sunga ${produto.nome} · tamanho ${item.size}`,
        amount: Math.round(catalogo.preco * 100),
        quantity: item.qty,
        image: `${origem}/assets/produtos/${produto.slug}/${produto.recorte ? "solta" : "frente"}.w640.webp`
      });
    }
    const utm = {};
    for (const key of ["source", "medium", "campaign", "content", "term"]) {
      if (typeof body.utm?.[key] === "string") utm[key] = body.utm[key].slice(0, 200);
    }
    try {
      const resposta = await fetch("https://nextout.com.br/api/checkout", {
        method: "POST", redirect: "error", signal: AbortSignal.timeout(12000),
        headers: { Authorization: `Bearer ${env.NEXTOUT_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ items, utm })
      });
      if (!resposta.ok) throw new Error(`nextout ${resposta.status}`);
      const { url } = await resposta.json();
      const destino = new URL(url);
      if (!["https://checkout.siriguela.site", "https://nextout.com.br"].includes(destino.origin) || destino.username || destino.password) {
        throw new Error("destino inesperado");
      }
      return responder(200, { url: destino.href });
    } catch {
      return responder(502, { erro: "Não foi possível abrir o pagamento. Sua sacola está salva. Tente novamente." });
    }
  }
};

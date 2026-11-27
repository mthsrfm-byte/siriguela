import "../assets/js/produtos.js";

const catalogo = globalThis.SIRIGUELA;
const origem = "https://siriguela.site";
/* teto de peças iguais por linha da sacola (o mesmo de MAX_POR_LINHA em assets/js/app.js) */
const MAX_POR_LINHA = 20;
const MAX_CORPO = 16384;
const diaBrasilia = new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", day: "numeric" });

function responder(status, dados) {
  return Response.json(dados, { status, headers: { "Cache-Control": "no-store" } });
}

export default {
  async fetch(req, env) {
    if (new URL(req.url).pathname !== "/api/checkout") return responder(404, {});
    if (req.method !== "POST") return responder(405, { erro: "Use a sacola para iniciar uma encomenda." });
    if (req.headers.get("Origin") !== origem) return responder(403, {});
    if (!env.NEXTOUT_KEY) return responder(503, { erro: "Pagamento indisponível por enquanto. Sua sacola está salva." });
    if (!req.headers.get("Content-Type")?.startsWith("application/json")) return responder(415, {});
    if (Number(req.headers.get("Content-Length")) > MAX_CORPO) return responder(413, {});
    const { success } = await env.LIMITE.limit({ key: req.headers.get("CF-Connecting-IP") || "local" });
    if (!success) return responder(429, { erro: "Aguarde um minuto e tente novamente." });
    /* o Content-Length pode faltar (envio em partes): o limite vale para o corpo lido */
    const texto = await req.text().catch(() => "");
    if (texto.length > MAX_CORPO) return responder(413, {});
    let body = null;
    try { body = JSON.parse(texto); } catch {}
    if (!Array.isArray(body?.items) || !body.items.length || body.items.length > 50) {
      return responder(400, { erro: "Confira os itens da sua sacola." });
    }
    const camisetas = catalogo.camisetas;
    const items = [];
    let temSunga = false;
    for (const item of body.items) {
      /* camiseta: venda contínua; sunga: só na janela da safra */
      const camiseta = item?.tipo === "camiseta";
      const produto = camiseta ? camisetas.itens.find(c => c.slug === item?.slug) : catalogo.produtos.find(p => p.slug === item?.slug);
      const preco = camiseta ? (produto?.preco ?? camisetas.preco) : catalogo.preco;
      const tamanhos = camiseta ? camisetas.tamanhos : catalogo.tamanhos;
      if (!produto || !tamanhos.includes(item.size) || !Number.isSafeInteger(item.qty) || item.qty < 1 || item.qty > MAX_POR_LINHA) {
        return responder(400, { erro: "Confira o tamanho e a quantidade de cada peça." });
      }
      const tipo = camiseta ? "Camiseta" : "Sunga";
      if (produto.esgotados?.includes(item.size)) {
        return responder(409, { erro: `${tipo} ${produto.nome}, tamanho ${item.size}, esgotada. Remova essa peça para continuar.` });
      }
      if (!camiseta) temSunga = true;
      items.push({
        name: `${tipo} ${produto.nome} · tamanho ${item.size}`,
        amount: Math.round(preco * 100),
        quantity: item.qty,
        image: camiseta
          ? `${origem}/assets/camisetas/${produto.slug}/email-1x1.jpg`
          : `${origem}/assets/produtos/${produto.slug}/${produto.recorte ? "solta" : "frente"}.w640.webp`
      });
    }
    const dia = Number(diaBrasilia.format(new Date()));
    if (temSunga && catalogo.sungasEmBreve) {
      return responder(409, { erro: "As sungas ainda não estão à venda. Remova as sungas para comprar as camisetas." });
    }
    if (temSunga && (dia < catalogo.janela.diaInicio || dia > catalogo.janela.diaFim)) {
      return responder(409, { erro: "As sungas só fecham pedido na safra, do dia 1 ao 7. Remova as sungas para comprar as camisetas agora." });
    }
    const utm = {};
    for (const key of ["source", "medium", "campaign", "content", "term"]) {
      if (typeof body.utm?.[key] === "string") utm[key] = body.utm[key].slice(0, 200);
    }
    try {
      const resposta = await fetch("https://checkout.siriguela.site/api/checkout", {
        method: "POST", redirect: "manual", signal: AbortSignal.timeout(12000),
        headers: { Authorization: `Bearer ${env.NEXTOUT_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ items, utm })
      });
      if (!resposta.ok) throw new Error(`nextout ${resposta.status}: ${(await resposta.text()).slice(0, 200)}`);
      const { url } = await resposta.json();
      const destino = new URL(url);
      if (!["https://checkout.siriguela.site", "https://nextout.com.br"].includes(destino.origin) || destino.username || destino.password) {
        throw new Error("destino inesperado");
      }
      return responder(200, { url: destino.href });
    } catch (e) {
      console.error("checkout falhou", String(e?.message || e));
      return responder(502, { erro: "Não foi possível abrir o pagamento. Sua sacola está salva. Tente novamente." });
    }
  }
};

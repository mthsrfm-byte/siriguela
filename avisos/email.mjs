const site = "https://siriguela.site";

export function mensagem(nome, slug, abertura, aberta = false, pre = null) {
  // pre: peça em pré-venda, fora do catálogo ({ nome, url, foto }); ainda não tem data de abertura
  const data = pre ? "em breve" : new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", timeZone: "UTC" })
    .format(new Date(abertura + "T12:00:00Z")).replace(/^1 de/, "1º de");
  const titulo = aberta ? "a safra abriu." : "seu e-mail tá anotado.";
  const descricao = aberta
    ? "as encomendas desta safra estão abertas. você já pode escolher o tamanho e pedir a sua."
    : pre ? pre.texto || "quando a pré-venda abrir, você fica sabendo primeiro, por aqui."
    : "quando as encomendas abrirem, a gente te avisa por aqui.";
  const peca = pre ? pre.nome : nome ? "sunga " + nome.toLowerCase() : "coleção de sungas";
  const url = pre ? site + pre.url : nome ? site + "/colecao1/sunga/" + slug + "/" : site + "/";
  const acao = aberta ? "encomendar agora" : pre || nome ? "rever a estampa" : "ver a coleção";
  const meta = "font:11px/16px 'Courier New',monospace;letter-spacing:1.3px;color:#5e5953";
  const imagem = pre ? site + pre.foto : `${site}/assets/produtos/${slug}/email-1x1.jpg`;
  const foto = pre || nome ? `<td width="100" valign="middle" style="padding:14px 0 14px 14px">
    <a href="${url}"><img src="${imagem}" width="100" height="100" alt="${peca}" style="display:block;border:0"></a></td>` : "";
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">
<style>
:root {color-scheme:light dark;supported-color-schemes:light dark}
@media (prefers-color-scheme: dark) {
  .base {background-color:#121212!important;color:#f3efe8!important}
  .info {background-color:#1f1d1b!important;color:#f3efe8!important}
  .secundario {color:#a9a39a!important}
  .linha {border-color:#3e3934!important}
  .acao {background-color:#f3efe8!important;color:#121212!important}
}
[data-ogsc] .base {background-color:#121212!important;color:#f3efe8!important}
[data-ogsc] .info {background-color:#1f1d1b!important;color:#f3efe8!important}
[data-ogsc] .secundario {color:#a9a39a!important}
[data-ogsc] .linha {border-color:#3e3934!important}
[data-ogsc] .acao {background-color:#f3efe8!important;color:#121212!important}
</style></head><body class="base" style="margin:0;background-color:#f3efe8;color:#121212;font-family:Arial,Helvetica,sans-serif">
<table class="base" role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f3efe8;color:#121212"><tr><td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:584px;text-align:left"><tr><td class="linha" style="padding:28px 24px 22px;border-bottom:1px solid #d9d1c4">
<img src="${site}/assets/img/etiqueta-email.png" width="144" height="48" alt="siriguela." style="display:block"></td></tr>
<tr><td style="padding:36px 24px 28px">
<p class="secundario" style="margin:0 0 16px;${meta}">${pre ? "PRÉ-VENDA" : "ENCOMENDAS"}</p>
<h1 style="max-width:410px;margin:0;font:normal 46px/1.02 Arial,Helvetica,sans-serif;letter-spacing:-2.2px">${titulo}</h1>
<p style="max-width:355px;margin:18px 0 0;font-size:17px;line-height:1.5">${descricao}</p></td></tr>
<tr><td style="padding:0 24px"><table class="info" role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#e4dccf;color:#121212"><tr>${foto}
<td valign="middle" style="padding:14px"><p class="secundario" style="margin:0;${meta}">PEÇA</p><p style="margin:2px 0 12px;font-size:17px;line-height:21px">${peca}</p>
<p class="secundario" style="margin:0;${meta}">ABERTURA</p><p style="margin:2px 0 0;font-size:16px;line-height:20px">${data}</p></td></tr></table></td></tr>
<tr><td style="padding:22px 24px 36px"><a class="acao" href="${url}" style="display:inline-block;background-color:#121212;color:#f3efe8;padding:15px 22px;text-decoration:none;font-size:15px">${acao}</a></td></tr>
<tr><td class="linha secundario" style="border-top:1px solid #d9d1c4;padding:18px 24px 26px;color:#5e5953;font-size:12px;line-height:18px">você recebeu este e-mail porque pediu um aviso em siriguela.site.</td></tr></table></td></tr></table></body></html>`;
  return { subject: "siriguela · " + titulo, html, text: [titulo, descricao, peca, "abertura: " + data, url].join("\n\n") };
}

// E-mail do cupom de Black Friday (catalogo.boasVindas): sai logo depois do cadastro no pop-up.
export function cupom(bv, frete, preco) {
  const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const [ano, mes, dia] = bv.fim.split("-");
  const ate = `${dia}/${mes}`;
  const url = `${site}/camisetas/?utm_source=email&utm_medium=cupom&utm_campaign=black-friday`;
  const meta = "font:11px/16px 'Courier New',monospace;letter-spacing:1.3px;color:#5e5953";
  const titulo = "leve 3, pague 2.";
  const resumo = `seu cupom ${bv.codigo} chegou. compre 3 camisetas e ganhe ${brl(bv.desconto)} de desconto no carrinho. vale até as 23h59 de ${ate}.`;
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">
<title>${titulo}</title>
<style>
:root {color-scheme:light dark;supported-color-schemes:light dark}
@media (prefers-color-scheme: dark) {
  .base {background-color:#121212!important;color:#f3efe8!important}
  .info {background-color:#1f1d1b!important;color:#f3efe8!important}
  .secundario {color:#a9a39a!important}
  .linha {border-color:#3e3934!important}
  .acao {background-color:#f3efe8!important;color:#121212!important}
}
[data-ogsc] .base {background-color:#121212!important;color:#f3efe8!important}
[data-ogsc] .info {background-color:#1f1d1b!important;color:#f3efe8!important}
[data-ogsc] .secundario {color:#a9a39a!important}
[data-ogsc] .linha {border-color:#3e3934!important}
[data-ogsc] .acao {background-color:#f3efe8!important;color:#121212!important}
@media (max-width:480px) { .titulo {font-size:40px!important;letter-spacing:-1.8px!important} .codigo {font-size:22px!important;letter-spacing:2px!important} }
</style></head><body class="base" style="margin:0;background-color:#f3efe8;color:#121212;font-family:Arial,Helvetica,sans-serif">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${resumo}</div>
<table class="base" role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f3efe8;color:#121212"><tr><td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:584px;text-align:left">
<tr><td class="linha" style="padding:28px 24px 22px;border-bottom:1px solid #d9d1c4">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr>
<td><img src="${site}/assets/img/etiqueta-email.png" width="144" height="48" alt="siriguela." style="display:block"></td>
<td align="right" class="secundario" style="${meta}">BLACK FRIDAY<br>SÓ HOJE</td></tr></table></td></tr>
<tr><td style="padding:24px 24px 0"><a href="${url}"><img src="${site}/assets/camisetas/ciranda/email-luz.jpg" width="536" alt="Rapaz com a camiseta Ciranda sob a luz que entra pelo teto" style="display:block;width:100%;max-width:536px;height:auto;border:0"></a>
<p class="secundario" style="margin:10px 0 0;${meta}">A CIRANDA, DEBAIXO DA LUZ QUE ENTRA PELO TETO</p></td></tr>
<tr><td style="padding:34px 24px 0">
<h1 class="titulo" style="margin:0;font:normal 52px/1 Arial,Helvetica,sans-serif;letter-spacing:-2.4px">leve 3, pague 2<span style="color:#b8322a">.</span></h1>
<p style="max-width:400px;margin:18px 0 0;font-size:17px;line-height:1.5">compre 3 camisetas e ganhe ${brl(bv.desconto)} de desconto no carrinho.</p>
<p class="secundario" style="margin:8px 0 0;font-size:13px;line-height:1.5;color:#5e5953">não cumulativo com frete grátis.</p></td></tr>
<tr><td style="padding:28px 24px 0">
<table class="info" role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#fbf9f5;color:#121212;border:1px dashed #121212"><tr>
<td style="padding:20px 22px">
<p class="secundario" style="margin:0 0 6px;${meta}">SEU CUPOM</p>
<p class="codigo" style="margin:0;font:bold 28px/1.2 'Courier New',monospace;letter-spacing:4px">${bv.codigo}</p></td>
<td align="right" valign="middle" class="secundario" style="padding:20px 22px;${meta}">ATÉ 23H59<br>DE ${ate}</td></tr></table></td></tr>
<tr><td style="padding:24px 24px 0"><a class="acao" href="${url}" style="display:inline-block;background-color:#121212;color:#f3efe8;padding:16px 24px;text-decoration:none;font-size:15px">escolher as três &rarr;</a></td></tr>
<tr><td style="padding:28px 24px 36px">
<p class="secundario" style="margin:0 0 6px;${meta}">COMO USAR</p>
<p class="secundario" style="margin:0;font-size:14px;line-height:21px;color:#5e5953">coloque três camisetas na sacola e cole o código no pagamento. frete fixo de ${brl(frete)} para todo o brasil. a gente estampa depois do pedido, e a sua chega em 7 a 15 dias corridos.</p></td></tr>
<tr><td class="linha secundario" style="border-top:1px solid #d9d1c4;padding:18px 24px 26px;color:#5e5953;font-size:12px;line-height:18px">você recebeu este e-mail porque pediu o cupom de black friday em siriguela.site.</td></tr>
</table></td></tr></table></body></html>`;
  const text = [titulo, resumo, "cupom: " + bv.codigo, "coloque três camisetas na sacola e cole o código no pagamento. frete fixo de " + brl(frete) + ".", url].join("\n\n");
  return { subject: `siriguela · seu cupom ${bv.codigo}`, html, text };
}

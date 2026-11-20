const site = "https://siriguela.site";

export function mensagem(nome, slug, abertura, aberta = false) {
  const data = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", timeZone: "UTC" })
    .format(new Date(abertura + "T12:00:00Z")).replace(/^1 de/, "1º de");
  const titulo = aberta ? "a safra abriu." : "seu e-mail tá anotado.";
  const descricao = aberta
    ? "as encomendas desta safra estão abertas. você já pode escolher o tamanho e pedir a sua."
    : "quando as encomendas abrirem, a gente te avisa por aqui.";
  const peca = nome ? "sunga " + nome.toLowerCase() : "coleção de sungas";
  const url = nome ? site + "/colecao1/sunga/" + slug + "/" : site + "/";
  const acao = aberta ? "encomendar agora" : nome ? "rever a estampa" : "ver a coleção";
  const meta = "font:11px/16px 'Courier New',monospace;letter-spacing:1.3px;color:#5e5953";
  const html = `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="margin:0;background:#f3efe8;color:#121212;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3efe8"><tr><td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:584px;text-align:left"><tr><td style="padding:36px 28px 24px;border-bottom:1px solid #d9d1c4">
<img src="${site}/assets/img/siriguela-email.png" width="148" alt="siriguela." style="display:block"></td></tr>
<tr><td style="padding:54px 28px 36px">
<p style="margin:0 0 20px;${meta}">ENCOMENDAS</p>
<h1 style="max-width:410px;margin:0;font:normal 54px/1 Arial,Helvetica,sans-serif;letter-spacing:-2.8px">${titulo}</h1>
<p style="max-width:355px;margin:20px 0 0;font-size:18px;line-height:1.5">${descricao}</p></td></tr>
<tr><td style="padding:0 28px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#e4dccf"><tr>
<td style="padding:18px"><span style="${meta}">PEÇA</span><br><span style="font-size:17px;line-height:30px">${peca}</span></td>
<td style="padding:18px"><span style="${meta}">ABERTURA</span><br><span style="font-size:17px;line-height:30px">${data}</span></td></tr></table></td></tr>
<tr><td style="padding:24px 28px 48px"><a href="${url}" style="display:inline-block;background:#121212;color:#f3efe8;padding:15px 22px;text-decoration:none;font-size:15px">${acao} &nbsp;↗</a></td></tr>
<tr><td style="border-top:1px solid #d9d1c4;padding:20px 28px 32px;color:#5e5953;font-size:12px;line-height:18px">você recebeu este e-mail porque pediu um aviso em siriguela.site.</td></tr></table></td></tr></table></body></html>`;
  return { subject: "siriguela · " + titulo, html, text: [titulo, descricao, peca, "abertura: " + data, url].join("\n\n") };
}

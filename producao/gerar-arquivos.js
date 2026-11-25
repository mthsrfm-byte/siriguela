/* Gera os arquivos de impressão das 9 camisetas a partir das artes do site.
   Rode na raiz do repositório:  node producao/gerar-arquivos.js
   Precisa do Playwright com Chromium (npm i -D playwright && npx playwright install chromium).

   Para cada camiseta de producao/camisetas.json, grava em producao/camisetas/<slug>/:
     <slug>-estampa.svg         vetor de impressão: só as tintas, fundo transparente, medida real em mm
     <slug>-estampa-300dpi.png  PNG transparente na largura de impressão (padrão 30 cm = 3543 px), com 300 DPI gravado no arquivo
     <slug>-previa-malha.png    prévia da estampa sobre a cor da malha (só para conferência, não vai para a impressão)
     <slug>-referencia.webp     a camiseta pronta, como aparece no site */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const { chromium } = require("playwright");

const RAIZ = path.resolve(__dirname, "..");
const ficha = JSON.parse(fs.readFileSync(path.join(__dirname, "camisetas.json"), "utf8"));
const { largura_cm: LARGURA_CM, dpi: DPI } = ficha.impressao;
const LARGURA_PX = Math.round((LARGURA_CM / 2.54) * DPI);

/* tira o retângulo da cor da malha (e a margem de 90 em volta) das estampas de malha escura */
function svgDeImpressao(svg, c) {
  const vb = svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  let [x, y, w, h] = vb;
  if (c.remover_fundo) {
    const fundo = new RegExp(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#[0-9A-Fa-f]{6}"/>`);
    if (!fundo.test(svg)) throw new Error(`${c.slug}: fundo da malha não encontrado`);
    svg = svg.replace(fundo, "");
    x += 90; y += 90; w -= 180; h -= 180;
  }
  const altCm = (LARGURA_CM * h) / w;
  svg = svg
    .replace(/viewBox="[^"]+"/, `viewBox="${x} ${y} ${w} ${h}"`)
    .replace(/ width="[^"]+"/, ` width="${LARGURA_CM * 10}mm"`)
    .replace(/ height="[^"]+"/, ` height="${(altCm * 10).toFixed(1)}mm"`);
  return { svg, altCm, proporcao: h / w };
}

/* grava a resolução (pHYs) no PNG, para o fornecedor abrir já em 300 DPI */
function comDpi(png, dpi) {
  const ppm = Math.round(dpi / 0.0254);
  const dados = Buffer.alloc(9);
  dados.writeUInt32BE(ppm, 0); dados.writeUInt32BE(ppm, 4); dados.writeUInt8(1, 8);
  const tipo = Buffer.from("pHYs");
  const crc = Buffer.alloc(4); crc.writeUInt32BE(zlib.crc32(Buffer.concat([tipo, dados])) >>> 0);
  const len = Buffer.alloc(4); len.writeUInt32BE(9);
  const fimIHDR = 8 + 25; // assinatura + chunk IHDR
  return Buffer.concat([png.subarray(0, fimIHDR), len, tipo, dados, crc, png.subarray(fimIHDR)]);
}

(async () => {
  const browser = await chromium.launch();
  for (const c of ficha.camisetas) {
    const dir = path.join(__dirname, "camisetas", c.slug);
    fs.mkdirSync(dir, { recursive: true });
    const original = fs.readFileSync(path.join(RAIZ, "assets/camisetas", c.slug, "estampa.svg"), "utf8");
    const { svg, altCm, proporcao } = svgDeImpressao(original, c);
    fs.writeFileSync(path.join(dir, `${c.slug}-estampa.svg`), svg);

    const alturaPx = Math.round(LARGURA_PX * proporcao);
    const uri = "data:image/svg+xml;base64," + Buffer.from(svg).toString("base64");
    const pg = await browser.newPage({ viewport: { width: LARGURA_PX, height: alturaPx }, deviceScaleFactor: 1 });
    await pg.setContent(`<style>html,body{margin:0;background:transparent}img{display:block;width:${LARGURA_PX}px;height:${alturaPx}px}</style><img src="${uri}">`);
    await pg.waitForFunction(() => document.images[0].complete);
    const png = await pg.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: LARGURA_PX, height: alturaPx } });
    fs.writeFileSync(path.join(dir, `${c.slug}-estampa-300dpi.png`), comDpi(png, DPI));

    /* prévia: a estampa com 60% da largura de um quadro da cor da malha */
    await pg.setViewportSize({ width: 1000, height: 1000 });
    await pg.setContent(`<style>html,body{margin:0}body{width:1000px;height:1000px;background:${c.malha.alvo};display:grid;place-items:center}img{width:600px;height:auto}</style><img src="${uri}">`);
    await pg.waitForFunction(() => document.images[0].complete);
    fs.writeFileSync(path.join(dir, `${c.slug}-previa-malha.png`), await pg.screenshot());
    await pg.close();

    fs.copyFileSync(path.join(RAIZ, "assets/camisetas", c.slug, "solta.w1188.webp"), path.join(dir, `${c.slug}-referencia.webp`));
    console.log(`${c.slug}: ${LARGURA_CM} × ${altCm.toFixed(1)} cm · ${LARGURA_PX} × ${alturaPx} px`);
  }
  await browser.close();
})();

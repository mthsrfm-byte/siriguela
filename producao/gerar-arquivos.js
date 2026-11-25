/* Gera os arquivos de impressão das 9 camisetas a partir das artes do site.
   Rode na raiz do repositório:  node producao/gerar-arquivos.js
   Precisa do Playwright com Chromium (npm i -D playwright && npx playwright install chromium).

   Segue o guia de arte para DTG (Remix On Demand e Dimona): PNG transparente em 300 DPI, perfil sRGB IEC61966-2.1,
   no tamanho exato da estampa, cortado rente à arte (sem margem) e sem tinta da mesma cor da malha.

   Para cada camiseta de producao/camisetas.json, grava em producao/camisetas/<slug>/:
     <slug>-estampa.svg         vetor de impressão: só as tintas, fundo transparente, medida real em mm
     <slug>-estampa-300dpi.png  PNG transparente na largura de impressão, com 300 DPI e sRGB gravados no arquivo
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
const BASE = 1000;   // largura da passada de medição (px)

/* 1. Tira o fundo na cor da malha (estampas escuras: retângulo + margem de 90 em volta).
   2. Vaza as cores iguais à malha (c.vazar): uma máscara copia o desenho com essas cores em preto e as demais
      em branco, na mesma ordem. Onde a cor da malha fica por cima, a arte some; onde outra cor cobre, continua. */
function svgBase(svg, c) {
  let [x, y, w, h] = svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  if (c.remover_fundo) {
    const fundo = new RegExp(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#[0-9A-Fa-f]{6}"/>`);
    if (!fundo.test(svg)) throw new Error(`${c.slug}: fundo da malha não encontrado`);
    svg = svg.replace(fundo, "");
    x += 90; y += 90; w -= 180; h -= 180;
  }
  if (c.vazar && c.vazar.length) {
    const abre = svg.match(/<svg[^>]*>/)[0];
    const corpo = svg.slice(svg.indexOf(abre) + abre.length, svg.lastIndexOf("</svg>")).replace(/<title>.*?<\/title>/, "");
    const vaza = new Set(c.vazar.map((v) => v.toLowerCase()));
    const mascara = corpo.replace(/fill="(#[0-9A-Fa-f]{6})"/g, (_, cor) => `fill="${vaza.has(cor.toLowerCase()) ? "#000" : "#fff"}"`);
    const restam = (corpo.match(/fill="#[0-9A-Fa-f]{6}"/g) || []).filter((f) => !vaza.has(f.slice(6, 13).toLowerCase()));
    if (restam.length === (corpo.match(/fill="#[0-9A-Fa-f]{6}"/g) || []).length) throw new Error(`${c.slug}: nenhuma cor para vazar`);
    svg = `${abre}<title>${c.slug}</title><defs><mask id="vazado" maskUnits="userSpaceOnUse" x="${x}" y="${y}" width="${w}" height="${h}">${mascara}</mask></defs><g mask="url(#vazado)">${corpo}</g></svg>`;
  }
  return { svg, vb: [x, y, w, h] };
}
const comMedidas = (svg, [x, y, w, h]) => {
  const altCm = (LARGURA_CM * h) / w;
  return {
    svg: svg.replace(/viewBox="[^"]+"/, `viewBox="${+x.toFixed(2)} ${+y.toFixed(2)} ${+w.toFixed(2)} ${+h.toFixed(2)}"`)
      .replace(/ width="[^"]+"/, ` width="${LARGURA_CM * 10}mm"`)
      .replace(/ height="[^"]+"/, ` height="${(altCm * 10).toFixed(1)}mm"`),
    altCm, proporcao: h / w,
  };
};

/* chunks extras logo depois do IHDR: pHYs (300 DPI) e sRGB (perfil sRGB IEC61966-2.1, intenção perceptual) */
function chunk(tipo, dados) {
  const t = Buffer.from(tipo);
  const len = Buffer.alloc(4); len.writeUInt32BE(dados.length);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(zlib.crc32(Buffer.concat([t, dados])) >>> 0);
  return Buffer.concat([len, t, dados, crc]);
}
function paraImpressao(png, dpi) {
  const ppm = Math.round(dpi / 0.0254);
  const phys = Buffer.alloc(9); phys.writeUInt32BE(ppm, 0); phys.writeUInt32BE(ppm, 4); phys.writeUInt8(1, 8);
  const fimIHDR = 8 + 25;
  return Buffer.concat([png.subarray(0, fimIHDR), chunk("sRGB", Buffer.from([0])), chunk("pHYs", phys), png.subarray(fimIHDR)]);
}

async function render(browser, svg, largura, altura, fundo) {
  const uri = "data:image/svg+xml;base64," + Buffer.from(svg).toString("base64");
  const pg = await browser.newPage({ viewport: { width: largura, height: altura }, deviceScaleFactor: 1 });
  await pg.setContent(`<style>html,body{margin:0;background:${fundo || "transparent"}}img{display:block;width:${largura}px;height:${altura}px}</style><img src="${uri}">`);
  await pg.waitForFunction(() => document.images[0].complete);
  const png = await pg.screenshot({ omitBackground: !fundo, clip: { x: 0, y: 0, width: largura, height: altura } });
  return { pg, png };
}

/* caixa da arte (pixels com tinta), em frações da imagem, para cortar a margem vazia */
async function caixaDaArte(pg, png) {
  return pg.evaluate(async (b64) => {
    const bmp = await createImageBitmap(await (await fetch("data:image/png;base64," + b64)).blob());
    const cv = new OffscreenCanvas(bmp.width, bmp.height);
    const cx = cv.getContext("2d"); cx.drawImage(bmp, 0, 0);
    const d = cx.getImageData(0, 0, bmp.width, bmp.height).data;
    let x0 = bmp.width, y0 = bmp.height, x1 = -1, y1 = -1;
    for (let y = 0; y < bmp.height; y++) for (let x = 0; x < bmp.width; x++) {
      if (d[(y * bmp.width + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    }
    return { x0: x0 / bmp.width, y0: y0 / bmp.height, x1: (x1 + 1) / bmp.width, y1: (y1 + 1) / bmp.height };
  }, png.toString("base64"));
}

(async () => {
  const browser = await chromium.launch();
  for (const c of ficha.camisetas) {
    const dir = path.join(__dirname, "camisetas", c.slug);
    fs.mkdirSync(dir, { recursive: true });
    const original = fs.readFileSync(path.join(RAIZ, "assets/camisetas", c.slug, "estampa.svg"), "utf8");
    const { svg: base, vb } = svgBase(original, c);

    /* mede a arte numa passada pequena e corta o viewBox rente a ela */
    const altBase = Math.round((BASE * vb[3]) / vb[2]);
    const medida = await render(browser, comMedidas(base, vb).svg, BASE, altBase);
    const k = await caixaDaArte(medida.pg, medida.png);
    await medida.pg.close();
    const corte = [vb[0] + k.x0 * vb[2], vb[1] + k.y0 * vb[3], (k.x1 - k.x0) * vb[2], (k.y1 - k.y0) * vb[3]];
    const { svg, altCm, proporcao } = comMedidas(base, corte);
    fs.writeFileSync(path.join(dir, `${c.slug}-estampa.svg`), svg);

    const alturaPx = Math.round(LARGURA_PX * proporcao);
    const final = await render(browser, svg, LARGURA_PX, alturaPx);
    fs.writeFileSync(path.join(dir, `${c.slug}-estampa-300dpi.png`), paraImpressao(final.png, DPI));
    await final.pg.close();

    /* prévia: a estampa com 60% da largura de um quadro da cor da malha */
    const lado = 1000, larg = 600, alt = Math.round(larg * proporcao);
    const uri = "data:image/svg+xml;base64," + Buffer.from(svg).toString("base64");
    const pg = await browser.newPage({ viewport: { width: lado, height: lado } });
    await pg.setContent(`<style>html,body{margin:0}body{width:${lado}px;height:${lado}px;background:${c.malha.alvo};display:grid;place-items:center}img{width:${larg}px;height:${alt}px}</style><img src="${uri}">`);
    await pg.waitForFunction(() => document.images[0].complete);
    fs.writeFileSync(path.join(dir, `${c.slug}-previa-malha.png`), await pg.screenshot());
    await pg.close();

    fs.copyFileSync(path.join(RAIZ, "assets/camisetas", c.slug, "solta.w1188.webp"), path.join(dir, `${c.slug}-referencia.webp`));
    console.log(`${c.slug}: ${LARGURA_CM} × ${altCm.toFixed(1)} cm · ${LARGURA_PX} × ${alturaPx} px${c.vazar ? ` · vazado ${c.vazar.join(", ")}` : ""}`);
  }
  await browser.close();
})();

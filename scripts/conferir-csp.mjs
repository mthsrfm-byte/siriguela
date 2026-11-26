// Confere se todo <script> em linha das páginas tem o hash na CSP do _headers.
// Uso: node scripts/conferir-csp.mjs (sai com erro e lista as páginas que faltam).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const raiz = new URL("..", import.meta.url).pathname;
const csp = readFileSync(join(raiz, "_headers"), "utf8").match(/Content-Security-Policy: (.*)/)?.[1] ?? "";
const ignorar = new Set([".git", "_originais-fotos", "_originais-videos", "producao", "node_modules"]);
const paginas = [];
const andar = (pasta) => {
  for (const nome of readdirSync(pasta)) {
    if (ignorar.has(nome)) continue;
    const caminho = join(pasta, nome);
    if (statSync(caminho).isDirectory()) andar(caminho);
    else if (nome.endsWith(".html")) paginas.push(caminho);
  }
};
andar(raiz);
const faltam = [];
for (const pagina of paginas) {
  for (const [, codigo] of readFileSync(pagina, "utf8").matchAll(/<script>([\s\S]*?)<\/script>/g)) {
    const hash = `'sha256-${createHash("sha256").update(codigo).digest("base64")}'`;
    if (!csp.includes(hash)) faltam.push(`${pagina.slice(raiz.length)}: ${hash}`);
  }
}
if (faltam.length) {
  console.error("Scripts em linha sem hash na CSP do _headers:\n" + faltam.join("\n"));
  process.exit(1);
}
console.log(`CSP ok: ${paginas.length} páginas conferidas.`);

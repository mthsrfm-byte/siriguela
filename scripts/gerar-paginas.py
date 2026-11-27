"""Gera uma página por sunga em colecao1/sunga/<slug>/index.html.

O site é estático, então cada endereço bonito (/colecao1/sunga/pipa/) é uma pasta
com uma cópia do produto.html. A tag <base> aponta para a raiz do site, assim os
caminhos relativos (assets/..., sungas/) continuam funcionando.

Rode de novo sempre que mudar o produto.html ou incluir/tirar uma sunga do catálogo:

    python3 scripts/gerar-paginas.py
"""
import json
import os
import re
import shutil

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PASTA = os.path.join(RAIZ, "colecao1", "sunga")

catalogo = open(os.path.join(RAIZ, "assets", "js", "produtos.js"), encoding="utf-8").read()
# só a lista das sungas: as camisetas (bloco "camisetas:" no fim do arquivo) têm páginas próprias
# (e sem o bloco "empresa", que também tem "nome:" e deslocava os nomes das sungas)
catalogo = catalogo.split("\n  produtos: [", 1)[1].split("\n  camisetas:")[0]
slugs = re.findall(r'slug:\s*"([^"]+)"', catalogo)
nomes = re.findall(r'nome:\s*"([^"]+)"', catalogo)
chamadas = re.findall(r'chamada:\s*"([^"]+)"', catalogo)
# sungas com capa recortada (PNG transparente em WebP: solta.w640/1080/1448.webp)
recortes = set(re.findall(r'slug:\s*"([^"]+)",\s*recorte:\s*true', catalogo))
modelo = open(os.path.join(RAIZ, "produto.html"), encoding="utf-8").read()

# começa do zero para não sobrar página de sunga que saiu do catálogo
if os.path.isdir(PASTA):
    shutil.rmtree(PASTA)

for slug, nome, chamada in zip(slugs, nomes, chamadas):
    html = modelo.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n  <base href="../../../">', 1)
    html = html.replace('  <meta name="robots" content="noindex">\n', '', 1)  # o molde fica fora do índice; as páginas geradas não
    html = html.replace('<body data-page="produto">', f'<body data-page="produto" data-slug="{slug}">', 1)
    html = re.sub(r"<title>.*?</title>", f"<title>{nome} · Siriguela</title>", html, count=1)
    html = re.sub(r'<meta name="description" content="[^"]*">',
                  f'<meta name="description" content="Sunga {nome}. {chamada}">', html, count=1)
    html = re.sub(r'<meta property="og:title" content="[^"]*">',
                  f'<meta property="og:title" content="Sunga {nome} · Siriguela">', html, count=1)
    html = re.sub(r'<meta property="og:description" content="[^"]*">',
                  f'<meta property="og:description" content="{chamada} Em breve na Siriguela.">', html, count=1)
    html = re.sub(r'<meta property="og:url" content="([^"]*)">',
                  lambda m: f'<meta property="og:url" content="{m.group(1)}colecao1/sunga/{slug}/">', html, count=1)
    html = re.sub(r'(<meta property="og:url" content="([^"]*)">)',
                  lambda m: f'{m.group(1)}\n  <link rel="canonical" href="{m.group(2)}">', html, count=1)
    # primeiras fotos da galeria já pedidas no <head> (o app.js só monta a galeria depois)
    def pre(f, sizes, larguras=(640, 1080, 1600)):
        b = f"assets/produtos/{slug}/{f}"
        srcset = ", ".join(f"{b}.w{w}.webp {w}w" for w in larguras)
        return f'  <link rel="preload" as="image" fetchpriority="high" imagesrcset="{srcset}" imagesizes="{sizes}">\n'
    capa = pre("solta", "(max-width: 700px) 88vw, 58vw", (640, 1080, 1448)) if slug in recortes else pre("frente", "100vw")
    html = html.replace('  <link rel="icon"', capa + '  <link rel="icon"', 1)
    destino = os.path.join(PASTA, slug)
    os.makedirs(destino, exist_ok=True)
    with open(os.path.join(destino, "index.html"), "w", encoding="utf-8") as f:
        f.write(html)
    print(f"colecao1/sunga/{slug}/")

"""Gera uma página por sunga em colecao1/sunga/<slug>/index.html.

O site é estático, então cada endereço bonito (/colecao1/sunga/pipa/) é uma pasta
com uma cópia do produto.html. A tag <base> aponta para a raiz do site, assim os
caminhos relativos (assets/..., index.html#colecao) continuam funcionando.

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
slugs = re.findall(r'slug:\s*"([^"]+)"', catalogo)
nomes = re.findall(r'nome:\s*"([^"]+)"', catalogo)
chamadas = re.findall(r'chamada:\s*"([^"]+)"', catalogo)
modelo = open(os.path.join(RAIZ, "produto.html"), encoding="utf-8").read()

# começa do zero para não sobrar página de sunga que saiu do catálogo
if os.path.isdir(PASTA):
    shutil.rmtree(PASTA)

for slug, nome, chamada in zip(slugs, nomes, chamadas):
    html = modelo.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n  <base href="../../../">', 1)
    html = html.replace('<body data-page="produto">', f'<body data-page="produto" data-slug="{slug}">', 1)
    html = re.sub(r"<title>.*?</title>", f"<title>{nome} · Siriguela</title>", html, count=1)
    html = re.sub(r'<meta name="description" content="[^"]*">',
                  f'<meta name="description" content="Sunga {nome}. {chamada}">', html, count=1)
    destino = os.path.join(PASTA, slug)
    os.makedirs(destino, exist_ok=True)
    with open(os.path.join(destino, "index.html"), "w", encoding="utf-8") as f:
        f.write(html)
    print(f"colecao1/sunga/{slug}/")

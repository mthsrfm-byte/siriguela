"""Gera versões WebP leves de cada foto de produto, para o srcset do site.

Para cada assets/produtos/<sunga>/<foto>.jpg|webp cria <foto>.w640.webp,
<foto>.w1080.webp e <foto>.w1600.webp (nunca maiores que a original).
O navegador escolhe a menor que serve para a tela. Também gera os posters
dos vídeos em WebP. Rode de novo sempre que trocar ou incluir uma foto:

    python3 scripts/variantes-webp.py      (precisa do Pillow)
"""
import glob
import os
import re
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LARGURAS = (640, 1080, 1600)
feitos = 0

for src in sorted(glob.glob(os.path.join(RAIZ, "assets", "produtos", "*", "*"))):
    if re.search(r"\.w\d+\.webp$", src) or not src.lower().endswith((".jpg", ".webp")):
        continue
    base = src.rsplit(".", 1)[0]
    alvos = [(w, f"{base}.w{w}.webp") for w in LARGURAS]
    if all(os.path.exists(a) and os.path.getmtime(a) >= os.path.getmtime(src) for _, a in alvos):
        continue
    im = Image.open(src).convert("RGB")
    for w, alvo in alvos:
        largura = min(w, im.width)
        out = im if largura == im.width else im.resize((largura, round(im.height * largura / im.width)), Image.LANCZOS)
        out.save(alvo, "WEBP", quality=78, method=6)
    feitos += 1

for src in sorted(glob.glob(os.path.join(RAIZ, "assets", "video", "*.jpg"))):
    alvo = src[:-4] + ".webp"
    if not os.path.exists(alvo) or os.path.getmtime(alvo) < os.path.getmtime(src):
        Image.open(src).convert("RGB").save(alvo, "WEBP", quality=72, method=6)
        feitos += 1

print(f"{feitos} imagens processadas")

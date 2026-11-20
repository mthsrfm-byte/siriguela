"""Uso: python3 scripts/recortes-quadrados.py  (precisa do Pillow: pip install pillow)
Recortes 1:1 focados na sunga, para os cards pequenos do lookbook.
frente: a partir de recorte-v.jpg (no corpo, de perto), centrado na virilha.
costas: a partir de costas-modelo-v.jpg, centrado na sunga.
Pontos em % da largura e da altura da foto original; lado do quadrado em % da largura."""
import os, sys
from PIL import Image

BASE = os.path.expanduser("~/Documents/GitHub/siriguela/assets/produtos")
OUT = BASE
FOCO = {
    #            frente (x, y, lado)     costas (x, y, lado)
    "pipa":      ((45, 77, 62), (37, 44, 46)),
    "caju":      ((46, 77, 62), (49, 44, 46)),
    "cobogo":    ((42, 71, 62), (45, 49, 46)),
    "mandacaru": ((52, 73, 62), (63, 68, 52)),
    "bacuri":    ((34, 71, 62), (62, 43, 46)),
    "cupuacu":   ((38, 72, 62), (56, 49, 46)),
    "pitanga":   ((55, 72, 62), (56, 49, 46)),
}
for slug, (fr, co) in FOCO.items():
    for src, (x, y, lado), nome in [("recorte-v", fr, "recorte-q"), ("costas-modelo-v", co, "costas-q")]:
        im = Image.open(f"{BASE}/{slug}/{src}.jpg").convert("RGB")
        W, H = im.size
        s = W * lado / 100
        cx, cy = W * x / 100, H * y / 100
        L = min(max(cx - s / 2, 0), W - s)
        T = min(max(cy - s / 2, 0), H - s)
        q = im.crop((round(L), round(T), round(L + s), round(T + s))).resize((800, 800), Image.LANCZOS)
        os.makedirs(f"{OUT}/{slug}", exist_ok=True)
        q.save(f"{OUT}/{slug}/{nome}.jpg", quality=86, optimize=True, progressive=True)
print("ok")

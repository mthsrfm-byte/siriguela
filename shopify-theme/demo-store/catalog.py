"""Demo catalog for the fictional brand Ferra Studio (Vereda preset).
Original copy. Covers test cases: sale, sold out, partial sizes, colors with
swatches, single variant, long name, no image, gift card, many images.
Run: python3 catalog.py  -> products.csv (Shopify product import)."""
import csv, os

SIZES = ["XS", "S", "M", "L", "XL"]
P = [
  dict(handle="linen-overshirt", title="Linen Overshirt", type="Shirts", tags="clothing, linen, new", price=168,
       options=[("Color", ["Clay", "Ink"]), ("Size", SIZES)], sold_out={("Clay", "XS"), ("Ink", "XL")},
       body="<p>A boxy overshirt cut from washed European linen that softens with every wear. Two patch pockets, horn buttons and a straight hem that sits right over a tee or under a coat.</p><p>Garment-dyed in small batches, so each piece carries slight variations in tone.</p>",
       images=4),
  dict(handle="cord-trouser", title="Cord Trouser", type="Trousers", tags="clothing, cotton, new", price=145,
       options=[("Waist", ["28", "30", "32", "34", "36"])],
       body="<p>Wide-wale cotton corduroy with a relaxed straight leg and a high rise. Finished with a button fly and deep side pockets.</p>", images=3),
  dict(handle="field-tote", title="Field Tote", type="Bags", tags="accessories, canvas, sale, new", price=98, compare=128,
       body="<p>Waxed cotton canvas that shrugs off rain, with vegetable-tanned leather handles that darken over time. Fits a laptop, a jumper and lunch.</p>", images=3),
  dict(handle="merino-crew", title="Merino Crew", type="Knitwear", tags="clothing, wool, new", price=132,
       options=[("Color", ["Oat", "Ink", "Rust"]), ("Size", ["S", "M", "L"])],
       body="<p>Fine-gauge merino knitted to a close, clean fit. Warm without bulk, soft enough to wear against the skin.</p>", images=3),
  dict(handle="stoneware-carafe", title="Stoneware Carafe", type="Objects", tags="home, ceramics", price=64, sold_out_all=True,
       body="<p>Wheel-thrown stoneware with a matte glaze outside and a gloss glaze inside. Holds one litre.</p>", images=2),
  dict(handle="herringbone-scarf", title="Herringbone Scarf", type="Accessories", tags="accessories, wool", price=89,
       body="<p>Woven lambswool in a quiet herringbone, finished with a short fringe. 190 × 35 cm.</p>", images=2),
  dict(handle="card-sleeve", title="Card Sleeve", type="Accessories", tags="accessories, leather, sale, new", price=52, compare=65,
       options=[("Color", ["Tan", "Black"])],
       body="<p>A single piece of vegetable-tanned leather, folded and hand-stitched. Holds six cards and a few notes.</p>", images=2),
  dict(handle="heavy-tee-long-name", title="Heavyweight Cotton Tee with Dropped Shoulder and Ribbed Collar", type="Tees", tags="clothing, cotton",
       price=48, options=[("Size", SIZES)],
       body="<p>Dense 260 gsm cotton jersey that holds its shape. The long product name is intentional: it tests how cards and pages wrap.</p>", images=2),
  dict(handle="wool-overcoat", title="Wool Overcoat", type="Outerwear", tags="clothing, wool, new", price=420,
       options=[("Size", ["S", "M", "L"])], sold_out={("L",)},
       body="<p>A single-breasted overcoat in boiled wool, unlined so it drapes rather than stands. Falls just below the knee.</p>", images=5),
  dict(handle="linen-napkins", title="Linen Napkins, Set of Four", type="Objects", tags="home, linen", price=38,
       body="<p>Stonewashed linen napkins with mitred corners. 45 × 45 cm.</p>", images=0),
  dict(handle="canvas-cap", title="Canvas Cap", type="Accessories", tags="accessories, canvas, new", price=42,
       options=[("Color", ["Olive", "Sand", "Ink", "Clay", "Moss", "Rust", "Stone", "Navy"])],
       body="<p>Six-panel cap in washed canvas with a brass buckle. Eight colours to test swatch overflow.</p>", images=2),
  dict(handle="gift-card", title="Gift Card", type="Gift card", tags="gift", price=50,
       options=[("Value", ["50", "100", "200"])], gift=True,
       body="<p>Let someone choose. Delivered by email on the date you pick, with your message.</p>", images=1),
]

COLLECTIONS = {
  "New arrivals": "tag:new", "Clothing": "tag:clothing", "Accessories": "tag:accessories",
  "Home": "tag:home", "Sale": "tag:sale", "Empty collection": "tag:nothing-has-this-tag",
}

HEADERS = ["Handle","Title","Body (HTML)","Vendor","Product Category","Type","Tags","Published",
  "Option1 Name","Option1 Value","Option2 Name","Option2 Value","Option3 Name","Option3 Value",
  "Variant SKU","Variant Grams","Variant Inventory Tracker","Variant Inventory Qty","Variant Inventory Policy",
  "Variant Fulfillment Service","Variant Price","Variant Compare At Price","Variant Requires Shipping","Variant Taxable",
  "Image Src","Image Position","Image Alt Text","Gift Card","Status"]

def rows(base_url):
    out = []
    for p in P:
        opts = p.get("options") or [("Title", ["Default Title"])]
        combos = [[]]
        for _, vals in opts:
            combos = [c + [v] for c in combos for v in vals]
        imgs = [f"{base_url}/{p['handle']}-{i+1}.jpg" for i in range(p["images"])] if base_url else []
        n = max(len(combos), len(imgs))
        for i in range(n):
            r = dict.fromkeys(HEADERS, "")
            r["Handle"] = p["handle"]
            if i == 0:
                r.update({"Title": p["title"], "Body (HTML)": p["body"], "Vendor": "Ferra Studio", "Type": p["type"],
                          "Tags": p["tags"], "Published": "TRUE", "Gift Card": "TRUE" if p.get("gift") else "FALSE", "Status": "active"})
            if i < len(combos):
                c = combos[i]
                for k, (name, _) in enumerate(opts):
                    r[f"Option{k+1} Name"] = name if i == 0 else ""
                    r[f"Option{k+1} Value"] = c[k]
                key = tuple(c)
                sold = p.get("sold_out_all") or key in p.get("sold_out", set()) or (c[-1],) in p.get("sold_out", set())
                r.update({"Variant SKU": f"FS-{p['handle'][:10].upper()}-{i+1:02d}", "Variant Grams": "400",
                          "Variant Inventory Tracker": "" if p.get("gift") else "shopify",
                          "Variant Inventory Qty": "0" if sold else "12", "Variant Inventory Policy": "deny",
                          "Variant Fulfillment Service": "manual", "Variant Price": f"{p['price'] if not p.get('gift') else c[0]}.00",
                          "Variant Compare At Price": f"{p['compare']}.00" if p.get("compare") else "",
                          "Variant Requires Shipping": "FALSE" if p.get("gift") else "TRUE", "Variant Taxable": "TRUE"})
            if i < len(imgs):
                r.update({"Image Src": imgs[i], "Image Position": str(i + 1), "Image Alt Text": f"{p['title']}, view {i + 1}"})
            out.append(r)
    return out

if __name__ == "__main__":
    base = os.environ.get("IMAGE_BASE_URL", "")
    here = os.path.dirname(__file__)
    with open(os.path.join(here, "products.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=HEADERS); w.writeheader(); w.writerows(rows(base))
    print("products.csv written", "(no images: set IMAGE_BASE_URL once photos are hosted)" if not base else "")

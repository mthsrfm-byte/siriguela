"""Seeds a development store with the Ferra Studio demo catalog through the
Admin GraphQL API, using `shopify store execute` (requires `shopify store auth`).
Usage: python3 seed.py vereda-theme-dev.myshopify.com
Idempotent enough for test stores: products are upserted by handle (productSet)."""
import json, os, subprocess, sys, tempfile, mimetypes
from catalog import P

STORE = sys.argv[1]
HERE = os.path.dirname(os.path.abspath(__file__))
SWATCH = {"Clay": "#A4573F", "Ink": "#1E2430", "Oat": "#D8CBB5", "Rust": "#A4573F", "Tan": "#B98D5E", "Black": "#222222",
          "Olive": "#5B6340", "Sand": "#CDB894", "Moss": "#4C5E52", "Stone": "#9A948A", "Navy": "#22304A"}


def gql(query, variables=None, mutation=True):
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
        json.dump(variables or {}, f)
        vf = f.name
    cmd = ["shopify", "store", "execute", "--store", STORE, "--query", query, "--variable-file", vf, "--no-color"]
    if mutation:
        cmd.append("--allow-mutations")
    out = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
    os.unlink(vf)
    txt = out.stdout.strip()
    try:
        return json.loads(txt[txt.index("{"):])
    except Exception:
        raise RuntimeError(f"GraphQL failed: {out.stdout[-800:]} {out.stderr[-800:]}")


def check(res, key):
    errs = (res.get(key) or {}).get("userErrors") or []
    if errs:
        print("  userErrors:", errs)
    return res.get(key)


def upload(path):
    size = os.path.getsize(path)
    name = os.path.basename(path)
    r = gql("""mutation($input:[StagedUploadInput!]!){ stagedUploadsCreate(input:$input){ stagedTargets{ url resourceUrl parameters{ name value } } userErrors{ field message } } }""",
            {"input": [{"resource": "IMAGE", "filename": name, "mimeType": mimetypes.guess_type(name)[0], "httpMethod": "POST", "fileSize": str(size)}]})
    t = check(r, "stagedUploadsCreate")["stagedTargets"][0]
    args = ["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", t["url"]]
    for p in t["parameters"]:
        args += ["--form-string", f"{p['name']}={p['value']}"]
    args += ["-F", f"file=@{path}"]
    code = subprocess.run(args, capture_output=True, text=True).stdout
    if not code.startswith("2"):
        raise RuntimeError(f"upload {name} -> {code}")
    return t["resourceUrl"]


def main():
    base = gql("{ locations(first:1){nodes{id}} publications(first:10){nodes{id name}} }", mutation=False)
    loc = base["locations"]["nodes"][0]["id"]
    online = [p["id"] for p in base["publications"]["nodes"] if p["name"] in ("Online Store", "Loja virtual")][0]

    for p in P:
        print("product", p["handle"])
        opts = p.get("options") or []
        combos = [[]]
        for _, vals in opts:
            combos = [c + [v] for c in combos for v in vals]
        files = []
        for k in range(p["images"]):
            src = upload(os.path.join(HERE, "placeholder-img", f"{p['handle']}-{k+1}.jpg"))
            files.append({"originalSource": src, "contentType": "IMAGE", "alt": f"{p['title']}, view {k+1}"})
        product_options = [{"name": n, "position": i + 1, "values": [{"name": v} for v in vals]} for i, (n, vals) in enumerate(opts)]
        variants = []
        for c in combos:
            sold = p.get("sold_out_all") or tuple(c) in p.get("sold_out", set()) or (c[-1],) in p.get("sold_out", set()) if c else p.get("sold_out_all")
            price = c[0] if p.get("gift") else p["price"]
            v = {"price": f"{price}.00",
                 "optionValues": [{"optionName": opts[i][0], "name": val} for i, val in enumerate(c)] if c else [{"optionName": "Title", "name": "Default Title"}],
                 "inventoryPolicy": "DENY"}
            if p.get("compare"):
                v["compareAtPrice"] = f"{p['compare']}.00"
            if not p.get("gift"):
                v["inventoryItem"] = {"tracked": True, "requiresShipping": True}
                v["inventoryQuantities"] = [{"locationId": loc, "name": "available", "quantity": 0 if sold else 12}]
            variants.append(v)
        if not opts:
            product_options = [{"name": "Title", "position": 1, "values": [{"name": "Default Title"}]}]
        inp = {"handle": p["handle"], "title": p["title"], "descriptionHtml": p["body"], "vendor": "Ferra Studio",
               "productType": p["type"], "tags": [t.strip() for t in p["tags"].split(",")], "status": "ACTIVE",
               "productOptions": product_options, "variants": variants}
        if p.get("gift"):
            inp["giftCard"] = True
        if files:
            inp["files"] = files
        r = gql("""mutation($input:ProductSetInput!,$id:ProductSetIdentifiers){ productSet(input:$input, identifier:$id, synchronous:true){ product{ id options{ id name optionValues{ id name } } } userErrors{ field message } } }""",
                {"input": inp, "id": {"handle": p["handle"]}})
        res = check(r, "productSet")
        prod = res and res.get("product")
        if not prod:
            continue
        gql("""mutation($id:ID!,$input:[PublicationInput!]!){ publishablePublish(id:$id, input:$input){ userErrors{ field message } } }""",
            {"id": prod["id"], "input": [{"publicationId": online}]})
        # Color swatches need the option linked to the category metafield (admin, manual).

    collections = [("New arrivals", "new"), ("Clothing", "clothing"), ("Accessories", "accessories"), ("Home", "home"), ("Sale", "sale"), ("Empty collection", "nothing-has-this-tag")]
    coll_ids = {}
    for title, tag in collections:
        handle = title.lower().replace(" ", "-")
        found = gql("query($q:String!){ collections(first:1, query:$q){ nodes{ id } } }", {"q": f"handle:{handle}"}, mutation=False)["collections"]["nodes"]
        if found:
            coll_ids[title] = found[0]["id"]
            continue
        r = gql("""mutation($input:CollectionInput!){ collectionCreate(input:$input){ collection{ id } userErrors{ field message } } }""",
                {"input": {"title": title, "handle": handle, "descriptionHtml": f"<p>{title} from the Ferra Studio season.</p>",
                           "ruleSet": {"appliedDisjunctively": False, "rules": [{"column": "TAG", "relation": "EQUALS", "condition": tag}]}}})
        c = check(r, "collectionCreate")
        if c and c.get("collection"):
            coll_ids[title] = c["collection"]["id"]
            gql("""mutation($id:ID!,$input:[PublicationInput!]!){ publishablePublish(id:$id, input:$input){ userErrors{ field message } } }""",
                {"id": c["collection"]["id"], "input": [{"publicationId": online}]})
    print("collections", list(coll_ids))

    pages = {
        "About": "<p>Ferra Studio makes a small number of things in natural materials: linen, wool, waxed canvas, leather and clay. We work with five workshops in Portugal, Italy and Spain, and we visit each of them every season.</p><p>Nothing is produced for a sale rack. When a piece sells out it may come back next season, usually a little better than before.</p>",
        "Shipping": "<p>Orders ship within two business days in recycled packaging. Standard delivery takes three to five business days. Free shipping on orders over $150.</p>",
        "Returns": "<p>You have 30 days to return unworn pieces with their tags.</p>",
        "Care guide": "<p><strong>Linen</strong>: wash cool, line dry. <strong>Wool</strong>: air it out, dry flat. <strong>Waxed canvas</strong>: brush off dirt, re-wax yearly. <strong>Leather</strong>: a drop of balm each season.</p>",
        "Contact": "<p>We answer every message within one business day, Monday to Friday.</p>",
    }
    page_ids = {}
    for title, body in pages.items():
        handle = title.lower().replace(" ", "-")
        found = gql("query($q:String!){ pages(first:1, query:$q){ nodes{ id } } }", {"q": f"handle:{handle}"}, mutation=False)["pages"]["nodes"]
        if found:
            page_ids[title] = found[0]["id"]
            continue
        page = {"title": title, "handle": handle, "body": body, "isPublished": True}
        if title == "Contact":
            page["templateSuffix"] = "contact"
        r = gql("""mutation($page:PageCreateInput!){ pageCreate(page:$page){ page{ id } userErrors{ field message } } }""", {"page": page})
        c = check(r, "pageCreate")
        if c and c.get("page"):
            page_ids[title] = c["page"]["id"]
    print("pages", list(page_ids))

    blogs = gql("{ blogs(first:5){ nodes{ id handle } } }", mutation=False)["blogs"]["nodes"]
    blog = next((b for b in blogs if b["handle"] == "journal"), None)
    if not blog:
        r = gql("""mutation($blog:BlogCreateInput!){ blogCreate(blog:$blog){ blog{ id handle } userErrors{ field message } } }""", {"blog": {"title": "Journal", "handle": "journal"}})
        blog = check(r, "blogCreate")["blog"]
        articles = [
            ("Notes from the linen mill", "Our linen is woven on shuttle looms in northern Portugal, then washed twice before it reaches the cutting table.", ["Materials", "Makers"]),
            ("How we choose a workshop", "We look for people who would rather make fewer pieces well, a place we can visit, and a fair price.", ["Makers"]),
            ("A field guide to waxed canvas", "Waxed canvas is cotton duck soaked in paraffin and beeswax. It creases where you use it most.", ["Materials", "Care"]),
        ]
        for title, body, tags in articles:
            r = gql("""mutation($article:ArticleCreateInput!){ articleCreate(article:$article){ article{ id } userErrors{ field message } } }""",
                    {"article": {"blogId": blog["id"], "title": title, "body": f"<p>{body}</p>", "tags": tags, "isPublished": True, "author": {"name": "Studio"}}})
            check(r, "articleCreate")
    print("blog", blog["handle"])

    menus = gql("{ menus(first:10){ nodes{ id handle title } } }", mutation=False)["menus"]["nodes"]
    def link(title, type_, rid=None, url=None, items=None):
        d = {"title": title, "type": type_, "items": items or []}
        if rid:
            d["resourceId"] = rid
        if url:
            d["url"] = url
        return d
    main_items = [
        link("Shop", "CATALOG", items=[link(t, "COLLECTION", coll_ids[t]) for t in ["New arrivals", "Clothing", "Accessories", "Home", "Sale"] if t in coll_ids]),
        link("Journal", "BLOG", blog["id"]),
        link("About", "PAGE", page_ids.get("About")),
    ]
    footer_items = [link(t, "PAGE", page_ids[t]) for t in ["Shipping", "Returns", "Care guide", "Contact"] if t in page_ids]
    for handle, title, items in [("main-menu", "Main menu", main_items), ("footer", "Footer menu", footer_items)]:
        m = next((m for m in menus if m["handle"] == handle), None)
        if m:
            r = gql("""mutation($id:ID!,$title:String!,$items:[MenuItemUpdateInput!]!){ menuUpdate(id:$id, title:$title, items:$items){ menu{ id } userErrors{ field message } } }""",
                    {"id": m["id"], "title": title, "items": items})
            check(r, "menuUpdate")
        else:
            r = gql("""mutation($title:String!,$handle:String!,$items:[MenuItemCreateInput!]!){ menuCreate(title:$title, handle:$handle, items:$items){ menu{ id } userErrors{ field message } } }""",
                    {"title": title, "handle": handle, "items": items})
            check(r, "menuCreate")
    print("menus done")


if __name__ == "__main__":
    main()

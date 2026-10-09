import re, sys
CAT = r"\b(amb|però|perquè|també|només|avui|demà|nits?|hostes?|neteja|neteges|escrivint|automàticament|enviats?|missatges?|setmana|gràcies|més|això|aquest|aquesta|fins|pis|mig|pagaments?|configuració|tancar|estàs|teu|teva|vostè|cap altra|dades|dia a dia del)\b"
ESP = r"\b(también|pero|porque|mañana|noches?|huésped(?:es)?|limpiezas?|mensajes?|semana|gracias|está|más|esto|este|esta|hasta|días|piso|automáticamente|enviados?|escribiendo|reservas|precios|tarjeta|cuenta|ahora|nuestro|nuestra|usted)\b"
def scan(path, rx, label):
    txt=open(path).read()
    pages=re.split(r"\n========== ", txt)
    for pg in pages[1:]:
        url=pg.split("\n",1)[0]
        if label=='CA' and re.search(r"/ca/(blog/|alternativas/)", url): continue
        body=pg.split("\n",3)[-1]
        hits={}
        for m in re.finditer(rx, body, flags=re.I):
            w=m.group(0)
            ctx=body[max(0,m.start()-35):m.end()+35].replace("\n"," ")
            hits.setdefault(w.lower(), ctx)
        if hits:
            print(f"{label} {url.replace('http://127.0.0.1:8095','')}: " + " | ".join(f"«{k}» …{v}…" for k,v in list(hits.items())[:6]))
scan(sys.argv[1], CAT, 'ES')
scan(sys.argv[2], ESP, 'CA')

"""Genera tutto il materiale del calendario dell'Avvento.

Uso (dalla cartella principale del repo):
    python3 strumenti/genera.py
    node strumenti/stampa-pdf.js      # opzionale: crea i PDF da stampare

Crea:
    disegni/<lettera>.svg   disegni da colorare
    qr/<lettera>.svg        QR code verso la pagina della lettera
    p/<codice>.html         pagina del sito per ogni lettera (nome casuale: è una sorpresa)
    index.html              il calendario sul sito
    stampa/carte-8.html     8 carte per foglio A4
    stampa/carte-12.html    12 carte per foglio A4
"""
import html
import json
import os
import sys

import segno

QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, QUI)
from disegni import svg as svg_disegno  # noqa: E402
from lettere import (MARGINE, TRATTI, larghezza_riga, righe_per,  # noqa: E402
                     svg_riga)

RADICE = os.path.dirname(QUI)
SITO = "https://mstr2627.github.io/calendario-avvento/"
PAROLE = json.load(open(os.path.join(RADICE, "dati", "parole.json"), encoding="utf-8"))


def scrivi(rel, testo):
    p = os.path.join(RADICE, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8", newline="\n") as f:
        f.write(testo)


def url_lettera(v):
    return f"{SITO}p/{v['codice']}.html"


def qr_path(url):
    q = segno.make(url, error="m")
    righe = list(q.matrix)
    d = []
    for y, riga in enumerate(righe):
        for x, v in enumerate(riga):
            if v:
                d.append(f"M{x} {y}h1v1h-1z")
    return len(righe), "".join(d)


def qr_svg(url, x=0, y=0, lato=None):
    n, d = qr_path(url)
    dim = f'x="{x}" y="{y}" width="{lato}" height="{lato}" ' if lato else ""
    return (f'<svg {dim}viewBox="-2 -2 {n + 4} {n + 4}" xmlns="http://www.w3.org/2000/svg" '
            f'shape-rendering="crispEdges"><rect x="-2" y="-2" width="{n + 4}" height="{n + 4}" fill="#fff"/>'
            f'<path d="{d}" fill="#000"/></svg>')


ALTEZZA_SCRITTA = 0.36  # altezza massima delle lettere rispetto al disegno


def misura_parola(parola, w, h, n):
    righe = righe_per(parola, n)
    larg = max(larghezza_riga(r, i == 0) for i, r in enumerate(righe))
    alt_u = len(righe) * (100 + 2 * MARGINE) + (len(righe) - 1) * 24
    return min(w / larg, h / alt_u), righe, alt_u


def parola_svg(parola, x0, y0, w, h, n, s_max):
    s, righe, alt_u = misura_parola(parola, w, h, n)
    s = min(s, s_max)
    out = []
    y = y0 + (h - alt_u * s) / 2 + MARGINE * s
    for i, r in enumerate(righe):
        g, larg = svg_riga(r, prima_lettera=(i == 0))
        x = x0 + (w - larg * s) / 2
        out.append(f'<g transform="translate({x:.2f} {y:.2f}) scale({s:.4f})">{g}</g>')
        y += (100 + 2 * MARGINE + 24) * s
    return "".join(out)


CORNICE_PAD = 1.6     # spazio tra il QR e la cornice (mm)
CORNICE_TRATTO = 0.6  # spessore della cornice (mm)
CORNICE_RAGGIO = 3.5  # raggio degli angoli arrotondati (mm)


def carta(v, W, H, lato_qr):
    m = 3.5
    con_qr = lato_qr > 0
    cornice = lato_qr + 2 * CORNICE_PAD if con_qr else 0
    fx, fy = W - m - cornice, m
    # Spazio per il disegno: centrato nella carta se non tocca il QR,
    # altrimenti centrato nella parte a sinistra del QR.
    spazio_centrato = W - 2 * (cornice + m + (1 if con_qr else 0))
    spazio_sinistra = fx - 2 - m if con_qr else spazio_centrato
    # Prova parola su una riga (disegno grande) o su due righe (disegno più piccolo):
    # vince quella con le lettere più alte; a parità, una riga.
    scelte = []
    # Senza QR il disegno può essere più grande.
    quote = ((0.6, 1), (0.46, 2)) if con_qr else ((0.72, 1), (0.58, 2))
    for quota, n in quote:
        img = min(H * quota, max(spazio_centrato, spazio_sinistra))
        zona = (m, m + img + 1.5, W - 2 * m, H - (m + img + 1.5) - m)
        # La scritta resta più piccola del disegno (come nell'esempio di Chiara).
        s_max = ALTEZZA_SCRITTA * H * 0.6 / 100
        s = min(misura_parola(v["parola"], zona[2], zona[3], n)[0], s_max)
        scelte.append((s * (1.0 if n == 1 else 0.85), img, zona, n, s_max))
    _, img, zona, n, s_max = max(scelte, key=lambda c: c[0])
    ix = (W - img) / 2 if img <= spazio_centrato else m + (spazio_sinistra - img) / 2
    parti = [
        f'<svg class="carta" width="{W}mm" height="{H}mm" viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg">',
        f'<rect x="0.15" y="0.15" width="{W - 0.3}" height="{H - 0.3}" fill="#fff" stroke="#bbb" '
        f'stroke-width="0.3" stroke-dasharray="2 1.5"/>',
        svg_disegno(v["lettera"], f'x="{ix:.2f}" y="{m}" width="{img:.2f}" height="{img:.2f}"'),
        (f'<rect x="{fx:.2f}" y="{fy:.2f}" width="{cornice:.2f}" height="{cornice:.2f}" rx="{CORNICE_RAGGIO}" '
         f'fill="#fff" stroke="#000" stroke-width="{CORNICE_TRATTO}"/>'
         + qr_svg(url_lettera(v), fx + CORNICE_PAD, fy + CORNICE_PAD, lato_qr)) if con_qr else "",
        parola_svg(v["parola"], *zona, n, s_max),
        "</svg>",
    ]
    return "".join(parti)


def pagina_stampa(colonne, righe, lato_qr):
    W, H = 210 / colonne, 297 / righe
    per_foglio = colonne * righe
    fogli = []
    for i in range(0, len(PAROLE), per_foglio):
        carte = "".join(carta(v, W, H, lato_qr) for v in PAROLE[i:i + per_foglio])
        fogli.append(f'<section class="foglio">{carte}</section>')
    return f"""<!doctype html>
<html lang="it"><head><meta charset="utf-8">
<title>Carte da stampare ({per_foglio} per foglio)</title>
<style>
@page {{ size: A4; margin: 0; }}
html, body {{ margin: 0; padding: 0; background: #fff; }}
.foglio {{ width: 210mm; height: 297mm; display: grid; grid-template-columns: repeat({colonne}, {W}mm);
  grid-auto-rows: {H}mm; overflow: hidden; break-after: page; }}
.foglio:last-child {{ break-after: auto; }}
.carta {{ display: block; }}
@media screen {{ body {{ background: #888; }} .foglio {{ background: #fff; margin: 10px auto; box-shadow: 0 2px 8px #0005; }} }}
</style></head><body>
{''.join(fogli)}
</body></html>
"""


def pagina_lettera(v):
    L = v["lettera"]
    parola = v["parola"]
    lingua = "en-GB" if v["lingua"] == "en" else "it-IT"
    nota = f'<p class="nota">{html.escape(v["nota"])}</p>' if v.get("nota") else ""
    canzone = ""
    if v.get("canzone"):
        c = v["canzone"]
        canzone = (f'<section class="riquadro canzone"><h2>🎵 La canzone</h2>'
                   f'<a class="bottone grande" href="{html.escape(c["url"])}" target="_blank" rel="noopener">'
                   f'Ascolta «{html.escape(c["titolo"])}»</a></section>')
    tratti = {ch: TRATTI[ch] for ch in sorted(set(parola.replace(" ", "")))}
    dati = json.dumps({"parola": parola, "lingua": lingua, "pronuncia": v.get("pronuncia", parola.lower()),
                       "tratti": tratti}, ensure_ascii=False)
    return f"""<!doctype html>
<html lang="it"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{L} come {parola.title()}</title>
<meta name="robots" content="noindex">
<link rel="stylesheet" href="../assets/stile.css">
</head><body class="pagina-lettera">
<header class="testa"><span class="lettera-grande">{L}</span><h1>{L} come <b>{html.escape(parola)}</b></h1></header>
<main>
<section class="riquadro">
  <button class="bottone grande" id="ascolta">🔊 Ascolta la parola</button>
  {nota}
</section>
{canzone}
<section class="riquadro attivita" id="attivita">
  <h2 class="titolo-attivita"></h2>
  <p class="aiuto istruzioni"></p>
  <button class="bottone leggi-istruzioni">🔊 Leggi le istruzioni</button>
  <div class="campo"></div>
  <button class="bottone ricomincia">↺ Ricomincia</button>
</section>
<section class="riquadro">
  <h2>✏️ Ripassa la parola</h2>
  <p class="aiuto">Ripassa le lettere col dito o col mouse.</p>
  <div class="lavagna"><canvas id="sfondo"></canvas><canvas id="tratto"></canvas></div>
  <button class="bottone" id="pulisci-lavagna">Cancella</button>
</section>
</main>
<script>window.LETTERA = {dati};</script>
<script src="../assets/attivita/comune.js"></script>
<script src="../assets/attivita/{L.lower()}.js"></script>
<script src="../assets/lettera.js"></script>
</body></html>
"""


def pagina_indice():
    # Nessun elenco e nessun link alle lettere: ogni lettera si scopre solo col suo QR code.
    return """<!doctype html>
<html lang="it"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Calendario dell'Avvento</title>
<link rel="stylesheet" href="assets/stile.css">
</head><body class="pagina-indice">
<header class="testa"><h1>Calendario dell'Avvento <span>dalla A alla Z</span></h1></header>
<main><section class="riquadro benvenuto">
<p class="stelle" aria-hidden="true">⭐ 🎄 ⭐</p>
<p>Ogni lettera è una sorpresa!</p>
<p>Pesca la tua carta dal calendario e inquadra il <b>QR code</b> con un telefono o un tablet
per scoprire la tua parola, ascoltarla, colorarla e ripassarla.</p>
</section></main>
</body></html>
"""


def main():
    for v in PAROLE:
        L = v["lettera"].lower()
        scrivi(f"disegni/{L}.svg", svg_disegno(v["lettera"]) + "\n")
        scrivi(f"qr/{L}.svg", qr_svg(url_lettera(v)) + "\n")
        scrivi(f"p/{v['codice']}.html", pagina_lettera(v))
    scrivi("index.html", pagina_indice())
    scrivi("stampa/carte-8.html", pagina_stampa(2, 4, 25))
    scrivi("stampa/carte-12.html", pagina_stampa(3, 4, 20))
    scrivi("stampa/carte-8-senza-qr.html", pagina_stampa(2, 4, 0))
    scrivi("stampa/carte-12-senza-qr.html", pagina_stampa(3, 4, 0))
    print(f"Fatto: {len(PAROLE)} lettere.")


if __name__ == "__main__":
    main()

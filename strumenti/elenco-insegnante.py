"""Elenco per l'insegnante: giorno, lettera, parola, attività, link e QR.

Uso: python3 strumenti/elenco-insegnante.py   (poi node strumenti/stampa-pdf.js)
Il file creato (stampa/insegnante.html / .pdf) NON va nel repository: svela tutte le lettere.
"""
import datetime
import html
import os
import re
import sys

QUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, QUI)
from genera import PAROLE, RADICE, qr_svg, scrivi, url_lettera  # noqa: E402

INIZIO = datetime.date(2026, 11, 30)
GIORNI = ["lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica"]
MESI = ["", "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto",
        "settembre", "ottobre", "novembre", "dicembre"]


def attivita(lettera):
    testo = open(os.path.join(RADICE, "assets", "attivita", lettera.lower() + ".js"), encoding="utf-8").read()
    emoji = re.search(r"emoji: '([^']*)'", testo).group(1)
    m = re.search(r"titolo: (?:\"([^\"]*)\"|'([^']*)')", testo)
    return emoji, m.group(1) or m.group(2)


def main():
    righe = []
    for i, v in enumerate(PAROLE):
        d = INIZIO + datetime.timedelta(days=i)
        festivo = d.weekday() >= 5 or (d.month == 12 and d.day in (8, 25))
        emoji, titolo = attivita(v["lettera"])
        url = url_lettera(v)
        canzone = " 🎵" if v.get("canzone") else ""
        righe.append(f"""<tr class="{'festivo' if festivo else ''}">
<td class="giorno"><b>{d.day} {MESI[d.month]}</b><br><span>{GIORNI[d.weekday()]}</span></td>
<td class="lettera">{v['lettera']}</td>
<td><b>{html.escape(v['parola'])}</b><br><span>{emoji} {html.escape(titolo)}{canzone}</span></td>
<td class="link"><a href="{url}">{url.replace('https://', '')}</a></td>
<td class="qr">{qr_svg(url)}</td></tr>""")
    pagina = f"""<!doctype html>
<html lang="it"><head><meta charset="utf-8"><title>Calendario dell'Avvento: elenco per l'insegnante</title>
<style>
@page {{ size: A4; margin: 12mm 12mm 14mm; }}
body {{ font-family: "Trebuchet MS", Arial, sans-serif; color: #2b2118; font-size: 10.5pt; margin: 0; }}
h1 {{ color: #c62828; font-size: 18pt; margin: 0 0 2mm; }}
p.intro {{ margin: 0 0 4mm; font-size: 9.5pt; }}
table {{ width: 100%; border-collapse: collapse; }}
th {{ text-align: left; font-size: 9pt; color: #6d4c41; border-bottom: 1.5pt solid #c62828; padding: 1.5mm 2mm; }}
td {{ border-bottom: 0.5pt solid #ddd; padding: 1.2mm 2mm; vertical-align: middle; }}
tr {{ break-inside: avoid; }}
tr.festivo td {{ background: #f5f5f5; }}
.giorno {{ width: 26mm; }} .giorno span, td span {{ font-size: 8.5pt; color: #666; }}
.lettera {{ width: 12mm; font-size: 20pt; font-weight: 800; color: #2e7d32; text-align: center; }}
.link {{ font-size: 8pt; word-break: break-all; width: 58mm; }} .link a {{ color: #1565c0; text-decoration: none; }}
.qr {{ width: 17mm; }} .qr svg {{ width: 16mm; height: 16mm; display: block; }}
</style></head><body>
<h1>Calendario dell'Avvento dalla A alla Z</h1>
<p class="intro">Una lettera al giorno dal 30 novembre al 25 dicembre. Il link (o il QR) apre la pagina della lettera:
parola letta ad alta voce, gioco e ripasso. 🎵 = c'è anche la canzone. In grigio sabati, domeniche e festivi.
Questo elenco è solo per l'insegnante: le pagine non hanno link tra loro, così ogni lettera resta una sorpresa.</p>
<table><thead><tr><th>Giorno</th><th></th><th>Parola e attività</th><th>Link</th><th>QR</th></tr></thead>
<tbody>{''.join(righe)}</tbody></table>
</body></html>
"""
    scrivi("stampa/insegnante.html", pagina)
    print("Creato stampa/insegnante.html")


if __name__ == "__main__":
    main()

"""Lettere in stampatello maiuscolo come tratti singoli (alte 100 unità).

Da questi tratti si ottengono sia la prima lettera "grassa e vuota" da colorare
sia le lettere tratteggiate da ripassare. Gli stessi tratti sono usati sul sito
per il gioco del ripasso col dito.
"""

# lettera: (larghezza, percorso SVG). y=0 in alto, y=100 sulla riga.
TRATTI = {
    "A": (60, "M0 100 L30 0 L60 100 M12 62 L48 62"),
    "B": (52, "M0 100 L0 0 L26 0 A22 24 0 0 1 26 48 L0 48 M26 48 A26 26 0 0 1 26 100 L0 100"),
    "C": (56, "M53 18 A30 50 0 1 0 53 82"),
    "D": (58, "M0 0 L0 100 L18 100 A40 50 0 0 0 18 0 Z"),
    "E": (48, "M48 0 L0 0 L0 100 L48 100 M0 50 L40 50"),
    "F": (48, "M48 0 L0 0 L0 100 M0 50 L40 50"),
    "G": (60, "M53 18 A30 50 0 1 0 60 55 L34 55"),
    "H": (56, "M0 0 L0 100 M56 0 L56 100 M0 50 L56 50"),
    "I": (0, "M0 0 L0 100"),
    "J": (42, "M42 0 L42 72 C42 92 32 100 21 100 C8 100 0 92 0 80"),
    "K": (52, "M0 0 L0 100 M52 0 L0 60 M18 40 L54 100"),
    "L": (46, "M0 0 L0 100 L46 100"),
    "M": (70, "M0 100 L0 0 L35 64 L70 0 L70 100"),
    "N": (58, "M0 100 L0 0 L58 100 L58 0"),
    "O": (64, "M32 0 A32 50 0 1 1 32 100 A32 50 0 1 1 32 0 Z"),
    "P": (52, "M0 100 L0 0 L26 0 A26 26 0 0 1 26 52 L0 52"),
    "Q": (66, "M32 0 A32 50 0 1 1 32 100 A32 50 0 1 1 32 0 Z M40 72 L66 104"),
    "R": (54, "M0 100 L0 0 L26 0 A26 26 0 0 1 26 52 L0 52 M22 52 L54 100"),
    "S": (54, "M52 16 C46 4 36 0 27 0 C12 0 2 10 2 25 C2 54 54 44 54 74 C54 90 42 100 27 100 C14 100 4 94 0 84"),
    "T": (60, "M0 0 L60 0 M30 0 L30 100"),
    "U": (56, "M0 0 L0 68 C0 90 12 100 28 100 C44 100 56 90 56 68 L56 0"),
    "V": (60, "M0 0 L30 100 L60 0"),
    "W": (88, "M0 0 L20 100 L44 30 L68 100 L88 0"),
    "X": (56, "M0 0 L56 100 M56 0 L0 100"),
    "Y": (60, "M0 0 L30 50 L60 0 M30 50 L30 100"),
    "Z": (56, "M0 0 L56 0 L0 100 L56 100"),
}

SPAZIO_LETTERE = 32
SPAZIO_PAROLE = 56
GRASSO = 30        # spessore della prima lettera (contorno compreso)
BORDO = 5          # spessore del contorno nero della prima lettera
TRATTEGGIO = 4.5   # spessore delle lettere tratteggiate
MARGINE = GRASSO / 2


def larghezza_riga(riga, prima=False):
    x = 0
    for i, ch in enumerate(riga):
        if ch == " ":
            x += SPAZIO_PAROLE
            continue
        w = TRATTI[ch][0]
        x += w + (GRASSO if (prima and i == 0) else 0)
        x += SPAZIO_LETTERE
    return x - SPAZIO_LETTERE


def righe_per(parola, max_righe=1):
    """Divide la parola in righe bilanciate (solo agli spazi)."""
    parti = parola.split(" ")
    if max_righe == 1 or len(parti) == 1:
        return [parola]
    migliore = None
    for k in range(1, len(parti)):
        a, b = " ".join(parti[:k]), " ".join(parti[k:])
        w = max(larghezza_riga(a, True), larghezza_riga(b))
        if migliore is None or w < migliore[0]:
            migliore = (w, [a, b])
    return migliore[1]


def svg_riga(riga, prima_lettera=True, colore_tratteggio="#333"):
    """Gruppo SVG di una riga di testo; restituisce (svg, larghezza).
    Il riquadro va da y=-MARGINE a y=100+MARGINE."""
    out = []
    x = 0
    for i, ch in enumerate(riga):
        if ch == " ":
            x += SPAZIO_PAROLE
            continue
        w, d = TRATTI[ch]
        if prima_lettera and i == 0:
            x += MARGINE
            out.append(
                f'<g transform="translate({x} 0)" fill="none" stroke-linecap="round" stroke-linejoin="round">'
                f'<path d="{d}" stroke="#000" stroke-width="{GRASSO}"/>'
                f'<path d="{d}" stroke="#fff" stroke-width="{GRASSO - 2 * BORDO}" class="prima"/></g>')
            x += w + MARGINE
        else:
            out.append(
                f'<path transform="translate({x} 0)" d="{d}" fill="none" stroke="{colore_tratteggio}" '
                f'stroke-width="{TRATTEGGIO}" stroke-dasharray="9 8" stroke-linecap="round" stroke-linejoin="round"/>')
            x += w
        x += SPAZIO_LETTERE
    return "".join(out), x - SPAZIO_LETTERE

"""Disegni in bianco e nero (stile libro da colorare) per ogni lettera.

Ogni disegno è un frammento SVG in un riquadro 200x200. Le forme sono
chiuse e riempite di bianco, così sul sito si possono colorare con un tocco.
"""
import math

STILE = 'fill="#fff" stroke="#000" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"'


def stella(cx, cy, r1, r2, punte=5, rot=-90):
    pts = []
    for i in range(punte * 2):
        r = r1 if i % 2 == 0 else r2
        a = math.radians(rot + i * 180 / punte)
        pts.append(f"{cx + r * math.cos(a):.1f},{cy + r * math.sin(a):.1f}")
    return f'<polygon points="{" ".join(pts)}"/>'


def cavo(d, largo=14, bordo=4):
    """Una linea spessa ma vuota dentro (da colorare)."""
    return (f'<path d="{d}" fill="none" stroke-width="{largo + 2 * bordo}"/>'
            f'<path d="{d}" fill="none" stroke="#fff" stroke-width="{largo}" data-colora="1"/>')


def agrifoglio(x, y, s=1.0, rot=0):
    foglia = ("M0 0 Q8 -6 14 -4 Q14 -10 22 -10 Q22 -16 30 -16 Q30 -8 38 -6 "
              "Q30 0 30 4 Q22 4 20 10 Q14 6 8 8 Q6 2 0 0 Z")
    return (f'<g transform="translate({x} {y}) rotate({rot}) scale({s})">'
            f'<path d="{foglia}"/><path d="{foglia}" transform="scale(-1 1)"/>'
            f'<circle cx="-4" cy="4" r="6"/><circle cx="5" cy="5" r="6"/><circle cx="0" cy="-3" r="6"/></g>')


def nota(x, y, s=1.0):
    return (f'<g transform="translate({x} {y}) scale({s})">'
            '<path d="M14 0 L14 -40 Q24 -34 30 -26" fill="none"/>'
            '<ellipse cx="6" cy="0" rx="9" ry="7" transform="rotate(-20 6 0)"/></g>')


def fiocco_di_neve(cx, cy, r):
    parti = []
    for i in range(6):
        a = i * 60
        parti.append(
            f'<g transform="translate({cx} {cy}) rotate({a})">'
            f'<line x1="0" y1="0" x2="0" y2="{-r}"/>'
            f'<polyline points="{-r*0.3:.1f},{-r*0.75:.1f} 0,{-r*0.5:.1f} {r*0.3:.1f},{-r*0.75:.1f}" fill="none"/>'
            '</g>')
    parti.append(stella(cx, cy, r * 0.28, r * 0.28, 6, -90))
    return "".join(parti)


def campana(x, y, s=1.0, rot=0):
    return (f'<g transform="translate({x} {y}) rotate({rot}) scale({s})">'
            '<circle cx="0" cy="-58" r="9"/>'
            '<circle cx="0" cy="48" r="11"/>'
            '<path d="M0 -50 C-30 -50 -35 -20 -35 10 C-35 30 -45 35 -50 45 L50 45 '
            'C45 35 35 30 35 10 C35 -20 30 -50 0 -50 Z"/>'
            '<path d="M-38 20 L38 20" fill="none"/></g>')


def calza(x, y, s=1.0):
    return (f'<g transform="translate({x} {y}) scale({s})">'
            '<path d="M0 0 L0 44 Q0 62 18 62 L40 62 Q52 52 40 42 L22 42 L22 0 Z"/>'
            '<rect x="-4" y="-8" width="30" height="14" rx="5"/></g>')


def pallina(x, y, r, s=0):
    """Pallina di Natale appesa."""
    return (f'<line x1="{x}" y1="0" x2="{x}" y2="{y - r - 10}"/>'
            f'<circle cx="{x}" cy="{y}" r="{r}"/>'
            f'<path d="M{x - r * 0.95:.1f} {y - 6} L{x - r * 0.6:.1f} {y + 6} L{x - r * 0.2:.1f} {y - 6} '
            f'L{x + r * 0.2:.1f} {y + 6} L{x + r * 0.6:.1f} {y - 6} L{x + r * 0.95:.1f} {y + 6}" fill="none"/>'
            f'<rect x="{x - 9}" y="{y - r - 12}" width="18" height="12" rx="2"/>')


def capello_babbo(x, y, s=1.0, rot=0):
    return (f'<g transform="translate({x} {y}) rotate({rot}) scale({s})">'
            '<path d="M-45 0 Q-30 -60 25 -55 Q55 -45 60 -10 Q35 -35 20 -25 Q40 -10 45 0 Z"/>'
            '<circle cx="62" cy="-8" r="10"/>'
            '<rect x="-52" y="-6" width="104" height="20" rx="10"/></g>')


DISEGNI = {
    "A": (
        '<rect x="88" y="168" width="24" height="22"/>'
        '<polygon points="100,38 62,88 80,88 46,128 70,128 34,172 166,172 130,128 154,128 120,88 138,88"/>'
        + stella(100, 30, 18, 8)
        + '<circle cx="82" cy="110" r="7"/><circle cx="118" cy="148" r="7"/>'
          '<circle cx="74" cy="152" r="7"/><circle cx="112" cy="76" r="6"/>'
          '<path d="M70 128 Q100 140 128 124" fill="none"/>'
    ),
    "B": (
        '<circle cx="100" cy="108" r="38"/>'
        '<path d="M60 112 Q58 178 100 188 Q142 178 140 112 Q122 130 100 128 Q78 130 60 112 Z"/>'
        '<ellipse cx="88" cy="128" rx="13" ry="7"/><ellipse cx="112" cy="128" rx="13" ry="7"/>'
        '<circle cx="100" cy="117" r="7"/>'
        '<path d="M58 84 Q60 30 112 26 Q150 28 160 72 Q140 50 124 56 Q132 70 140 84 Z"/>'
        '<circle cx="162" cy="78" r="11"/>'
        '<rect x="50" y="76" width="100" height="20" rx="10"/>'
        '<circle cx="86" cy="104" r="3" fill="#000"/><circle cx="114" cy="104" r="3" fill="#000"/>'
    ),
    "C": (
        '<ellipse cx="100" cy="182" rx="58" ry="11"/>'
        '<path d="M74 84 L74 178 L126 178 L126 84 Z"/>'
        '<path d="M74 84 L126 84 L126 102 Q120 112 116 100 Q110 90 104 106 Q98 118 94 100 Q88 88 82 104 Q76 112 74 100 Z"/>'
        '<line x1="100" y1="84" x2="100" y2="72"/>'
        '<path d="M100 22 Q126 50 112 68 Q100 80 88 68 Q74 50 100 22 Z"/>'
        '<path d="M100 44 Q110 58 104 66 Q100 70 96 66 Q90 58 100 44 Z"/>'
        + agrifoglio(100, 176, 1.1)
    ),
    "D": (
        '<rect x="44" y="92" width="112" height="88" rx="3"/>'
        '<rect x="36" y="72" width="128" height="24" rx="3"/>'
        '<rect x="92" y="72" width="16" height="108"/>'
        '<path d="M100 72 C70 30 50 70 100 72 Z"/>'
        '<path d="M100 72 C130 30 150 70 100 72 Z"/>'
        '<circle cx="100" cy="70" r="9"/>'
        + stella(66, 138, 12, 5) + stella(134, 138, 12, 5)
    ),
    "E": (
        '<path d="M64 108 L22 86 L68 136 Z"/><path d="M136 108 L178 86 L132 136 Z"/>'
        '<circle cx="100" cy="122" r="42"/>'
        '<path d="M58 98 L104 22 L142 98 Z"/>'
        '<circle cx="104" cy="20" r="9"/>'
        '<path d="M54 98 L64 112 L74 98 L84 112 L94 98 L104 112 L114 98 L124 112 L134 98 L146 112 L146 92 L54 92 Z"/>'
        '<circle cx="86" cy="122" r="4" fill="#000"/><circle cx="114" cy="122" r="4" fill="#000"/>'
        '<path d="M84 140 Q100 154 116 140" fill="none"/>'
        '<circle cx="74" cy="138" r="7"/><circle cx="126" cy="138" r="7"/>'
    ),
    "F": (
        '<path d="M94 104 L64 172 L80 164 L88 180 L106 106 Z"/>'
        '<path d="M106 104 L136 172 L120 164 L112 180 L94 106 Z"/>'
        '<path d="M100 98 C62 48 22 64 30 100 C36 128 74 124 100 104 Z"/>'
        '<path d="M100 98 C138 48 178 64 170 100 C164 128 126 124 100 104 Z"/>'
        '<path d="M100 100 C80 84 56 80 48 94" fill="none"/>'
        '<path d="M100 100 C120 84 144 80 152 94" fill="none"/>'
        '<rect x="86" y="86" width="28" height="26" rx="8"/>'
    ),
    "G": (
        '<path fill-rule="evenodd" d="M28 100 a72 72 0 1 0 144 0 a72 72 0 1 0 -144 0 Z '
        'M64 100 a36 36 0 1 0 72 0 a36 36 0 1 0 -72 0 Z"/>'
        + "".join(
            f'<ellipse cx="{100 + 54 * math.cos(math.radians(a)):.1f}" cy="{100 + 54 * math.sin(math.radians(a)):.1f}" '
            f'rx="14" ry="7" transform="rotate({a + 60} {100 + 54 * math.cos(math.radians(a)):.1f} {100 + 54 * math.sin(math.radians(a)):.1f})"/>'
            for a in range(0, 360, 30))
        + "".join(
            f'<circle cx="{100 + 54 * math.cos(math.radians(a)):.1f}" cy="{100 + 54 * math.sin(math.radians(a)):.1f}" r="5"/>'
            for a in range(15, 360, 60))
        + '<path d="M100 166 C70 136 52 170 100 168 Z"/><path d="M100 166 C130 136 148 170 100 168 Z"/>'
          '<path d="M94 170 L80 196 L106 172 Z"/><path d="M106 170 L120 196 L94 172 Z"/>'
          '<circle cx="100" cy="167" r="8"/>'
    ),
    "H": (
        '<path d="M30 30 L170 30 Q182 30 182 42 L182 98 Q182 110 170 110 L104 110 L84 136 L86 110 '
        'L30 110 Q18 110 18 98 L18 42 Q18 30 30 30 Z"/>'
        '<text x="100" y="84" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" '
        'font-weight="900" font-size="27" stroke-width="2.5" letter-spacing="2">HO HO HO</text>'
        + capello_babbo(62, 172, 0.85, -12)
        + stella(160, 156, 16, 7) + stella(132, 186, 9, 4)
    ),
    "I": (
        '<path d="M10 182 Q100 166 190 182 L190 196 L10 196 Z"/>'
        '<circle cx="100" cy="148" r="38"/><circle cx="100" cy="94" r="27"/><circle cx="100" cy="52" r="20"/>'
        '<line x1="74" y1="92" x2="40" y2="70"/><line x1="126" y1="92" x2="162" y2="72"/>'
        '<line x1="50" y1="76" x2="40" y2="62"/><line x1="152" y1="78" x2="164" y2="64"/>'
        '<rect x="78" y="28" width="44" height="8" rx="2"/><rect x="86" y="6" width="28" height="24"/>'
        '<path d="M80 70 Q100 80 120 70 L120 80 Q100 90 80 80 Z"/><path d="M112 78 L118 108 L106 108 L104 80 Z"/>'
        '<circle cx="93" cy="48" r="3" fill="#000"/><circle cx="107" cy="48" r="3" fill="#000"/>'
        '<path d="M100 54 L116 58 L100 60 Z"/>'
        '<circle cx="100" cy="96" r="4"/><circle cx="100" cy="140" r="4"/><circle cx="100" cy="156" r="4"/>'
        + fiocco_di_neve(34, 30, 14) + fiocco_di_neve(166, 132, 12) + fiocco_di_neve(30, 136, 10)
    ),
    "J": (
        campana(58, 118, 0.8, -16) + campana(142, 118, 0.8, 16)
        + '<path d="M64 66 Q100 40 136 66" fill="none"/><path d="M100 50 C70 18 52 52 100 52 Z"/><path d="M100 50 C130 18 148 52 100 52 Z"/>'
          '<circle cx="100" cy="50" r="8"/>'
        + nota(18, 50, 0.9) + nota(166, 46, 0.9)
    ),
    "K": (
        '<path d="M48 186 Q30 118 72 92 L66 76 Q100 88 134 76 L128 92 Q170 118 152 186 Q100 196 48 186 Z"/>'
        '<rect x="80" y="40" width="40" height="38" rx="2"/><rect x="96" y="40" width="8" height="38"/>'
        '<path d="M100 40 C84 20 76 40 100 40 Z"/><path d="M100 40 C116 20 124 40 100 40 Z"/>'
        '<path d="M64 84 Q100 98 136 84 L134 94 Q100 108 66 94 Z"/>'
        + stella(100, 146, 18, 8)
        + nota(16, 70, 1.0) + nota(152, 56, 1.0) + nota(34, 150, 0.7)
    ),
    "L": (
        '<path d="M6 56 Q54 96 100 56 Q146 16 194 56" fill="none"/>'
        '<path d="M6 132 Q54 172 100 132 Q146 92 194 132" fill="none"/>'
        + "".join(
            f'<g transform="translate({x:.1f} {y:.1f}) rotate({r})">'
            '<rect x="-7" y="0" width="14" height="12" rx="2"/>'
            '<path d="M0 12 C-16 18 -14 44 0 50 C14 44 16 18 0 12 Z"/></g>'
            for x, y, r in [
                (30, 70, 15), (66, 78, -5), (122, 40, -20), (160, 42, 10),
                (30, 146, 15), (66, 154, -5), (122, 116, -20), (160, 118, 10)])
    ),
    "M": (
        stella(100, 24, 16, 6) + '<path d="M112 26 Q150 30 186 12" fill="none"/>'
        + "".join(
            f'<g transform="translate({x} {y}) scale({s})">'
            '<path d="M-36 40 L-36 -8 L-20 12 L0 -20 L20 12 L36 -8 L36 40 Z"/>'
            '<rect x="-38" y="28" width="76" height="16" rx="3"/>'
            '<circle cx="0" cy="8" r="7"/><circle cx="-20" cy="36" r="4"/><circle cx="0" cy="36" r="4"/><circle cx="20" cy="36" r="4"/>'
            '<circle cx="0" cy="-22" r="5"/><circle cx="-36" cy="-10" r="5"/><circle cx="36" cy="-10" r="5"/></g>'
            for x, y, s in [(46, 128, 0.8), (100, 104, 1.0), (154, 132, 0.8)])
        + '<path d="M10 190 Q100 168 190 190" fill="none"/>'
    ),
    "N": (
        fiocco_di_neve(70, 70, 48) + fiocco_di_neve(148, 130, 36) + fiocco_di_neve(52, 160, 24)
        + fiocco_di_neve(160, 40, 18)
    ),
    "O": (
        '<line x1="0" y1="2" x2="200" y2="2"/>'
        + pallina(48, 96, 30) + pallina(104, 150, 36) + pallina(160, 86, 28)
    ),
    "P": (
        stella(160, 26, 16, 6) + '<path d="M150 34 Q120 50 96 40" fill="none"/>'
        '<rect x="44" y="84" width="112" height="96"/>'
        '<path d="M66 180 L66 124 Q100 96 134 124 L134 180 Z"/>'
        '<path d="M26 92 L100 40 L174 92 L162 96 L100 54 L38 96 Z"/>'
        '<path d="M70 184 L80 154 L120 154 L130 184 Z"/>'
        '<path d="M80 154 Q100 140 120 154" />'
        '<circle cx="100" cy="146" r="10"/>'
        '<line x1="76" y1="160" x2="72" y2="150"/><line x1="124" y1="160" x2="128" y2="150"/>'
    ),
    "Q": (
        '<path d="M130 20 A46 46 0 1 0 176 92 A38 38 0 1 1 130 20 Z"/>'
        + stella(50, 34, 12, 5) + stella(90, 66, 8, 3.5) + stella(30, 92, 9, 4)
        + '<path d="M0 162 Q60 130 120 156 Q160 140 200 150 L200 200 L0 200 Z"/>'
          '<rect x="58" y="128" width="46" height="40"/><path d="M50 132 L81 106 L112 132 Z"/>'
          '<rect x="74" y="140" width="14" height="14"/>'
          '<path d="M140 178 a6 6 0 1 0 12 0" fill="none"/>'
    ),
    "R": (
        cavo("M74 70 L58 20 M64 40 L40 30 M60 30 L52 10", 8, 3)
        + cavo("M126 70 L142 20 M136 40 L160 30 M140 30 L148 10", 8, 3)
        + '<path d="M60 74 Q38 58 34 80 Q44 96 66 90 Z"/><path d="M140 74 Q162 58 166 80 Q156 96 134 90 Z"/>'
          '<path d="M64 70 Q100 50 136 70 Q150 110 128 150 Q112 178 100 178 Q88 178 72 150 Q50 110 64 70 Z"/>'
          '<ellipse cx="100" cy="158" rx="26" ry="20"/>'
          '<circle cx="100" cy="148" r="12"/>'
          '<circle cx="84" cy="104" r="5" fill="#000"/><circle cx="116" cy="104" r="5" fill="#000"/>'
          '<path d="M90 170 Q100 176 110 170" fill="none"/>'
    ),
    "S": (
        '<rect x="70" y="40" width="52" height="44" rx="2"/><rect x="92" y="40" width="8" height="44"/>'
        '<path d="M96 40 C80 22 74 40 96 40 Z"/><path d="M96 40 C112 22 118 40 96 40 Z"/>'
        '<path d="M40 84 L156 84 Q172 84 170 100 L164 140 L46 140 L38 100 Q36 84 40 84 Z"/>'
        '<path d="M60 100 L150 100" fill="none"/>'
        '<line x1="66" y1="140" x2="66" y2="164"/><line x1="140" y1="140" x2="140" y2="164"/>'
        + cavo("M26 166 L158 166 Q184 166 182 146 Q180 132 168 136", 10, 3)
    ),
    "T": (
        '<rect x="22" y="36" width="156" height="114" rx="6"/>'
        + "".join(f'<line x1="{22 + 31.2 * i:.1f}" y1="36" x2="{22 + 31.2 * i:.1f}" y2="150"/>' for i in range(1, 5))
        + "".join(f'<line x1="22" y1="{36 + 38 * i}" x2="178" y2="{36 + 38 * i}"/>' for i in range(1, 3))
        + "".join(
            f'<text x="{22 + 31.2 * c + 15.6:.1f}" y="{36 + 38 * r + 27}" text-anchor="middle" '
            f'font-family="Arial, sans-serif" font-size="20" fill="#000" stroke="none">{n}</text>'
            for (r, c), n in {(0, 0): 3, (0, 2): 25, (0, 4): 81, (1, 1): 14, (1, 3): 62,
                              (2, 0): 7, (2, 2): 48, (2, 4): 90}.items())
        + '<circle cx="53" cy="104" r="11"/>'
          '<path d="M140 196 Q132 168 150 160 L146 152 Q160 156 174 152 L170 160 Q188 168 180 196 Z"/>'
          '<circle cx="40" cy="182" r="11"/><circle cx="70" cy="186" r="11"/><circle cx="100" cy="180" r="11"/>'
          '<text x="40" y="188" text-anchor="middle" font-family="Arial" font-size="14" fill="#000" stroke="none">5</text>'
          '<text x="70" y="192" text-anchor="middle" font-family="Arial" font-size="14" fill="#000" stroke="none">33</text>'
          '<text x="100" y="186" text-anchor="middle" font-family="Arial" font-size="14" fill="#000" stroke="none">77</text>'
    ),
    "U": (
        '<path d="M100 40 Q104 24 116 14" fill="none"/>'
        '<path d="M106 34 Q140 10 170 30 Q150 34 148 50 Q130 40 120 52 Q112 40 106 34 Z"/>'
        + "".join(f'<circle cx="{x}" cy="{y}" r="16"/>' for x, y in [
            (70, 56), (100, 54), (130, 56), (56, 84), (86, 84), (116, 84), (146, 84),
            (70, 112), (100, 112), (130, 112), (86, 140), (116, 140), (100, 166)])
        + '<path d="M120 182 Q160 160 190 182 Q186 196 154 196 Q124 196 120 182 Z"/>'
          '<circle cx="140" cy="178" r="5"/><circle cx="154" cy="174" r="5"/><circle cx="168" cy="178" r="5"/>'
    ),
    "V": (
        '<rect x="30" y="76" width="140" height="116"/>'
        '<rect x="18" y="62" width="164" height="18" rx="3"/>'
        '<path d="M56 192 L56 130 Q100 90 144 130 L144 192 Z"/>'
        '<path d="M70 192 Q64 160 84 150 Q80 168 92 166 Q90 140 108 132 Q106 156 118 160 Q128 150 126 140 Q142 166 130 192 Z"/>'
        '<rect x="56" y="186" width="88" height="8" rx="2"/>'
        + calza(44, 80, 0.9) + calza(122, 80, 0.9)
        + stella(100, 34, 16, 7)
        + '<rect x="40" y="38" width="20" height="24"/><path d="M50 38 Q56 28 50 20 Q44 28 50 38 Z"/>'
          '<rect x="140" y="38" width="20" height="24"/><path d="M150 38 Q156 28 150 20 Q144 28 150 38 Z"/>'
    ),
    "W": (
        '<path d="M52 152 L148 152 L164 190 L36 190 Z"/>'
        '<path d="M60 160 L140 160" fill="none"/>'
        '<circle cx="100" cy="88" r="70"/>'
        '<path d="M34 112 Q100 92 166 112 Q160 140 140 148 L60 148 Q40 140 34 112 Z"/>'
        '<polygon points="70,50 50,82 60,82 44,108 96,108 80,82 90,82"/>'
        '<rect x="66" y="108" width="8" height="10"/>'
        '<rect x="106" y="80" width="42" height="34"/><path d="M100 84 L127 60 L154 84 Z"/>'
        '<rect x="120" y="94" width="12" height="20"/>'
        + "".join(f'<circle cx="{x}" cy="{y}" r="3.5"/>' for x, y in [
            (52, 50), (100, 34), (130, 44), (150, 60), (40, 76), (98, 66), (120, 30), (84, 40), (158, 86)])
    ),
    "X": (
        f'<g transform="rotate(-28 100 110)">{cavo("M100 196 L100 62 A26 26 0 0 0 48 62 L48 78", 20, 4)}'
        + "".join(f'<line x1="90" y1="{y}" x2="110" y2="{y - 12}"/>' for y in range(84, 196, 22))
        + '</g>'
        + f'<g transform="rotate(28 100 110)">{cavo("M100 196 L100 62 A26 26 0 0 1 152 62 L152 78", 20, 4)}'
        + "".join(f'<line x1="90" y1="{y - 12}" x2="110" y2="{y}"/>' for y in range(84, 196, 22))
        + '</g>'
        + agrifoglio(100, 128, 1.3)
    ),
    "Y": (
        '<ellipse cx="100" cy="174" rx="90" ry="16"/>'
        '<path d="M44 88 L160 88 A22 40 0 0 1 160 168 L44 168 Z"/>'
        '<ellipse cx="44" cy="128" rx="22" ry="40"/>'
        '<path d="M44 128 m-4 0 a4 4 0 1 1 8 0 a9 9 0 1 1 -18 0 a14 14 0 1 1 28 0 a18 22 0 1 1 -36 4" fill="none"/>'
        '<path d="M80 106 Q110 112 140 104 M76 134 Q112 142 150 130 M84 156 Q116 162 152 152" fill="none"/>'
        '<path d="M120 88 L124 70 L136 72 L134 88 Z"/>'
        + agrifoglio(90, 80, 1.1)
    ),
    "Z": (
        '<ellipse cx="100" cy="182" rx="76" ry="12"/>'
        '<path d="M56 178 L68 88 L100 62 L132 88 L144 178 Z"/>'
        '<path d="M84 76 L78 178 M116 76 L122 178 M100 62 L100 178" fill="none"/>'
        '<path d="M68 88 Q100 104 132 88 L132 96 Q100 112 68 96 Z"/>'
        '<path d="M70 80 Q100 50 130 80 Q120 70 100 72 Q80 70 70 80 Z"/>'
        '<ellipse cx="148" cy="24" rx="34" ry="12"/>'
        '<path d="M114 24 Q114 50 148 50 Q182 50 182 24" />'
        '<line x1="182" y1="24" x2="198" y2="8"/>'
        + "".join(f'<circle cx="{x}" cy="{y}" r="2.5"/>' for x, y in [
            (136, 60), (152, 64), (126, 72), (144, 76), (160, 70), (118, 58), (108, 70), (140, 86)])
    ),
}


def svg(lettera, extra_attr=""):
    return (f'<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" {extra_attr}>'
            f'<g {STILE}>{DISEGNI[lettera]}</g></svg>')

Attivita.registra({
  emoji: '🧩', titolo: 'Il puzzle del presepe',
  istruzioni: 'Tocca due pezzi per scambiarli di posto, finché il presepe è giusto.',
  proporzioni: '3 / 2',
  avvia: function (c, a) {
    var scena =
      '<defs><linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1b4c"/><stop offset="1" stop-color="#3949ab"/></linearGradient></defs>' +
      '<rect width="300" height="200" fill="url(#cielo)"/>' +
      '<circle cx="30" cy="30" r="2" fill="#fff"/><circle cx="260" cy="20" r="2" fill="#fff"/><circle cx="230" cy="60" r="1.5" fill="#fff"/><circle cx="70" cy="70" r="1.5" fill="#fff"/>' +
      '<path d="M150 10 L156 26 L173 26 L159 36 L164 52 L150 42 L136 52 L141 36 L127 26 L144 26Z" fill="#ffd54f"/>' +
      '<path d="M160 36 Q210 60 240 50" stroke="#ffe082" stroke-width="3" fill="none"/>' +
      '<rect x="0" y="170" width="300" height="30" fill="#6d4c41"/>' +
      '<polygon points="60,95 150,55 240,95 230,100 150,68 70,100" fill="#8d6e63"/>' +
      '<rect x="78" y="98" width="144" height="74" fill="#ffe0b2"/>' +
      '<rect x="78" y="98" width="6" height="74" fill="#8d6e63"/><rect x="216" y="98" width="6" height="74" fill="#8d6e63"/>' +
      '<path d="M128 178 L134 158 L166 158 L172 178Z" fill="#a1887f"/><path d="M134 158 Q150 150 166 158" stroke="#fbc02d" stroke-width="3" fill="none"/>' +
      '<text x="150" y="160" font-size="24" text-anchor="middle">👶</text>' +
      '<text x="112" y="160" font-size="34" text-anchor="middle">👩</text>' +
      '<text x="190" y="160" font-size="34" text-anchor="middle">👨</text>' +
      '<text x="40" y="185" font-size="38" text-anchor="middle">🐂</text>' +
      '<text x="262" y="185" font-size="34" text-anchor="middle">🐑</text>' +
      '<text x="262" y="140" font-size="30" text-anchor="middle">🐴</text>';
    var posti = [0, 1, 2, 3, 4, 5], ordine;
    do { ordine = a.mescola(posti); } while (ordine.every(function (v, i) { return v === i; }));
    var tessere = [], scelta = null;
    function disegna() {
      ordine.forEach(function (pezzoN, posto) {
        var t = tessere[posto];
        t.firstChild.setAttribute('viewBox', (pezzoN % 3) * 100 + ' ' + Math.floor(pezzoN / 3) * 100 + ' 100 100');
      });
    }
    posti.forEach(function (posto) {
      var t = a.el('div', '', null, c);
      t.style.cssText = 'position:absolute;left:' + (posto % 3) * 33.333 + '%;top:' + Math.floor(posto / 3) * 50 + '%;width:33.333%;height:50%;' +
        'box-sizing:border-box;border:0.5cqw solid #fff;cursor:pointer;transition:transform .15s;';
      a.svg(t, '0 0 100 100', scena).style.cssText = 'width:100%;height:100%;';
      t.addEventListener('click', function () {
        a.audio();
        if (fatto) return;
        if (scelta === null) { scelta = posto; t.style.transform = 'scale(0.92)'; t.style.borderColor = '#ffb300'; a.nota(600, 0.1); return; }
        var p = scelta; scelta = null;
        tessere[p].style.transform = ''; tessere[p].style.borderColor = '#fff';
        if (p === posto) return;
        var x = ordine[p]; ordine[p] = ordine[posto]; ordine[posto] = x;
        disegna(); a.nota(800, 0.12);
        if (ordine.every(function (v, i) { return v === i; })) {
          fatto = true;
          tessere.forEach(function (q) { q.style.border = '0'; });
          a.dopo(400, function () { a.bravo('Il presepe è completo!'); });
        }
      });
      tessere.push(t);
    });
    var fatto = false;
    disegna();
  }
});

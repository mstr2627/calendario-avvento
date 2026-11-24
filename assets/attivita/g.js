Attivita.registra({
  emoji: '💚', titolo: 'La ghirlanda',
  istruzioni: 'Guarda i colori delle palline sulla ghirlanda. Quale pallina viene dopo? Tocca quella giusta.',
  avvia: function (c, a) {
    var COL = { R: ['#e53935', 'rossa'], V: ['#43a047', 'verde'], G: ['#fdd835', 'gialla'], B: ['#1e88e5', 'blu'] };
    var schemi = a.mescola([['R', 'V'], ['R', 'V', 'G'], ['R', 'R', 'V'], ['B', 'G'], ['V', 'B', 'B'], ['G', 'R', 'B']]).slice(0, 3);
    var giro = 0;
    var punti = a.el('div', 'punteggio', '', c);
    function turno() {
      Array.prototype.slice.call(c.querySelectorAll('.giro')).forEach(function (n) { n.remove(); });
      punti.textContent = (giro + 1) + ' / 3';
      var s = schemi[giro];
      var g = a.el('div', 'giro', null, c);
      a.svg(g, '0 0 100 100', '<path d="M4 30 Q27 52 50 30 Q73 8 96 30" fill="none" stroke="#2e7d32" stroke-width="3"/>' +
        '<path d="M4 30 Q27 52 50 30 Q73 8 96 30" fill="none" stroke="#66bb6a" stroke-width="1.2" stroke-dasharray="2 2"/>', 'sfondo');
      var xs = [10, 23, 36, 50, 64, 77, 90];
      var giusta = s[6 % s.length];
      xs.forEach(function (x, i) {
        var t = (x < 50 ? x - 4 : x - 50) / 46, y = 30 + (x < 50 ? 1 : -1) * 44 * t * (1 - t);
        var b = a.pezzo(g, '', x, y + 5);
        b.style.cssText += 'width:9%;aspect-ratio:1;border-radius:50%;';
        if (i < 6) { b.style.background = COL[s[i % s.length]][0]; b.style.boxShadow = 'inset -1cqw -1cqw 0 #0003'; }
        else { b.style.border = '0.8cqw dashed #555'; b.style.background = '#fff'; b.className += ' pulsa domanda'; b.textContent = '?'; b.style.fontSize = '6cqw'; b.style.display = 'flex'; b.style.alignItems = 'center'; b.style.justifyContent = 'center'; }
      });
      var scelte = a.mescola(Object.keys(COL).filter(function (k) { return k !== giusta; })).slice(0, 2).concat([giusta]);
      a.mescola(scelte).forEach(function (k, i) {
        var b = a.pezzo(g, '', 25 + i * 25, 75);
        b.style.cssText += 'width:17%;aspect-ratio:1;border-radius:50%;cursor:pointer;background:' + COL[k][0] + ';box-shadow:inset -2cqw -2cqw 0 #0003, 0 1cqw 0 #0002;';
        b.addEventListener('click', function () {
          a.audio();
          if (k !== giusta) { a.errore(); a.trema(b); return; }
          var d = g.querySelector('.domanda');
          d.className = 'pezzo'; d.textContent = ''; d.style.border = '0'; d.style.background = COL[k][0];
          a.ding(); a.parla(COL[k][1]);
          giro++;
          if (giro === 3) a.dopo(700, function () { a.bravo('Che bella ghirlanda!'); });
          else a.dopo(1100, turno);
        });
      });
    }
    turno();
  }
});

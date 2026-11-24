Attivita.registra({
  emoji: '💡', titolo: 'Le luci magiche',
  istruzioni: 'Guarda bene: le luci si accendono in un ordine. Poi toccale anche tu nello stesso ordine!',
  avvia: function (c, a) {
    c.style.background = 'linear-gradient(#1a237e, #283593)';
    a.svg(c, '0 0 100 100', '<path d="M2 30 Q26 48 50 34 Q74 20 98 36" fill="none" stroke="#2e7d32" stroke-width="1.5"/>', 'sfondo');
    var LUCI = [['#ff5252', 392], ['#ffeb3b', 494], ['#69f0ae', 587], ['#40c4ff', 659]];
    var pos = [[14, 52], [38, 56], [62, 46], [86, 54]];
    var bulbi = LUCI.map(function (l, i) {
      var e = a.pezzo(c, '<svg viewBox="0 0 40 70"><rect x="12" y="0" width="16" height="14" rx="2" fill="#78909c"/>' +
        '<path d="M20 14 C2 20 4 56 20 66 C36 56 38 20 20 14Z" fill="' + l[0] + '"/></svg>', pos[i][0], pos[i][1]);
      e.style.width = '15%'; e.style.opacity = 0.35; e.style.transition = 'opacity .15s, filter .15s'; e.style.cursor = 'pointer';
      e.addEventListener('pointerdown', function () {
        if (!gioco || mostra) return;
        accendi(i, 300);
        if (i !== sequenza[indice]) {
          a.errore(); a.parla('Oops! Guarda di nuovo.'); gioco = false;
          a.dopo(1200, function () { mostraSequenza(); });
          return;
        }
        indice++;
        if (indice === sequenza.length) {
          gioco = false;
          if (sequenza.length === 5) { a.dopo(500, function () { a.bravo('Che memoria!'); }); return; }
          a.dopo(700, function () { a.ding(); });
          a.dopo(1500, function () { sequenza.push(a.intero(0, 3)); mostraSequenza(); });
        }
      });
      return e;
    });
    function accendi(i, ms) {
      var e = bulbi[i];
      e.style.opacity = 1; e.style.filter = 'drop-shadow(0 0 3cqw ' + LUCI[i][0] + ')';
      a.nota(LUCI[i][1], ms / 1000 + 0.1, 'triangle', 0.25);
      setTimeout(function () { e.style.opacity = 0.35; e.style.filter = ''; }, ms);
    }
    var sequenza = [a.intero(0, 3), a.intero(0, 3)], indice = 0, gioco = false, mostra = false;
    var livello = a.el('div', 'punteggio', '💡', c);
    function mostraSequenza() {
      mostra = true; indice = 0;
      livello.textContent = '💡 ' + sequenza.length;
      sequenza.forEach(function (n, k) { a.dopo(600 + k * 700, function () { accendi(n, 450); }); });
      a.dopo(600 + sequenza.length * 700, function () { mostra = false; gioco = true; });
    }
    var via = a.pezzo(c, null, 50, 84);
    a.el('button', 'tasto', 'Via!', via).addEventListener('click', function () { a.audio(); via.remove(); mostraSequenza(); });
  }
});

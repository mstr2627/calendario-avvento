Attivita.registra({
  emoji: '🦌', titolo: 'Conta le renne',
  istruzioni: 'Quante renne tirano la slitta di Babbo Natale? Contale e tocca il numero giusto.',
  avvia: function (c, a) {
    c.style.background = 'linear-gradient(#bbdefb, #e3f2fd)';
    var giro = 0, punti = a.el('div', 'punteggio', '', c);
    var usati = [];
    function turno() {
      Array.prototype.slice.call(c.querySelectorAll('.giro')).forEach(function (n) { n.remove(); });
      punti.textContent = (giro + 1) + ' / 4';
      var n; do { n = a.intero(2, 9); } while (usati.indexOf(n) >= 0);
      usati.push(n);
      var g = a.el('div', 'giro', null, c);
      var perRiga = n > 5 ? Math.ceil(n / 2) : n;
      for (var i = 0; i < n; i++) {
        var riga = Math.floor(i / perRiga), col = i % perRiga;
        var r = a.pezzo(g, '🦌', 8 + col * 12, 24 + riga * 18); r.style.fontSize = '10cqw';
      }
      var s = a.pezzo(g, '🛷', 8 + perRiga * 12 + 6, 32); s.style.fontSize = '14cqw';
      var b = a.pezzo(g, '🎅', 8 + perRiga * 12 + 6, 22); b.style.fontSize = '9cqw';
      var scelte = [n];
      while (scelte.length < 3) { var x = a.intero(Math.max(1, n - 3), n + 3); if (scelte.indexOf(x) < 0) scelte.push(x); }
      a.mescola(scelte).forEach(function (k, i) {
        var t = a.pezzo(g, null, 22 + i * 28, 78);
        var bt = a.el('button', 'tasto', String(k), t);
        bt.style.fontSize = '11cqw'; bt.style.width = '20cqw';
        bt.addEventListener('click', function () {
          a.audio();
          if (k !== n) { a.errore(); a.trema(t); a.parla('Riprova, contale bene!'); return; }
          a.ding(); a.parla(a.NUMERI[n] + ' renne!');
          giro++;
          if (giro === 4) a.dopo(900, function () { a.bravo('Sai contare benissimo!'); });
          else a.dopo(1400, turno);
        });
      });
    }
    turno();
  }
});

Attivita.registra({
  emoji: '🎀', titolo: 'Il fiocco giusto',
  istruzioni: 'Trascina ogni fiocco sul pacchetto dello stesso colore.',
  avvia: function (c, a) {
    var colori = [['#e53935', 'rosso'], ['#1e88e5', 'blu'], ['#43a047', 'verde'], ['#fdd835', 'giallo']];
    var fatti = 0;
    var posti = a.mescola(colori);
    posti.forEach(function (col, i) {
      var g = a.pezzo(c, '<svg viewBox="0 0 60 60"><rect x="4" y="16" width="52" height="42" fill="' + col[0] + '" stroke="#0003"/>' +
        '<rect x="1" y="9" width="58" height="11" fill="' + col[0] + '" stroke="#0003"/><rect x="26" y="9" width="8" height="49" fill="#ffffffaa"/></svg>',
        14 + i * 24, 74, 'pacco');
      g.style.width = '20%'; g.dataset.colore = col[1];
    });
    a.mescola(colori).forEach(function (col, i) {
      var f = a.pezzo(c, '<svg viewBox="0 0 60 40"><path d="M30 20 C10 0 0 20 10 30 C18 36 26 28 30 20Z M30 20 C50 0 60 20 50 30 C42 36 34 28 30 20Z" ' +
        'fill="' + col[0] + '" stroke="#0005"/><circle cx="30" cy="21" r="6" fill="' + col[0] + '" stroke="#0005"/>' +
        '<path d="M27 25 L20 38 M33 25 L40 38" stroke="' + col[0] + '" stroke-width="4"/></svg>', 14 + i * 24, 22);
      f.style.width = '18%';
      a.trascina(f, c, {
        lascia: function (e, sotto) {
          var p = a.trova(sotto, '.pacco');
          if (p && p.dataset.colore === col[1] && !p.dataset.pieno) {
            p.dataset.pieno = '1';
            a.blocca(e, parseFloat(p.dataset.x), parseFloat(p.dataset.y) - 9);
            a.ding(); a.parla(col[1]);
            if (++fatti === 4) a.dopo(700, function () { a.bravo('Tutti i pacchetti sono pronti!'); });
            return true;
          }
          if (p) a.errore();
          return false;
        }
      });
    });
  }
});

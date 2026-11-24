Attivita.registra({
  emoji: '🎄', titolo: "Decora l'albero",
  istruzioni: "Trascina le palline e le decorazioni sull'albero. Alla fine metti la stella in cima!",
  avvia: function (c, a) {
    a.svg(c, '0 0 100 100',
      '<rect x="44" y="84" width="12" height="11" fill="#8d5a2b"/>' +
      '<polygon class="albero" points="50,12 28,40 37,40 20,63 31,63 14,86 86,86 69,63 80,63 63,40 72,40" ' +
      'fill="#2e8b3a" stroke="#1b5e20" stroke-width="1"/>', 'sfondo');
    var luci = [];
    [[50, 30], [42, 45], [58, 47], [36, 60], [64, 58], [48, 70], [28, 80], [72, 79], [55, 82], [40, 52]].forEach(function (p) {
      var l = a.pezzo(c, '', p[0], p[1], 'luce'); l.style.cssText += 'width:3cqw;height:3cqw;border-radius:50%;opacity:0;';
      luci.push(l);
    });
    var decorazioni = ['🔴', '🟡', '🔵', '🟣', '🎀', '🍬', '🔔', '🟠'];
    decorazioni.forEach(function (d, i) {
      var x = i < 4 ? 8 : 92, y = 18 + (i % 4) * 20;
      var p = a.pezzo(c, d, x, y);
      p.style.fontSize = '8cqw';
      a.trascina(p, c, {
        lascia: function (e, sotto) {
          if (a.trova(sotto, '.albero')) { a.nota(660 + i * 60, 0.3, 'sine', 0.2); return true; }
          return false;
        }
      });
    });
    var stella = a.pezzo(c, '⭐', 10, 92);
    stella.style.fontSize = '11cqw';
    a.trascina(stella, c, {
      lascia: function (e, sotto, x, y) {
        if (y < 24 && Math.abs(x - 50) < 14) {
          a.blocca(e, 50, 10);
          var colori = ['#ff5252', '#ffeb3b', '#40c4ff', '#ff80ab', '#b2ff59'];
          luci.forEach(function (l, k) {
            l.style.background = colori[k % colori.length];
            l.style.opacity = 1;
            l.style.boxShadow = '0 0 2cqw ' + colori[k % colori.length];
            l.style.animation = 'pulsa 0.8s ' + (k * 0.1) + 's infinite';
          });
          a.dopo(400, function () { a.bravo("Che bell'albero!"); });
          return true;
        }
        a.parla('La stella va in cima!');
        return false;
      }
    });
  }
});

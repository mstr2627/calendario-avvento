Attivita.registra({
  emoji: '⭐', titolo: 'Segui la stella',
  istruzioni: 'Trascina la stella fino alla capanna: i Re Magi la seguiranno!',
  avvia: function (c, a) {
    c.style.background = 'linear-gradient(#0d1b4c, #283593 70%, #c5a35a 70%)';
    var st = '';
    for (var i = 0; i < 18; i++) st += '<circle cx="' + a.intero(2, 98) + '" cy="' + a.intero(2, 60) + '" r="0.5" fill="#fff"/>';
    a.svg(c, '0 0 100 100', st + '<path d="M0 72 Q30 66 60 72 T100 70 L100 100 L0 100Z" fill="#d7b46a"/>', 'sfondo');
    var capanna = a.pezzo(c, '🛖', 86, 72); capanna.style.fontSize = '20cqw';
    var magi = ['🤴🏻', '🤴🏽', '🤴🏿'].map(function (m, i) {
      var e = a.pezzo(c, m, 8 + i * 8, 80); e.style.fontSize = '10cqw';
      return { e: e, x: 8 + i * 8 };
    });
    var cammello = a.pezzo(c, '🐪', 4, 84); cammello.style.fontSize = '9cqw';
    var stella = a.pezzo(c, '⭐', 30, 18); stella.style.fontSize = '12cqw';
    stella.style.filter = 'drop-shadow(0 0 2cqw #fff59d)';
    var meta = 30, arrivati = false;
    a.trascina(stella, c, { muovi: function (e, x) { meta = x; }, lascia: function (e, s, x) { meta = x; return true; } });
    a.ciclo(function (dt) {
      if (arrivati) return false;
      magi.forEach(function (m, i) {
        var obiettivo = Math.min(meta, 80) - (2 - i) * 8 + 2;
        m.x += Math.max(-1, Math.min(1, obiettivo - m.x)) * dt * 14;
        a.posiziona(m.e, m.x, 80 + Math.sin(m.x) * 0.6);
      });
      a.posiziona(cammello, magi[0].x - 6, 84);
      if (magi[2].x > 72) {
        arrivati = true;
        a.blocca(stella, 86, 50);
        a.dopo(300, function () { a.bravo('I Re Magi sono arrivati alla capanna!'); });
        return false;
      }
    });
  }
});

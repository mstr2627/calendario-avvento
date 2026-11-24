Attivita.registra({
  emoji: '🎅', titolo: 'Acchiappa Babbo Natale',
  istruzioni: 'Babbo Natale spunta dai camini. Toccalo prima che si nasconda! Prendilo sei volte.',
  avvia: function (c, a) {
    c.style.background = 'linear-gradient(#1a237e, #3949ab)';
    var stelle = '';
    for (var i = 0; i < 14; i++) stelle += '<circle cx="' + a.intero(2, 98) + '" cy="' + a.intero(2, 30) + '" r="0.6" fill="#fff"/>';
    a.svg(c, '0 0 100 100', stelle + '<circle cx="85" cy="12" r="6" fill="#fff9c4"/>' +
      '<rect x="0" y="66" width="100" height="34" fill="#5d4037"/>' +
      '<path d="M0 66 L10 56 L20 66 L30 56 L40 66 L50 56 L60 66 L70 56 L80 66 L90 56 L100 66 Z" fill="#8d6e63"/>' +
      '<rect x="0" y="94" width="100" height="6" fill="#fff"/>', 'sfondo');
    var posti = [12, 31, 50, 69, 88];
    var buchi = posti.map(function (x) {
      var b = a.el('div', '', null, c);
      b.style.cssText = 'position:absolute;left:' + (x - 8) + '%;top:30%;width:16%;height:24%;overflow:hidden;';
      var s = a.el('div', '', '🎅', b);
      s.style.cssText = 'position:absolute;left:0;right:0;bottom:0;text-align:center;font-size:12cqw;line-height:1;transform:translateY(110%);transition:transform .25s;cursor:pointer;';
      var cam = a.el('div', '', null, c);
      cam.style.cssText = 'position:absolute;left:' + (x - 7) + '%;top:53%;width:14%;height:15%;background:#b71c1c;border:0.6cqw solid #7f0000;' +
        'background-image:linear-gradient(#7f0000 1px, transparent 1px);background-size:100% 25%;';
      var bordo = a.el('div', '', null, c);
      bordo.style.cssText = 'position:absolute;left:' + (x - 8.5) + '%;top:51%;width:17%;height:4%;background:#fff;border-radius:1cqw;';
      s.addEventListener('pointerdown', function () {
        if (!s.dataset.su) return;
        delete s.dataset.su; s.style.transform = 'translateY(110%)';
        presi++; punti.textContent = '🎅 ' + presi + ' / 6';
        a.parla('Ho ho ho!'); a.campanella(784);
        if (presi === 6) { finito = true; a.dopo(600, function () { a.bravo('Ho ho ho! Mi hai preso!'); }); }
      });
      return s;
    });
    var presi = 0, finito = false;
    var punti = a.el('div', 'punteggio', '🎅 0 / 6', c);
    var via = a.pezzo(c, null, 50, 82); 
    var bottone = a.el('button', 'tasto', 'Via!', via);
    bottone.addEventListener('click', function () {
      a.audio(); via.remove();
      a.ogni(1300, function () {
        if (finito) return;
        var s = a.scegli(buchi);
        s.dataset.su = '1'; s.style.transform = 'translateY(0)';
        a.dopo(1050, function () { delete s.dataset.su; s.style.transform = 'translateY(110%)'; });
      });
    });
  }
});

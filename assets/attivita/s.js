Attivita.registra({
  emoji: '🛷', titolo: 'Raccogli i regali',
  istruzioni: 'Muovi la slitta a destra e a sinistra con il dito e raccogli dieci regali che cadono.',
  avvia: function (c, a) {
    c.style.background = 'linear-gradient(#1a237e, #5c6bc0)';
    a.svg(c, '0 0 100 100', '<path d="M0 92 Q50 86 100 92 L100 100 L0 100Z" fill="#fff"/>', 'sfondo');
    var slitta = a.pezzo(c, '🛷', 50, 86); slitta.style.fontSize = '16cqw';
    var babbo = a.pezzo(c, '🎅', 50, 79); babbo.style.fontSize = '9cqw';
    var x = 50, presi = 0, regali = [], finito = false, partito = false;
    var punti = a.el('div', 'punteggio', '🎁 0 / 10', c);
    function muovi(ev) {
      var r = c.getBoundingClientRect();
      x = Math.max(8, Math.min(92, (ev.clientX - r.left) / r.width * 100));
    }
    c.addEventListener('pointerdown', function (ev) { muovi(ev); a.audio(); });
    c.addEventListener('pointermove', function (ev) { if (ev.pointerType === 'mouse' || ev.buttons) muovi(ev); });
    var via = a.pezzo(c, null, 50, 45);
    a.el('button', 'tasto', 'Via!', via).addEventListener('click', function (ev) { ev.stopPropagation(); a.audio(); via.remove(); partito = true; });
    var attesa = 0;
    a.ciclo(function (dt) {
      a.posiziona(slitta, x, 86); a.posiziona(babbo, x - 1, 79);
      if (!partito || finito) return;
      attesa -= dt;
      if (attesa <= 0) {
        attesa = 0.9 + Math.random() * 0.6;
        var g = a.pezzo(c, a.scegli(['🎁', '🎁', '🧸', '⭐']), a.intero(8, 92), -5);
        g.style.fontSize = '9cqw';
        regali.push({ e: g, x: parseFloat(g.dataset.x), y: -5, v: 18 + Math.random() * 10 });
      }
      regali = regali.filter(function (r) {
        r.y += r.v * dt;
        a.posiziona(r.e, r.x, r.y);
        if (r.y > 78 && r.y < 90 && Math.abs(r.x - x) < 10) {
          r.e.remove(); presi++; punti.textContent = '🎁 ' + presi + ' / 10';
          a.campanella(660 + presi * 40);
          if (presi === 10) { finito = true; a.dopo(300, function () { a.bravo('Hai raccolto tutti i regali!'); }); }
          return false;
        }
        if (r.y > 105) { r.e.remove(); return false; }
        return true;
      });
    });
  }
});

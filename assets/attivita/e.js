Attivita.registra({
  emoji: '🧝', titolo: "Il memory dell'elfo",
  istruzioni: "Gira due carte alla volta e trova le coppie di giocattoli uguali.",
  proporzioni: '3 / 2',
  avvia: function (c, a) {
    c.style.background = '#e8f5e9';
    var giochi = a.mescola(['🧸', '🚂', '🪀', '🪁', '🎈', '🦄', '⚽', '🚗', '🦖']).slice(0, 3);
    var carte = a.mescola(giochi.concat(giochi));
    var girate = [], trovate = 0, attesa = false;
    carte.forEach(function (g, i) {
      var x = 18 + (i % 3) * 32, y = 27 + Math.floor(i / 3) * 46;
      var e = a.pezzo(c, '🎄', x, y, 'carta-memory');
      e.style.cssText += 'width:26%;height:40%;display:flex;align-items:center;justify-content:center;font-size:13cqw;' +
        'background:#2e7d32;border-radius:3cqw;box-shadow:0 1cqw 0 #1b5e20;cursor:pointer;transition:background .2s;';
      e.addEventListener('click', function () {
        a.audio();
        if (attesa || e.dataset.su || e.dataset.ok) return;
        e.dataset.su = '1'; e.textContent = g; e.style.background = '#fff';
        a.nota(700, 0.15, 'sine', 0.15);
        girate.push(e);
        if (girate.length === 2) {
          var p = girate[0], q = girate[1]; girate = [];
          if (p.textContent === q.textContent) {
            p.dataset.ok = q.dataset.ok = '1'; a.ding();
            p.style.background = q.style.background = '#fff59d';
            if (++trovate === 3) a.dopo(600, function () { a.bravo('Hai trovato tutte le coppie!'); });
          } else {
            attesa = true;
            a.dopo(900, function () {
              [p, q].forEach(function (x) { delete x.dataset.su; x.textContent = '🎄'; x.style.background = '#2e7d32'; });
              attesa = false;
            });
          }
        }
      });
    });
  }
});

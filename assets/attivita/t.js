Attivita.registra({
  emoji: '🎲', titolo: 'La tombola',
  istruzioni: 'Tocca Estrai e ascolta il numero. Poi cercalo sulla tua cartella e toccalo. Fai cinquina: una riga tutta piena!',
  proporzioni: '4 / 3',
  avvia: function (c, a) {
    c.style.background = '#fff3e0';
    var numeri = a.mescola(Array.from({ length: 20 }, function (_, i) { return i + 1; })).slice(0, 15);
    var righe = [numeri.slice(0, 5).sort(function (x, y) { return x - y; }), numeri.slice(5, 10).sort(function (x, y) { return x - y; }),
      numeri.slice(10, 15).sort(function (x, y) { return x - y; })];
    var daEstrarre = a.mescola(numeri), attuale = null;
    var tabella = a.el('div', '', null, c);
    tabella.style.cssText = 'position:absolute;left:4%;right:4%;top:36%;bottom:5%;display:grid;grid-template-columns:repeat(5,1fr);gap:1.5cqw;' +
      'background:#c62828;padding:1.5cqw;border-radius:2cqw;';
    var celle = {};
    righe.forEach(function (riga, r) {
      riga.forEach(function (n) {
        var d = a.el('button', '', String(n), tabella);
        d.style.cssText = 'font:inherit;font-weight:800;font-size:7cqw;border:0;border-radius:1.5cqw;background:#fff;color:#2b2118;cursor:pointer;position:relative;';
        d.dataset.riga = r;
        celle[n] = d;
        d.addEventListener('click', function () {
          a.audio();
          if (d.dataset.coperto) return;
          if (n !== attuale) { a.errore(); a.trema(d); return; }
          d.dataset.coperto = '1';
          var f = a.el('span', '', null, d);
          f.style.cssText = 'position:absolute;inset:15%;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ffcc80,#e65100);opacity:.85;';
          a.ding(); attuale = null; estrai.disabled = false; palla.style.opacity = 0.4;
          var pieni = celle && righe[r].every(function (k) { return celle[k].dataset.coperto; });
          if (pieni) { estrai.disabled = true; a.dopo(500, function () { a.bravo('Cinquina! Bravissimo!'); }); }
        });
      });
    });
    var palla = a.pezzo(c, '', 22, 17);
    palla.style.cssText += 'width:22%;aspect-ratio:1;border-radius:50%;background:#fff;border:1cqw solid #c62828;display:flex;' +
      'align-items:center;justify-content:center;font-size:11cqw;font-weight:800;';
    var tasti = a.pezzo(c, null, 68, 17);
    tasti.style.cssText += 'display:flex;gap:2cqw;';
    var estrai = a.el('button', 'tasto', 'Estrai!', tasti);
    var ripeti = a.el('button', 'tasto', '🔊', tasti);
    function dici() { if (attuale) a.parla('Il numero ' + a.NUMERI[attuale]); }
    ripeti.addEventListener('click', function () { a.audio(); dici(); });
    estrai.addEventListener('click', function () {
      a.audio();
      if (attuale || !daEstrarre.length) return;
      attuale = daEstrarre.pop();
      palla.textContent = attuale; palla.style.opacity = 1; palla.style.animation = 'none'; void palla.offsetWidth; palla.style.animation = 'appare .4s';
      estrai.disabled = true;
      a.nota(440, 0.1, 'square', 0.05); dici();
    });
  }
});

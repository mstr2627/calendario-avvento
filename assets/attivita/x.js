Attivita.registra({
  emoji: '🔍', titolo: 'Trova le X',
  istruzioni: 'Nel disegno ci sono cinque lettere X nascoste tra le altre lettere. Trovale tutte!',
  avvia: function (c, a) {
    c.style.background = 'linear-gradient(#fce4ec, #fff)';
    var altre = ['K', 'Y', 'V', 'T', 'A', 'H', 'Z', 'N', 'M', 'L', 'W', 'E'];
    var celle = [];
    for (var r = 0; r < 5; r++) for (var q = 0; q < 5; q++) celle.push([12 + q * 19 + a.intero(-3, 3), 20 + r * 18 + a.intero(-3, 3)]);
    celle = a.mescola(celle).slice(0, 22);
    var colori = ['#c62828', '#2e7d32', '#1565c0', '#6a1b9a', '#ef6c00', '#00838f', '#ad1457'];
    var trovate = 0;
    var punti = a.el('div', 'punteggio', '✖️ 0 / 5', c);
    celle.forEach(function (p, i) {
      var lettera = i < 5 ? 'X' : a.scegli(altre);
      var e = a.pezzo(c, lettera, p[0], p[1]);
      e.style.cssText += 'font-size:' + a.intero(9, 13) + 'cqw;font-weight:900;font-family:Arial,sans-serif;color:' + a.scegli(colori) +
        ';cursor:pointer;width:13cqw;height:13cqw;display:flex;align-items:center;justify-content:center;border-radius:50%;';
      e.style.transform = 'translate(-50%,-50%) rotate(' + a.intero(-25, 25) + 'deg)';
      e.addEventListener('click', function () {
        a.audio();
        if (e.dataset.ok) return;
        if (lettera !== 'X') { a.errore(); a.trema(e); return; }
        e.dataset.ok = '1'; e.style.boxShadow = '0 0 0 1cqw #43a047'; e.style.background = '#c8e6c9';
        trovate++; punti.textContent = '✖️ ' + trovate + ' / 5'; a.ding();
        if (trovate === 5) a.dopo(500, function () { a.bravo('Hai trovato tutte le X!'); });
      });
    });
  }
});

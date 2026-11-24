Attivita.registra({
  emoji: '🕯️', titolo: "Le candele dell'Avvento",
  istruzioni: 'Accendi le candele in ordine: prima la candela uno, poi la due, la tre e la quattro. Conta i puntini!',
  avvia: function (c, a) {
    c.style.background = 'linear-gradient(#263238, #455a64)';
    a.svg(c, '0 0 100 100', '<ellipse cx="50" cy="84" rx="46" ry="10" fill="#2e7d32"/><ellipse cx="50" cy="82" rx="38" ry="6" fill="#43a047"/>' +
      '<circle cx="14" cy="84" r="2.5" fill="#e53935"/><circle cx="86" cy="84" r="2.5" fill="#e53935"/><circle cx="50" cy="92" r="2.5" fill="#e53935"/>', 'sfondo');
    var numeri = a.mescola([1, 2, 3, 4]);
    var prossimo = 1;
    numeri.forEach(function (n, i) {
      var colore = n === 3 ? '#f48fb1' : '#9575cd';
      var punti = '';
      for (var k = 0; k < n; k++) punti += '<circle cx="15" cy="' + (22 + k * 11) + '" r="3.2" fill="#fff"/>';
      var e = a.pezzo(c, '<svg viewBox="0 0 30 90">' +
        '<path class="fiamma" d="M15 2 Q24 14 15 22 Q6 14 15 2Z" fill="#ffb300" opacity="0"/>' +
        '<line x1="15" y1="20" x2="15" y2="15" stroke="#333" stroke-width="1.5"/>' +
        '<rect x="3" y="18" width="24" height="70" rx="3" fill="' + colore + '"/>' + punti + '</svg>', 14 + i * 24, 55);
      e.style.width = '15%'; e.style.cursor = 'pointer';
      e.addEventListener('click', function () {
        a.audio();
        if (e.dataset.accesa) return;
        if (n !== prossimo) { a.errore(); a.trema(e); a.parla('Cerca la candela ' + a.NUMERI[prossimo]); return; }
        e.dataset.accesa = '1';
        var f = e.querySelector('.fiamma'); f.setAttribute('opacity', '1'); f.classList.add('pulsa');
        a.campanella(523 + n * 110); a.parla(a.NUMERI[n]);
        prossimo++;
        if (prossimo > 4) a.dopo(900, function () { a.bravo('Hai acceso tutte le candele!'); });
      });
    });
  }
});

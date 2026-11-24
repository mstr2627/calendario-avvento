Attivita.registra({
  emoji: '⚖️', titolo: "La bilancia dell'uvetta",
  istruzioni: "Tocca la ciotola per mettere un'uvetta sul piatto vuoto. Quando i due piatti hanno le stesse uvette, la bilancia è in equilibrio. Tocca il piatto per togliere un'uvetta.",
  avvia: function (c, a) {
    c.style.background = '#fffde7';
    var giro = 0, obiettivo, messi, finito;
    var bil = a.svg(c, '0 0 100 100', '', 'sfondo');
    var punti = a.el('div', 'punteggio', '', c);
    function uvette(cx, cy, n) {
      var s = '';
      for (var i = 0; i < n; i++) {
        var riga = Math.floor(i / 4), col = i % 4, inRiga = Math.min(4, n - riga * 4);
        s += '<ellipse cx="' + (cx + (col - (inRiga - 1) / 2) * 5) + '" cy="' + (cy - 2 - riga * 3.6) + '" rx="2.4" ry="1.9" fill="#5d2e0f" stroke="#3e1d07" stroke-width="0.4"/>';
      }
      return s;
    }
    function disegna() {
      var ang = Math.max(-14, Math.min(14, (messi - obiettivo) * 4)) * Math.PI / 180;
      var L = 34, px = 50, py = 30;
      var sx = px - L * Math.cos(ang), sy = py - L * Math.sin(ang), dx = px + L * Math.cos(ang), dy = py + L * Math.sin(ang);
      function piatto(x, y, n) {
        return '<line x1="' + x + '" y1="' + y + '" x2="' + (x - 11) + '" y2="' + (y + 20) + '" stroke="#795548" stroke-width="0.6"/>' +
          '<line x1="' + x + '" y1="' + y + '" x2="' + (x + 11) + '" y2="' + (y + 20) + '" stroke="#795548" stroke-width="0.6"/>' +
          '<path d="M' + (x - 13) + ' ' + (y + 20) + ' Q' + x + ' ' + (y + 27) + ' ' + (x + 13) + ' ' + (y + 20) + ' Z" fill="#b0bec5" stroke="#607d8b"/>' +
          uvette(x, y + 21, n);
      }
      bil.innerHTML = '<polygon points="50,30 42,82 58,82" fill="#8d6e63"/><rect x="34" y="82" width="32" height="5" rx="2" fill="#6d4c41"/>' +
        '<line x1="' + sx + '" y1="' + sy + '" x2="' + dx + '" y2="' + dy + '" stroke="#5d4037" stroke-width="2.4" stroke-linecap="round"/>' +
        '<circle cx="50" cy="30" r="2.5" fill="#fdd835"/>' + piatto(sx, sy, obiettivo) + piatto(dx, dy, messi) +
        '<polygon points="50,22 48,27 52,27" fill="' + (messi === obiettivo ? '#43a047' : '#e53935') + '"/>';
      zonaPiatto.style.left = (dx - 14) + '%'; zonaPiatto.style.top = (dy + 14) + '%';
    }
    var zonaPiatto = a.el('div', '', null, c);
    zonaPiatto.style.cssText = 'position:absolute;width:28%;height:16%;cursor:pointer;';
    zonaPiatto.addEventListener('click', function () {
      a.audio();
      if (finito || messi === 0) return;
      messi--; a.nota(400, 0.12); disegna();
    });
    var ciotola = a.pezzo(c, '<svg viewBox="0 0 50 30"><path d="M2 8 Q25 40 48 8 Z" fill="#ffb74d" stroke="#e65100"/>' + uvette(25, 12, 8) + '</svg>', 84, 90);
    ciotola.style.width = '24%'; ciotola.style.cursor = 'pointer';
    ciotola.addEventListener('click', function () {
      a.audio();
      if (finito || messi >= 12) return;
      messi++; a.nota(520 + messi * 30, 0.12); disegna();
      if (messi === obiettivo) {
        finito = true; a.ding(); a.parla('In equilibrio! ' + a.NUMERI[messi] + ' uvette.');
        giro++;
        if (giro === 3) a.dopo(1400, function () { a.bravo('La bilancia è in equilibrio!'); });
        else a.dopo(2200, turno);
      }
    });
    function turno() {
      var vecchio = obiettivo;
      do { obiettivo = a.intero(2, 8); } while (obiettivo === vecchio);
      messi = 0; finito = false;
      punti.textContent = (giro + 1) + ' / 3';
      disegna();
    }
    turno();
  }
});

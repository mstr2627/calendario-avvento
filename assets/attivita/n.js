Attivita.registra({
  emoji: '❄️', titolo: 'Il tuo fiocco di neve',
  istruzioni: 'Disegna con il dito: ogni riga si ripete sei volte e nasce il tuo fiocco di neve. Ogni fiocco è diverso!',
  avvia: function (c, a) {
    c.style.background = '#0d47a1';
    var tela = a.el('canvas', '', null, c);
    tela.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:crosshair;';
    var dpr = window.devicePixelRatio || 1, W, ctx;
    function prepara() {
      W = c.clientWidth;
      tela.width = W * dpr; tela.height = W * dpr;
      ctx = tela.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
      for (var k = 0; k < 6; k++) {
        var ang = k * Math.PI / 3;
        ctx.beginPath(); ctx.moveTo(W / 2, W / 2); ctx.lineTo(W / 2 + Math.cos(ang) * W * 0.48, W / 2 + Math.sin(ang) * W * 0.48); ctx.stroke();
      }
    }
    prepara();
    var ultimo = null, colore = '#ffffff';
    function linea(p, q) {
      var cx = W / 2, cy = W / 2;
      ctx.strokeStyle = colore; ctx.lineWidth = W / 90; ctx.lineCap = 'round';
      for (var k = 0; k < 6; k++) {
        for (var s = -1; s <= 1; s += 2) {
          var ang = k * Math.PI / 3;
          ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang); ctx.scale(1, s);
          ctx.beginPath(); ctx.moveTo(p[0] - cx, p[1] - cy); ctx.lineTo(q[0] - cx, q[1] - cy); ctx.stroke();
          ctx.restore();
        }
      }
    }
    function pos(ev) { var r = tela.getBoundingClientRect(); return [(ev.clientX - r.left) / r.width * W, (ev.clientY - r.top) / r.height * W]; }
    var tratti = 0;
    tela.addEventListener('pointerdown', function (ev) { ultimo = pos(ev); tela.setPointerCapture(ev.pointerId); a.audio(); });
    tela.addEventListener('pointermove', function (ev) {
      if (!ultimo) return;
      var p = pos(ev); linea(ultimo, p); ultimo = p;
    });
    function su() { if (ultimo) { tratti++; a.nota(1200 + Math.random() * 600, 0.3, 'sine', 0.06); } ultimo = null; }
    tela.addEventListener('pointerup', su); tela.addEventListener('pointercancel', su);
    var colori = a.el('div', '', null, c);
    colori.style.cssText = 'position:absolute;left:3%;bottom:3%;display:flex;gap:2cqw;';
    ['#ffffff', '#81d4fa', '#b388ff', '#a7ffeb'].forEach(function (col) {
      var b = a.el('button', '', null, colori);
      b.style.cssText = 'width:8cqw;height:8cqw;border-radius:50%;border:0.6cqw solid #fff;background:' + col + ';cursor:pointer;';
      b.addEventListener('click', function () { colore = col; });
    });
    var fatto = a.el('button', 'tasto', 'Fatto!', c);
    fatto.style.cssText += 'position:absolute;right:3%;bottom:3%;font-size:5cqw;';
    fatto.addEventListener('click', function () {
      if (tratti === 0) { a.parla('Prima disegna qualcosa!'); return; }
      a.bravo('Che bel fiocco di neve!');
    });
  }
});

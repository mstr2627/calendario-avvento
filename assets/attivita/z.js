Attivita.registra({
  emoji: '🍰', titolo: 'Spolvera il pandoro',
  istruzioni: 'Muovi il setaccio sopra il pandoro con il dito, finché è tutto bianco di zucchero a velo.',
  avvia: function (c, a) {
    c.style.background = 'linear-gradient(#ffe0b2, #fff3e0)';
    var tela = a.el('canvas', '', null, c);
    tela.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;touch-action:none;';
    var dpr = window.devicePixelRatio || 1, W = c.clientWidth;
    tela.width = W * dpr; tela.height = W * dpr;
    var ctx = tela.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    function forma() {
      var p = new Path2D();
      p.moveTo(W * 0.42, W * 0.22); p.lineTo(W * 0.58, W * 0.22); p.lineTo(W * 0.78, W * 0.84); p.lineTo(W * 0.22, W * 0.84); p.closePath();
      return p;
    }
    var pandoro = forma();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(W * 0.5, W * 0.86, W * 0.4, W * 0.06, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#bcaaa4'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#f2b54a'; ctx.fill(pandoro);
    ctx.strokeStyle = '#c8882a'; ctx.lineWidth = W * 0.006;
    for (var k = 1; k < 5; k++) {
      ctx.beginPath(); ctx.moveTo(W * (0.42 + k * 0.032), W * 0.22); ctx.lineTo(W * (0.22 + k * 0.112), W * 0.84); ctx.stroke();
    }
    ctx.stroke(pandoro);
    var celle = [], N = 18;
    for (var i = 0; i < N; i++) for (var j = 0; j < N; j++) {
      var x = (i + 0.5) / N * W, y = (j + 0.5) / N * W;
      if (ctx.isPointInPath(pandoro, x * dpr, y * dpr)) celle.push({ x: x, y: y, ok: false });
    }
    var coperte = 0, finito = false;
    var setaccio = a.pezzo(c, '<svg viewBox="0 0 60 40"><ellipse cx="26" cy="20" rx="22" ry="12" fill="#cfd8dc" stroke="#607d8b" stroke-width="2"/>' +
      '<path d="M8 20 L44 20 M14 13 L38 27 M14 27 L38 13" stroke="#90a4ae" stroke-width="1"/><line x1="47" y1="16" x2="59" y2="6" stroke="#607d8b" stroke-width="4" stroke-linecap="round"/></svg>', 80, 15);
    setaccio.style.width = '24%'; setaccio.style.pointerEvents = 'none'; setaccio.style.zIndex = 3;
    function spolvera(px, py) {
      ctx.save(); ctx.clip(pandoro);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      for (var n = 0; n < 30; n++) {
        var ang = Math.random() * Math.PI * 2, r = Math.random() * W * 0.09;
        ctx.beginPath(); ctx.arc(px + Math.cos(ang) * r, py + W * 0.06 + Math.sin(ang) * r * 0.6, 1 + Math.random() * 1.8, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
      celle.forEach(function (q) {
        if (!q.ok && Math.hypot(q.x - px, q.y - (py + W * 0.06)) < W * 0.085) { q.ok = true; coperte++; }
      });
      if (!finito && coperte / celle.length > 0.9) {
        finito = true;
        ctx.save(); ctx.clip(pandoro); ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.fill(pandoro); ctx.restore();
        a.dopo(300, function () { a.bravo('Il pandoro è pronto!'); });
      }
    }
    var giu = false;
    function muovi(ev) {
      var r = tela.getBoundingClientRect();
      var x = (ev.clientX - r.left) / r.width * W, y = (ev.clientY - r.top) / r.height * W;
      a.posiziona(setaccio, x / W * 100, y / W * 100 - 6);
      if (giu || ev.pointerType === 'mouse') spolvera(x, y - W * 0.06);
    }
    tela.addEventListener('pointerdown', function (ev) { giu = true; a.audio(); tela.setPointerCapture(ev.pointerId); muovi(ev); });
    tela.addEventListener('pointermove', muovi);
    tela.addEventListener('pointerup', function () { giu = false; });
  }
});

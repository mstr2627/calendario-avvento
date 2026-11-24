Attivita.registra({
  emoji: '🌨️', titolo: 'La palla di neve',
  istruzioni: 'Scuoti il telefono, oppure strofina il dito sulla palla di vetro, per far nevicare!',
  avvia: function (c, a) {
    c.style.background = 'linear-gradient(#e8eaf6, #c5cae9)';
    var tela = a.el('canvas', '', null, c);
    tela.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;touch-action:none;';
    var dpr = window.devicePixelRatio || 1, W = c.clientWidth;
    tela.width = W * dpr; tela.height = W * dpr;
    var ctx = tela.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var CX = 0.5, CY = 0.44, R = 0.36;
    var fiocchi = [];
    for (var i = 0; i < 140; i++) fiocchi.push({ x: CX + (Math.random() - 0.5) * R * 1.6, y: CY + R * 0.55 + Math.random() * 0.06, vx: 0, vy: 0, r: 1 + Math.random() * 2.2 });
    var agitata = 0, detto = false;
    function scuoti(forza) {
      fiocchi.forEach(function (f) { f.vx += (Math.random() - 0.5) * forza; f.vy -= Math.random() * forza * 1.2; });
      agitata += forza;
      if (!detto && agitata > 0.1) { detto = true; a.dopo(1500, function () { a.bravo('Che nevicata!'); }); }
    }
    var ultimo = null;
    tela.addEventListener('pointerdown', function (ev) { a.audio(); ultimo = [ev.clientX, ev.clientY]; tela.setPointerCapture(ev.pointerId); });
    tela.addEventListener('pointermove', function (ev) {
      if (!ultimo) return;
      var d = Math.hypot(ev.clientX - ultimo[0], ev.clientY - ultimo[1]);
      if (d > 4) { scuoti(Math.min(0.03, d / W * 0.25)); a.nota(1800 + Math.random() * 800, 0.08, 'sine', 0.02); }
      ultimo = [ev.clientX, ev.clientY];
    });
    tela.addEventListener('pointerup', function () { ultimo = null; });
    function movimento(ev) {
      var g = ev.accelerationIncludingGravity || ev.acceleration; if (!g) return;
      var m = Math.hypot(g.x || 0, g.y || 0, g.z || 0);
      if (Math.abs(m - 9.8) > 6) scuoti(0.02);
    }
    a.ascolta(window, 'devicemotion', movimento);
    var tasto = a.el('button', 'tasto', '📳 Scuoti', c);
    tasto.style.cssText += 'position:absolute;right:3%;bottom:3%;font-size:5cqw;';
    tasto.addEventListener('click', function () {
      a.audio();
      try {
        if (window.DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === 'function') DeviceMotionEvent.requestPermission();
      } catch (e) {}
      scuoti(0.06);
    });
    function disegna() {
      var w = W;
      ctx.clearRect(0, 0, w, w);
      ctx.fillStyle = '#6d4c41';
      ctx.beginPath(); ctx.moveTo(w * 0.22, w * 0.95); ctx.lineTo(w * 0.78, w * 0.95); ctx.lineTo(w * 0.7, w * 0.76); ctx.lineTo(w * 0.3, w * 0.76); ctx.closePath(); ctx.fill();
      ctx.save();
      ctx.beginPath(); ctx.arc(w * CX, w * CY, w * R, 0, Math.PI * 2); ctx.clip();
      var g = ctx.createLinearGradient(0, w * (CY - R), 0, w * (CY + R)); g.addColorStop(0, '#1a237e'); g.addColorStop(1, '#5c6bc0');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, w);
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(w * CX, w * (CY + R * 0.95), w * R * 1.1, w * R * 0.45, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2e7d32';
      [[0.38, 0.6, 0.07], [0.33, 0.52, 0.05]].forEach(function (t) {
        ctx.beginPath(); ctx.moveTo(w * t[0], w * (t[1] - t[2] * 2.2)); ctx.lineTo(w * (t[0] + t[2]), w * t[1]); ctx.lineTo(w * (t[0] - t[2]), w * t[1]); ctx.closePath(); ctx.fill();
      });
      ctx.fillStyle = '#d84315'; ctx.fillRect(w * 0.52, w * 0.5, w * 0.14, w * 0.12);
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(w * 0.5, w * 0.51); ctx.lineTo(w * 0.59, w * 0.43); ctx.lineTo(w * 0.68, w * 0.51); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ffd54f'; ctx.fillRect(w * 0.565, w * 0.53, w * 0.05, w * 0.04);
      ctx.fillStyle = '#fff';
      fiocchi.forEach(function (f) { ctx.beginPath(); ctx.arc(f.x * w, f.y * w, f.r, 0, Math.PI * 2); ctx.fill(); });
      ctx.restore();
      ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = w * 0.012;
      ctx.beginPath(); ctx.arc(w * CX, w * CY, w * R, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = w * 0.02;
      ctx.beginPath(); ctx.arc(w * CX, w * CY, w * R * 0.8, Math.PI * 1.1, Math.PI * 1.4); ctx.stroke();
    }
    a.ciclo(function (dt) {
      fiocchi.forEach(function (f) {
        f.vy += 0.04 * dt; f.vx *= 0.97; f.vy *= 0.97;
        f.x += f.vx * dt * 6 + Math.sin(f.y * 40) * 0.0004; f.y += f.vy * dt * 6 + 0.012 * dt;
        var fondo = CY + R * 0.58;
        if (f.y > fondo) { f.y = fondo - Math.random() * 0.01; f.vy = 0; }
        var dx = f.x - CX, dy = f.y - CY, d = Math.hypot(dx, dy);
        if (d > R * 0.97) { f.x = CX + dx / d * R * 0.97; f.y = CY + dy / d * R * 0.97; f.vx *= -0.3; f.vy *= -0.3; }
      });
      disegna();
    });
  }
});

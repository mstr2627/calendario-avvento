(function () {
  var D = window.LETTERA;

  // Ascolta la parola (sintesi vocale del dispositivo)
  var bottone = document.getElementById('ascolta');
  if (!('speechSynthesis' in window)) { bottone.style.display = 'none'; }
  bottone.addEventListener('click', function () {
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(D.pronuncia);
    u.lang = D.lingua; u.rate = 0.8;
    var voce = speechSynthesis.getVoices().filter(function (v) { return v.lang.replace('_', '-').indexOf(D.lingua.slice(0, 2)) === 0; })[0];
    if (voce) u.voice = voce;
    speechSynthesis.speak(u);
  });

  // Ripassa la parola
  var sfondo = document.getElementById('sfondo');
  var tratto = document.getElementById('tratto');
  var SP_L = 32, SP_P = 56, GRASSO = 30, MARG = 15;
  function righe() {
    var p = D.parola.split(' ');
    if (p.length === 1 || D.parola.length <= 9) return [D.parola];
    var best = null;
    for (var k = 1; k < p.length; k++) {
      var a = p.slice(0, k).join(' '), b = p.slice(k).join(' ');
      var w = Math.max(larg(a, true), larg(b));
      if (!best || w < best[0]) best = [w, [a, b]];
    }
    return best[1];
  }
  function larg(r, prima) {
    var x = 0;
    for (var i = 0; i < r.length; i++) {
      if (r[i] === ' ') { x += SP_P; continue; }
      x += D.tratti[r[i]][0] + (prima && i === 0 ? GRASSO : 0) + SP_L;
    }
    return x - SP_L;
  }
  function disegnaSfondo() {
    var dpr = window.devicePixelRatio || 1;
    var W = sfondo.clientWidth, H = sfondo.clientHeight;
    [sfondo, tratto].forEach(function (c) { c.width = W * dpr; c.height = H * dpr; c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0); });
    var ctx = sfondo.getContext('2d');
    var rr = righe();
    var altU = rr.length * 130 + (rr.length - 1) * 24;
    var maxW = Math.max.apply(null, rr.map(function (r, i) { return larg(r, i === 0); }));
    var s = Math.min((W - 24) / maxW, (H - 16) / altU);
    var y = (H - altU * s) / 2 + MARG * s;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    rr.forEach(function (r, ri) {
      var x = (W - larg(r, ri === 0) * s) / 2;
      for (var i = 0; i < r.length; i++) {
        var ch = r[i];
        if (ch === ' ') { x += SP_P * s; continue; }
        var t = D.tratti[ch], p = new Path2D(t[1]);
        var prima = ri === 0 && i === 0;
        if (prima) x += MARG * s;
        ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
        if (prima) {
          ctx.setLineDash([]); ctx.strokeStyle = '#000'; ctx.lineWidth = GRASSO; ctx.stroke(p);
          ctx.strokeStyle = '#fff'; ctx.lineWidth = GRASSO - 10; ctx.stroke(p);
        } else {
          ctx.setLineDash([9, 8]); ctx.strokeStyle = '#888'; ctx.lineWidth = 4.5; ctx.stroke(p);
        }
        ctx.restore();
        x += (t[0] + (prima ? MARG : 0) + SP_L) * s;
      }
      y += (130 + 24) * s;
    });
  }
  var ctxT = tratto.getContext('2d'), giu = false, ultimo = null;
  function pos(e) { var r = tratto.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
  tratto.addEventListener('pointerdown', function (e) { giu = true; ultimo = pos(e); tratto.setPointerCapture(e.pointerId); });
  tratto.addEventListener('pointermove', function (e) {
    if (!giu) return;
    var p = pos(e);
    ctxT.strokeStyle = '#1e88e5'; ctxT.lineWidth = 7; ctxT.lineCap = 'round';
    ctxT.beginPath(); ctxT.moveTo(ultimo[0], ultimo[1]); ctxT.lineTo(p[0], p[1]); ctxT.stroke();
    ultimo = p;
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (n) { tratto.addEventListener(n, function () { giu = false; }); });
  document.getElementById('pulisci-lavagna').addEventListener('click', function () { ctxT.clearRect(0, 0, tratto.width, tratto.height); });
  disegnaSfondo();
  var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(disegnaSfondo, 200); });
})();

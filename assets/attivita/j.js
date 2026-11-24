Attivita.registra({
  emoji: '🔔', titolo: 'Suona Jingle Bells',
  istruzioni: 'Tocca la campanella che si illumina e suonerai Jingle Bells! Puoi anche ascoltare prima la melodia.',
  proporzioni: '4 / 3',
  avvia: function (c, a) {
    c.style.background = 'linear-gradient(#fff8e1, #ffffff)';
    var NOTE = { C: 523.25, D: 587.33, E: 659.25, F: 698.46, G: 783.99 };
    var COLORI = { C: '#e53935', D: '#fb8c00', E: '#fdd835', F: '#43a047', G: '#1e88e5' };
    var melodia = 'E E E E E E E G C D E F F F F F E E E E E D D E D G'.split(' ');
    var durate = [1, 1, 2, 1, 1, 2, 1, 1, 1.5, .5, 4, 1, 1, 1.5, .5, 1, 1, 1, .5, .5, 1, 1, 1, 1, 2, 2];
    var passo = 0, demo = false;
    var barra = a.el('div', '', null, c);
    barra.style.cssText = 'position:absolute;left:5%;right:5%;top:5%;height:3%;background:#eee;border-radius:2cqw;overflow:hidden;';
    var riempi = a.el('div', '', null, barra);
    riempi.style.cssText = 'height:100%;width:0;background:#43a047;transition:width .2s;';
    var campane = {};
    ['C', 'D', 'E', 'F', 'G'].forEach(function (n, i) {
      var e = a.pezzo(c, '<svg viewBox="0 0 60 70"><circle cx="30" cy="8" r="6" fill="none" stroke="#5d4037" stroke-width="3"/>' +
        '<path d="M30 12 C14 12 12 28 12 40 C12 50 6 54 4 60 L56 60 C54 54 48 50 48 40 C48 28 46 12 30 12 Z" fill="' + COLORI[n] + '" stroke="#0005" stroke-width="2"/>' +
        '<circle cx="30" cy="64" r="5" fill="#5d4037"/></svg>', 12 + i * 19, 52);
      e.style.width = '16%'; e.style.cursor = 'pointer'; e.style.transition = 'transform .1s';
      e.addEventListener('pointerdown', function () {
        if (demo) return;
        suona(n);
        if (passo < melodia.length && n === melodia[passo]) { passo++; aggiorna(); }
      });
      campane[n] = e;
    });
    function suona(n) {
      a.campanella(NOTE[n]);
      var e = campane[n];
      e.style.transform = 'translate(-50%,-50%) rotate(-12deg)';
      setTimeout(function () { e.style.transform = 'translate(-50%,-50%) rotate(10deg)'; }, 90);
      setTimeout(function () { e.style.transform = 'translate(-50%,-50%)'; }, 180);
    }
    function aggiorna() {
      Object.keys(campane).forEach(function (k) { campane[k].classList.remove('pulsa'); });
      riempi.style.width = (passo / melodia.length * 100) + '%';
      if (passo >= melodia.length) { a.dopo(500, function () { a.bravo('Hai suonato Jingle Bells!'); }); return; }
      campane[melodia[passo]].classList.add('pulsa');
    }
    var tasti = a.pezzo(c, null, 50, 88);
    tasti.style.whiteSpace = 'nowrap';
    var ascolta = a.el('button', 'tasto', '🎵 Ascolta', tasti);
    ascolta.style.fontSize = '4.5cqw';
    ascolta.addEventListener('click', function () {
      if (demo) return;
      demo = true; a.audio();
      var t = 0;
      melodia.forEach(function (n, i) {
        a.dopo(t, function () { suona(n); });
        t += durate[i] * 300;
      });
      a.dopo(t + 300, function () { demo = false; });
    });
    aggiorna();
  }
});

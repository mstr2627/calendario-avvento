Attivita.registra({
  emoji: '🌙', titolo: 'La notte quieta',
  istruzioni: 'È ora di dormire. Spegni tutte le luci delle finestre, ma non svegliare il gatto!',
  avvia: function (c, a) {
    c.style.background = 'linear-gradient(#0b1033, #1a237e)';
    var st = '';
    for (var i = 0; i < 20; i++) st += '<circle cx="' + a.intero(2, 98) + '" cy="' + a.intero(2, 40) + '" r="0.5" fill="#fff"/>';
    a.svg(c, '0 0 100 100', st + '<path d="M82 6 A10 10 0 1 0 92 20 A8 8 0 1 1 82 6Z" fill="#fff59d"/>' +
      '<rect x="0" y="88" width="100" height="12" fill="#eceff1"/>', 'sfondo');
    var case_ = [[4, 52, 24, 36, '#8d6e63'], [30, 44, 22, 44, '#a1887f'], [54, 56, 20, 32, '#6d4c41'], [76, 48, 22, 40, '#8d6e63']];
    var accese = 0;
    case_.forEach(function (k) {
      var h = a.el('div', '', null, c);
      h.style.cssText = 'position:absolute;left:' + k[0] + '%;top:' + k[1] + '%;width:' + k[2] + '%;height:' + k[3] + '%;background:' + k[4] + ';';
      var tetto = a.el('div', '', null, c);
      tetto.style.cssText = 'position:absolute;left:' + (k[0] - 2) + '%;top:' + (k[1] - 9) + '%;width:' + (k[2] + 4) + '%;height:9%;' +
        'background:#4e342e;clip-path:polygon(50% 0,100% 100%,0 100%);';
      var cols = 2, righe = Math.floor(k[3] / 13);
      for (var r = 0; r < righe; r++) for (var q = 0; q < cols; q++) {
        var f = a.el('div', '', null, h);
        f.style.cssText = 'position:absolute;left:' + (14 + q * 46) + '%;top:' + (8 + r * (90 / righe)) + '%;width:30%;height:' + (60 / righe) + '%;' +
          'background:#ffd54f;box-shadow:0 0 2cqw #ffca28;cursor:pointer;border:0.4cqw solid #3e2723;transition:background .2s;';
        accese++;
        f.addEventListener('click', function (ev) {
          var w = ev.currentTarget;
          if (w.dataset.spenta) return;
          a.audio();
          w.dataset.spenta = '1'; w.style.background = '#263238'; w.style.boxShadow = 'none';
          a.nota(330, 0.25, 'sine', 0.08);
          if (--accese === 0) a.dopo(500, function () { a.bravo('Shhh... Buonanotte!'); });
        });
      }
    });
    var gatto = a.pezzo(c, '🐈', 48, 93); gatto.style.fontSize = '11cqw'; gatto.style.cursor = 'pointer';
    var zzz = a.pezzo(c, '💤', 56, 88); zzz.style.fontSize = '6cqw'; zzz.style.pointerEvents = 'none'; zzz.style.animation = 'saltella 2s infinite';
    gatto.addEventListener('click', function () {
      a.audio();
      gatto.textContent = '🙀'; zzz.style.opacity = 0;
      a.nota(880, 0.12, 'square', 0.08); a.nota(660, 0.2, 'square', 0.08, 0.12);
      a.parla('Miao! Shhh, non svegliare il gatto!');
      a.dopo(1800, function () { gatto.textContent = '🐈'; zzz.style.opacity = 1; });
    });
  }
});

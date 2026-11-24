Attivita.registra({
  emoji: '☃️', titolo: 'Il pupazzo di neve',
  istruzioni: 'Costruisci il pupazzo di neve: metti prima la palla più grande, poi quella media e in cima la più piccola.',
  avvia: function (c, a) {
    c.style.background = 'linear-gradient(#b3e5fc, #e1f5fe)';
    a.svg(c, '0 0 100 100', '<path d="M0 90 Q50 82 100 90 L100 100 L0 100 Z" fill="#fff"/>' +
      '<ellipse cx="50" cy="91" rx="20" ry="3" fill="#cfd8dc"/>', 'sfondo');
    var palle = [{ d: 30, y: 77, nome: 'grande' }, { d: 22, y: 55, nome: 'media' }, { d: 15, y: 38, nome: 'piccola' }];
    var prossima = 0;
    var partenze = a.mescola([[14, 22], [86, 26], [16, 62], [84, 66]]).slice(0, 3);
    palle.forEach(function (p, i) {
      var e = a.pezzo(c, '', partenze[i][0], partenze[i][1]);
      e.style.cssText += 'width:' + p.d + '%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 35% 30%, #fff, #e0e0e0);' +
        'box-shadow:0 0.6cqw 1.5cqw #0003;';
      a.trascina(e, c, {
        lascia: function (el, sotto, x) {
          if (Math.abs(x - 50) > 22) return false;
          if (i !== prossima) {
            a.errore();
            a.parla(prossima === 0 ? 'Prima la palla più grande!' : prossima === 1 ? 'Ora la palla media!' : 'Ora la palla più piccola!');
            return false;
          }
          a.blocca(el, 50, p.y); el.style.zIndex = 1 + i; a.nota(500 + i * 150, 0.4, 'sine', 0.2);
          prossima++;
          if (prossima === 3) a.dopo(400, finale);
          return true;
        }
      });
    });
    function finale() {
      [['⚫', 46, 35, 3], ['⚫', 54, 35, 3], ['🥕', 53, 39.5, 6], ['🎩', 50, 27, 12], ['⚫', 50, 52, 3], ['⚫', 50, 60, 3], ['🧣', 50, 46, 11]].forEach(function (d) {
        var e = a.pezzo(c, d[0], d[1], d[2]); e.style.fontSize = d[3] + 'cqw'; e.style.zIndex = 6; e.style.animation = 'appare .5s';
        if (d[0] === '🥕') e.style.transform = 'translate(-50%,-50%) rotate(-45deg)';
      });
      a.dopo(600, function () { a.bravo('Che bel pupazzo di neve!'); });
    }
  }
});

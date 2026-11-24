Attivita.registra({
  emoji: '🎒', titolo: 'Il sacco di Babbo Natale',
  istruzioni: 'Scegli tre regali e trascinali nel sacco di Babbo Natale.',
  avvia: function (c, a) {
    var regali = [['🧸', 'un orsacchiotto'], ['🚂', 'un trenino'], ['🎨', 'i colori'], ['⚽', 'un pallone'], ['🪁', 'un aquilone'],
      ['🎸', 'una chitarra'], ['📚', 'dei libri'], ['🚲', 'una bicicletta'], ['🦖', 'un dinosauro'], ['🪀', 'uno yo-yo']];
    var scelti = [];
    a.svg(c, '0 0 100 100', '<path d="M28 96 Q18 66 36 56 L33 48 Q50 54 67 48 L64 56 Q82 66 72 96 Q50 100 28 96 Z" fill="#a1887f" stroke="#5d4037" stroke-width="1.2"/>' +
      '<path class="bocca" d="M34 52 Q50 60 66 52" fill="none" stroke="#5d4037" stroke-width="2"/>' +
      '<path d="M44 74 l6 -6 l6 6 l-6 6 z" fill="#fdd835"/>', 'sfondo');
    var sacco = a.pezzo(c, '', 50, 72, 'sacco');
    sacco.style.cssText += 'width:46%;height:46%;';
    var conta = a.el('div', 'punteggio', '🎁 0 / 3', c);
    a.mescola(regali).slice(0, 8).forEach(function (r, i) {
      var e = a.pezzo(c, r[0], 12 + (i % 4) * 25.3, 19 + Math.floor(i / 4) * 19);
      e.style.fontSize = '12cqw';
      function metti() {
        if (scelti.length >= 3) return;
        scelti.push(r[1]);
        a.blocca(e, 50, 70); e.style.transition = 'opacity .4s .2s, left .3s, top .3s'; e.style.opacity = 0;
        a.ding(); a.parla(r[1]);
        conta.textContent = '🎁 ' + scelti.length + ' / 3';
        if (scelti.length === 3) a.dopo(1600, function () {
          a.bravo('Ho ho ho! Nel sacco ci sono ' + scelti[0] + ', ' + scelti[1] + ' e ' + scelti[2] + '!');
        });
      }
      a.trascina(e, c, {
        tocco: metti,
        lascia: function (el, sotto) { if (a.trova(sotto, '.sacco')) { metti(); return true; } return false; }
      });
    });
  }
});

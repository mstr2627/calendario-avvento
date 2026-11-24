Attivita.registra({
  emoji: '🎁', titolo: 'Scarta il regalo',
  istruzioni: 'Tocca il regalo tante volte per strappare la carta. Cosa ci sarà dentro?',
  avvia: function (c, a) {
    var giochi = [['🧸', 'Un orsacchiotto!'], ['🚂', 'Un trenino!'], ['🪀', 'Uno yo-yo!'], ['🪁', 'Un aquilone!'],
      ['🎈', 'Un palloncino!'], ['🦄', 'Un unicorno!'], ['⚽', 'Un pallone!'], ['🚗', 'Una macchinina!'], ['🦖', 'Un dinosauro!']];
    var dono = a.scegli(giochi);
    var pezzi = [
      '0,0 50,0 30,40 0,30', '50,0 100,0 100,25 70,35 30,40', '0,30 30,40 25,75 0,70', '30,40 70,35 75,70 25,75',
      '70,35 100,25 100,70 75,70', '0,70 25,75 50,100 0,100', '25,75 75,70 100,100 50,100', '75,70 100,70 100,100'];
    var box = a.svg(c, '0 0 100 100',
      '<g transform="translate(15 22) scale(0.7)">' +
      '<rect x="0" y="0" width="100" height="100" fill="#c8a165" stroke="#8d6e3f" stroke-width="2"/>' +
      '<text x="50" y="70" font-size="60" text-anchor="middle" fill="#8d6e3f">?</text>' +
      '<g class="carta">' + pezzi.map(function (p, i) {
        return '<polygon points="' + p + '" fill="' + (i % 2 ? '#e53935' : '#c62828') + '" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 2"/>';
      }).join('') +
      '<rect x="44" y="0" width="12" height="100" fill="#fdd835"/><rect x="0" y="44" width="100" height="12" fill="#fdd835"/></g>' +
      '</g>', 'sfondo');
    var carta = Array.prototype.slice.call(box.querySelectorAll('.carta polygon'));
    var nastri = box.querySelectorAll('.carta rect');
    var aperto = false;
    c.addEventListener('click', function () {
      if (aperto) return;
      a.audio();
      a.trema(box);
      if (carta.length) {
        var p = carta.splice(Math.floor(Math.random() * carta.length), 1)[0];
        p.style.transition = 'transform .5s, opacity .5s';
        p.style.transform = 'translate(' + (Math.random() * 60 - 30) + 'px,' + (-40 - Math.random() * 40) + 'px) rotate(' + (Math.random() * 90 - 45) + 'deg)';
        p.style.opacity = 0;
        a.nota(300 + Math.random() * 300, 0.15, 'square', 0.08);
        if (carta.length === 3) Array.prototype.forEach.call(nastri, function (n) { n.style.transition = 'opacity .4s'; n.style.opacity = 0; });
      }
      if (!carta.length) {
        aperto = true;
        box.style.transition = 'opacity .5s'; box.style.opacity = 0.25;
        var g = a.pezzo(c, dono[0], 50, 55); g.style.fontSize = '40cqw'; g.style.animation = 'appare .6s, saltella 1s .6s infinite';
        a.dopo(700, function () { a.bravo(dono[1]); });
      }
    });
  }
});

Attivita.registra({
  emoji: '🔮', titolo: 'Le ombre delle palline',
  istruzioni: 'Trascina ogni decorazione sulla sua ombra.',
  avvia: function (c, a) {
    var forme = {
      pallina: '<circle cx="20" cy="23" r="15"/><rect x="16" y="3" width="8" height="6" rx="1"/>',
      stella: '<polygon points="20,2 25,15 39,15 28,24 32,38 20,30 8,38 12,24 1,15 15,15"/>',
      cuore: '<path d="M20 37 C-4 20 4 2 20 13 C36 2 44 20 20 37Z"/>',
      campana: '<path d="M20 5 C10 5 9 15 9 22 C9 28 5 30 3 33 L37 33 C35 30 31 28 31 22 C31 15 30 5 20 5Z"/><circle cx="20" cy="36" r="3.5"/>'
    };
    var colori = { pallina: '#e53935', stella: '#fdd835', cuore: '#ec407a', campana: '#43a047' };
    var nomi = Object.keys(forme), fatte = 0;
    a.mescola(nomi).forEach(function (n, i) {
      var o = a.pezzo(c, '<svg viewBox="0 0 40 40"><g fill="#37474f" opacity="0.85">' + forme[n] + '</g></svg>', 14 + i * 24, 74, 'ombra');
      o.style.width = '19%'; o.dataset.forma = n;
    });
    a.mescola(nomi).forEach(function (n, i) {
      var p = a.pezzo(c, '<svg viewBox="0 0 40 40"><g fill="' + colori[n] + '" stroke="#0005" stroke-width="1">' + forme[n] + '</g></svg>', 14 + i * 24, 22);
      p.style.width = '19%';
      a.trascina(p, c, {
        lascia: function (e, sotto) {
          var o = a.trova(sotto, '.ombra');
          if (o && o.dataset.forma === n) {
            a.blocca(e, parseFloat(o.dataset.x), parseFloat(o.dataset.y)); a.ding();
            if (++fatte === nomi.length) a.dopo(600, function () { a.bravo('Bravo! Hai trovato tutte le ombre!'); });
            return true;
          }
          if (o) a.errore();
          return false;
        }
      });
    });
  }
});

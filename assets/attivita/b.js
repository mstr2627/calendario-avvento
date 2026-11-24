Attivita.registra({
  emoji: '🎅', titolo: 'Vesti Babbo Natale',
  istruzioni: 'Trascina il cappello, la barba, la cintura e gli stivali al posto giusto.',
  avvia: function (c, a) {
    a.svg(c, '0 0 100 100',
      '<rect x="28" y="46" width="9" height="22" rx="4" fill="#d32f2f"/><rect x="63" y="46" width="9" height="22" rx="4" fill="#d32f2f"/>' +
      '<circle cx="32.5" cy="70" r="4.5" fill="#fff" stroke="#ccc"/><circle cx="67.5" cy="70" r="4.5" fill="#fff" stroke="#ccc"/>' +
      '<rect x="39" y="72" width="9" height="14" fill="#d32f2f"/><rect x="52" y="72" width="9" height="14" fill="#d32f2f"/>' +
      '<rect x="35" y="44" width="30" height="32" rx="7" fill="#d32f2f"/><rect x="48" y="44" width="4" height="32" fill="#fff"/>' +
      '<circle cx="50" cy="32" r="11" fill="#f8d1b0"/><circle cx="46" cy="30" r="1.3" fill="#333"/><circle cx="54" cy="30" r="1.3" fill="#333"/>' +
      '<circle cx="50" cy="34" r="2" fill="#e57373"/>', 'sfondo');
    var parti = [
      { nome: 'cappello', x: 50, y: 21, w: 30, h: 14, px: 14, py: 16,
        svg: '<svg viewBox="0 0 60 40"><path d="M5 32 Q18 2 46 6 Q56 10 54 22 L40 32 Z" fill="#d32f2f"/><circle cx="54" cy="22" r="6" fill="#fff" stroke="#bbb"/><rect x="1" y="28" width="48" height="10" rx="5" fill="#fff" stroke="#bbb"/></svg>' },
      { nome: 'barba', x: 50, y: 41, w: 24, h: 16, px: 86, py: 22,
        svg: '<svg viewBox="0 0 60 46"><path d="M3 4 Q2 40 30 45 Q58 40 57 4 Q44 16 30 14 Q16 16 3 4 Z" fill="#fff" stroke="#bbb"/><path d="M17 9 Q30 2 43 9 Q30 15 17 9Z" fill="#f5f5f5" stroke="#bbb"/></svg>' },
      { nome: 'cintura', x: 50, y: 64, w: 34, h: 7, px: 14, py: 82,
        svg: '<svg viewBox="0 0 80 16"><rect x="0" y="2" width="80" height="12" fill="#222"/><rect x="31" y="0" width="18" height="16" fill="none" stroke="#f2b705" stroke-width="4"/></svg>' },
      { nome: 'stivali', x: 50, y: 89, w: 30, h: 9, px: 86, py: 72,
        svg: '<svg viewBox="0 0 70 26"><path d="M14 0 h14 v26 h-26 v-3 q0 -7 7 -7 h5 z" fill="#222"/><path d="M42 0 h14 v16 h5 q7 0 7 7 v3 h-26 z" fill="#222"/></svg>' }
    ];
    var messi = 0;
    parti.forEach(function (p) {
      var posto = a.pezzo(c, '', p.x, p.y, 'posto');
      posto.dataset.posto = p.nome;
      posto.style.cssText += 'width:' + p.w + '%;height:' + p.h + '%;border:0.6cqw dashed #90a4ae;border-radius:2cqw;';
      var e = a.pezzo(c, p.svg, p.px, p.py);
      e.style.width = p.w + '%';
      a.trascina(e, c, {
        lascia: function (el, sotto) {
          var t = a.trova(sotto, '[data-posto]');
          if (t && t.dataset.posto === p.nome) {
            a.blocca(el, p.x, p.y); t.style.border = '0'; a.ding();
            if (++messi === parti.length) a.dopo(500, function () { a.bravo('Ho ho ho! Grazie!'); });
            return true;
          }
          if (t) { a.errore(); }
          return false;
        }
      });
    });
  }
});

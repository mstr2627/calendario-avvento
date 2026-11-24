Attivita.registra({
  emoji: '🌟', titolo: 'La notte della Vigilia',
  istruzioni: 'Metti in ordine la storia della notte di Natale. Tocca le carte una dopo l\'altra: cosa succede prima, e cosa dopo?',
  proporzioni: '4 / 3',
  avvia: function (c, a) {
    c.style.background = '#ede7f6';
    var storia = [
      ['🛏️😴', 'Si va a nanna'], ['🌙🎅🛷', 'Arriva Babbo Natale'], ['🎄🎁', "I regali sotto l'albero"], ['☀️😃🎁', 'Al mattino, che sorpresa!']];
    var posti = [], carte = [];
    for (var i = 0; i < 4; i++) {
      var p = a.pezzo(c, '', 13 + i * 24.6, 25, 'posto');
      p.style.cssText += 'width:22%;height:36%;border:0.7cqw dashed #9575cd;border-radius:2cqw;display:flex;align-items:flex-end;justify-content:center;' +
        'font-size:5cqw;font-weight:800;color:#9575cd;padding-bottom:1cqw;box-sizing:border-box;';
      p.textContent = i + 1;
      posti.push({ e: p, carta: null });
    }
    function liberi() { for (var k = 0; k < 4; k++) if (!posti[k].carta) return k; return -1; }
    a.mescola([0, 1, 2, 3]).forEach(function (n, i) {
      var e = a.pezzo(c, '', 13 + i * 24.6, 72);
      e.style.cssText += 'width:22%;height:36%;background:#fff;border-radius:2cqw;box-shadow:0 1cqw 0 #0002;display:flex;flex-direction:column;' +
        'align-items:center;justify-content:center;cursor:pointer;transition:left .3s, top .3s;z-index:2;';
      a.el('div', '', storia[n][0], e).style.fontSize = '7cqw';
      var t = a.el('div', '', storia[n][1], e); t.style.cssText = 'font-size:2.8cqw;font-weight:700;padding:0 1cqw;';
      var casa = [13 + i * 24.6, 72];
      var carta = { e: e, n: n, casa: casa, posto: -1 };
      carte.push(carta);
      e.addEventListener('click', function () {
        a.audio();
        if (finito) return;
        if (carta.posto >= 0) {
          posti[carta.posto].carta = null; carta.posto = -1; a.posiziona(e, casa[0], casa[1]); return;
        }
        var k = liberi(); if (k < 0) return;
        posti[k].carta = carta; carta.posto = k;
        a.posiziona(e, parseFloat(posti[k].e.dataset.x), 25);
        a.parla(storia[n][1]); a.nota(500 + k * 100, 0.2);
        if (liberi() < 0) a.dopo(1400, controlla);
      });
    });
    var finito = false;
    function controlla() {
      var giuste = posti.every(function (p, k) { return p.carta.n === k; });
      if (giuste) { finito = true; a.bravo('La storia è in ordine!'); return; }
      a.errore(); a.parla('Quasi! Le carte sbagliate tornano giù. Riprova!');
      posti.forEach(function (p, k) {
        if (p.carta.n !== k) { var cc = p.carta; p.carta = null; cc.posto = -1; a.posiziona(cc.e, cc.casa[0], cc.casa[1]); }
      });
    }
  }
});

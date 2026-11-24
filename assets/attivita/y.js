Attivita.registra({
  emoji: '🍫', titolo: 'Prepara il tronchetto',
  istruzioni: 'Guarda la ricetta in alto e metti gli ingredienti nella ciotola nello stesso ordine. Poi arrotola il dolce!',
  avvia: function (c, a) {
    c.style.background = '#fff8e1';
    var ricetta = [['🥚', 'le uova'], ['🍬', 'lo zucchero'], ['🌾', 'la farina'], ['🍫', 'il cioccolato']];
    var passo = 0, spunte = [];
    var foglio = a.el('div', '', null, c);
    foglio.style.cssText = 'position:absolute;left:4%;right:4%;top:3%;height:20%;background:#fff;border-radius:2cqw;box-shadow:0 0.6cqw 0 #0002;' +
      'display:flex;justify-content:space-around;align-items:center;';
    ricetta.forEach(function (r, i) {
      var d = a.el('div', '', null, foglio); d.style.cssText = 'text-align:center;position:relative;';
      a.el('div', '', (i + 1) + '', d).style.cssText = 'font-size:4cqw;font-weight:800;color:#8d6e63;';
      a.el('div', '', r[0], d).style.fontSize = '8cqw';
      var s = a.el('div', '', '✔️', d); s.style.cssText = 'position:absolute;right:-3cqw;top:0;font-size:5cqw;opacity:0;';
      spunte.push(s);
    });
    var ciotola = a.pezzo(c, '🥣', 50, 82, 'ciotola'); ciotola.style.fontSize = '26cqw';
    var pos = a.mescola([[15, 45], [38, 52], [62, 45], [85, 52]]);
    ricetta.forEach(function (r, i) {
      var e = a.pezzo(c, r[0], pos[i][0], pos[i][1]); e.style.fontSize = '13cqw';
      a.trascina(e, c, {
        lascia: function (el, sotto) {
          if (!a.trova(sotto, '.ciotola')) return false;
          if (i !== passo) { a.errore(); a.parla('Guarda la ricetta: ora ci vogliono ' + ricetta[passo][1]); return false; }
          a.blocca(el, 50, 80); el.style.transition = 'opacity .4s .3s, left .3s, top .3s'; el.style.opacity = 0;
          spunte[i].style.opacity = 1; a.ding(); a.parla(r[1]);
          passo++;
          if (passo === 4) a.dopo(1200, impasto);
          return true;
        }
      });
    });
    function impasto() {
      ciotola.remove();
      var pan = a.pezzo(c, '', 50, 70);
      pan.style.cssText += 'width:70%;height:12%;background:#6d3a1f;border-radius:1cqw;transition:all 1s ease;box-shadow:0 1cqw 0 #3e1f0e;';
      var t = a.pezzo(c, null, 50, 90);
      var b = a.el('button', 'tasto', '🌀 Arrotola!', t);
      b.addEventListener('click', function () {
        t.remove(); a.nota(300, 0.6, 'sine', 0.1);
        pan.style.width = '56%'; pan.style.height = '22%'; pan.style.borderRadius = '6cqw 50% 50% 6cqw';
        pan.style.background = 'repeating-linear-gradient(100deg,#6d3a1f 0 3cqw,#4e2a14 3cqw 3.8cqw)';
        a.dopo(1100, function () {
          var fine = a.pezzo(c, '', 25, 70);
          fine.style.cssText += 'width:20%;aspect-ratio:1;border-radius:50%;background:repeating-radial-gradient(circle,#f3e5d8 0 1cqw,#6d3a1f 1cqw 2.4cqw);border:0.8cqw solid #4e2a14;';
          var agri = a.pezzo(c, '🌿🍒', 55, 57); agri.style.fontSize = '8cqw';
          a.dopo(400, function () { a.bravo('Il tronchetto è pronto!'); });
        });
      });
    }
  }
});

(function () {
  var CHIAVE = 'calendario-avvento-aperte';
  var aperte = [];
  try { aperte = JSON.parse(localStorage.getItem(CHIAVE) || '[]'); } catch (e) { aperte = []; }
  function salva() { try { localStorage.setItem(CHIAVE, JSON.stringify(aperte)); } catch (e) {} }
  document.querySelectorAll('.porta').forEach(function (p) {
    var l = p.dataset.lettera;
    if (aperte.indexOf(l) >= 0) p.classList.add('aperta');
    p.addEventListener('click', function () {
      if (!p.classList.contains('aperta')) {
        p.classList.add('aperta');
        if (aperte.indexOf(l) < 0) { aperte.push(l); salva(); }
      } else {
        location.href = 'lettere/' + l.toLowerCase() + '.html';
      }
    });
  });
})();

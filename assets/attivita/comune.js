/* Strumenti comuni per le attività delle lettere.
 * Ogni file attivita/<lettera>.js chiama Attivita.registra({ emoji, titolo, istruzioni, proporzioni, avvia }).
 * avvia(campo, a) riceve il riquadro di gioco e gli strumenti qui sotto.
 */
(function () {
  'use strict';
  var definizione = null;
  var timer = [], cicli = [], ascoltatori = [];

  // ---------- voce ----------
  function voce(lingua) {
    try {
      var l = lingua.slice(0, 2);
      return speechSynthesis.getVoices().filter(function (v) {
        return v.lang.replace('_', '-').toLowerCase().indexOf(l) === 0;
      })[0];
    } catch (e) { return null; }
  }
  function parla(testo, lingua) {
    try {
      if (!('speechSynthesis' in window)) return;
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(testo);
      u.lang = lingua || 'it-IT'; u.rate = 0.9;
      var v = voce(u.lang); if (v) u.voice = v;
      speechSynthesis.speak(u);
    } catch (e) {}
  }

  // ---------- suoni ----------
  var ctx = null;
  function audio() {
    try {
      if (!ctx) { var C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ctx = new C(); }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    } catch (e) { return null; }
  }
  function nota(freq, durata, tipo, volume, ritardo) {
    var c = audio(); if (!c) return;
    var t = c.currentTime + (ritardo || 0);
    var o = c.createOscillator(), g = c.createGain();
    o.type = tipo || 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(volume || 0.25, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + (durata || 0.4));
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + (durata || 0.4) + 0.05);
  }
  function campanella(freq, ritardo) {
    nota(freq, 1.4, 'sine', 0.28, ritardo);
    nota(freq * 2.76, 0.7, 'sine', 0.07, ritardo);
    nota(freq * 5.4, 0.35, 'sine', 0.03, ritardo);
  }
  function ding() { campanella(1046); campanella(1568, 0.12); }
  function errore() { nota(196, 0.3, 'triangle', 0.22); }
  function fanfara() { [523, 659, 784, 1046].forEach(function (f, i) { campanella(f, i * 0.13); }); }

  // ---------- tempo (si fermano da soli quando si ricomincia) ----------
  function dopo(ms, fn) { var id = setTimeout(fn, ms); timer.push(id); return id; }
  function ogni(ms, fn) { var id = setInterval(fn, ms); timer.push(id); return id; }
  function ciclo(fn) {
    var stato = { attivo: true }, prima = null;
    function passo(t) {
      if (!stato.attivo) return;
      var dt = prima === null ? 0 : Math.min(0.05, (t - prima) / 1000);
      prima = t;
      if (fn(dt) === false) { stato.attivo = false; return; }
      requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
    cicli.push(stato);
    return stato;
  }
  function ascolta(bersaglio, evento, fn, opz) {
    bersaglio.addEventListener(evento, fn, opz);
    ascoltatori.push([bersaglio, evento, fn, opz]);
  }
  function fermaTutto() {
    timer.forEach(function (id) { clearTimeout(id); clearInterval(id); });
    cicli.forEach(function (s) { s.attivo = false; });
    ascoltatori.forEach(function (x) { x[0].removeEventListener(x[1], x[2], x[3]); });
    timer = []; cicli = []; ascoltatori = [];
  }

  // ---------- elementi ----------
  function el(tag, classe, testo, padre) {
    var e = document.createElement(tag);
    if (classe) e.className = classe;
    if (testo !== undefined && testo !== null) e.textContent = testo;
    if (padre) padre.appendChild(e);
    return e;
  }
  /* Elemento posizionato al centro del punto (x, y) in percentuale del riquadro. */
  function pezzo(padre, contenuto, x, y, classe) {
    var e = el('div', 'pezzo' + (classe ? ' ' + classe : ''), null, padre);
    if (contenuto && contenuto.nodeType) e.appendChild(contenuto);
    else if (typeof contenuto === 'string' && contenuto.charAt(0) === '<') e.innerHTML = contenuto;
    else if (contenuto) e.textContent = contenuto;
    posiziona(e, x, y);
    return e;
  }
  function posiziona(e, x, y) { e.style.left = x + '%'; e.style.top = y + '%'; e.dataset.x = x; e.dataset.y = y; }
  function svg(padre, viewBox, interno, classe) {
    var d = document.createElement('div');
    d.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + viewBox + '"' +
      (classe ? ' class="' + classe + '"' : '') + '>' + interno + '</svg>';
    var s = d.firstChild;
    if (padre) padre.appendChild(s);
    return s;
  }
  function centro(e, campo) {
    var r = e.getBoundingClientRect(), c = campo.getBoundingClientRect();
    return { x: (r.left + r.width / 2 - c.left) / c.width * 100, y: (r.top + r.height / 2 - c.top) / c.height * 100 };
  }
  function trova(lista, selettore) {
    for (var i = 0; i < lista.length; i++) {
      var n = lista[i];
      var c = n.closest ? n.closest(selettore) : null;
      if (c) return c;
    }
    return null;
  }
  function trema(e) { e.classList.remove('trema'); void e.offsetWidth; e.classList.add('trema'); }

  /* Rende trascinabile un pezzo. opz: { tocco(e), muovi(e, x, y), lascia(e, sotto, x, y) -> false per tornare indietro } */
  function trascina(e, campo, opz) {
    opz = opz || {};
    var inizio = null;
    e.classList.add('mobile');
    e.addEventListener('pointerdown', function (ev) {
      if (e.dataset.fermo) return;
      ev.preventDefault();
      try { e.setPointerCapture(ev.pointerId); } catch (x) {}
      audio();
      inizio = { px: ev.clientX, py: ev.clientY, x: parseFloat(e.dataset.x), y: parseFloat(e.dataset.y),
        r: campo.getBoundingClientRect(), mosso: false };
      e.classList.add('preso');
    });
    e.addEventListener('pointermove', function (ev) {
      if (!inizio) return;
      var dx = ev.clientX - inizio.px, dy = ev.clientY - inizio.py;
      if (Math.abs(dx) + Math.abs(dy) > 6) inizio.mosso = true;
      var x = Math.max(0, Math.min(100, inizio.x + dx / inizio.r.width * 100));
      var y = Math.max(0, Math.min(100, inizio.y + dy / inizio.r.height * 100));
      posiziona(e, x, y);
      if (opz.muovi) opz.muovi(e, x, y);
    });
    function fine(ev) {
      if (!inizio) return;
      var i = inizio; inizio = null;
      e.classList.remove('preso');
      if (!i.mosso) {
        posiziona(e, i.x, i.y);
        if (opz.tocco) opz.tocco(e);
        return;
      }
      e.style.pointerEvents = 'none';
      var sotto = document.elementsFromPoint(ev.clientX, ev.clientY);
      e.style.pointerEvents = '';
      var ok = opz.lascia ? opz.lascia(e, sotto, parseFloat(e.dataset.x), parseFloat(e.dataset.y)) : true;
      if (ok === false) torna(e, i.x, i.y);
    }
    e.addEventListener('pointerup', fine);
    e.addEventListener('pointercancel', fine);
  }
  function torna(e, x, y) {
    e.classList.add('scivola');
    posiziona(e, x, y);
    setTimeout(function () { e.classList.remove('scivola'); }, 320);
  }
  function blocca(e, x, y) {
    if (x !== undefined) { e.classList.add('scivola'); posiziona(e, x, y); setTimeout(function () { e.classList.remove('scivola'); }, 320); }
    e.dataset.fermo = '1';
    e.classList.add('fermo');
  }

  // ---------- numeri ----------
  function mescola(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function intero(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }
  function scegli(a) { return a[Math.floor(Math.random() * a.length)]; }
  var NUMERI = ['zero', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci',
    'undici', 'dodici', 'tredici', 'quattordici', 'quindici', 'sedici', 'diciassette', 'diciotto', 'diciannove', 'venti'];

  // ---------- festa finale ----------
  var campoAttuale = null;
  function bravo(messaggio) {
    if (!campoAttuale) return;
    fanfara();
    parla(messaggio || 'Bravissimo!');
    var o = el('div', 'bravo', null, campoAttuale);
    el('div', 'bravo-stelle', '⭐ 🎉 ⭐', o);
    el('div', 'bravo-testo', messaggio || 'Bravissimo!', o);
    for (var i = 0; i < 24; i++) {
      var c = el('span', 'coriandolo', scegli(['⭐', '❄️', '🎉', '✨', '🎈']), o);
      c.style.left = Math.random() * 100 + '%';
      c.style.animationDelay = (Math.random() * 0.8) + 's';
      c.style.animationDuration = (1.6 + Math.random() * 1.4) + 's';
    }
    o.addEventListener('click', function () { o.remove(); });
  }

  var strumenti = {
    parla: parla, nota: nota, campanella: campanella, ding: ding, errore: errore, fanfara: fanfara, audio: audio,
    dopo: dopo, ogni: ogni, ciclo: ciclo, ascolta: ascolta,
    el: el, pezzo: pezzo, posiziona: posiziona, svg: svg, centro: centro, trova: trova, trema: trema,
    trascina: trascina, torna: torna, blocca: blocca,
    mescola: mescola, intero: intero, scegli: scegli, NUMERI: NUMERI, bravo: bravo
  };

  window.Attivita = {
    registra: function (d) { definizione = d; },
    strumenti: strumenti
  };

  document.addEventListener('DOMContentLoaded', function () {
    var box = document.getElementById('attivita');
    if (!box || !definizione) return;
    box.querySelector('.titolo-attivita').textContent = definizione.emoji + ' ' + definizione.titolo;
    box.querySelector('.istruzioni').textContent = definizione.istruzioni;
    box.querySelector('.leggi-istruzioni').addEventListener('click', function () { audio(); parla(definizione.istruzioni); });
    var campo = box.querySelector('.campo');
    function avvia() {
      fermaTutto();
      var nuovo = campo.cloneNode(false);
      campo.parentNode.replaceChild(nuovo, campo);
      campo = nuovo;
      campo.style.aspectRatio = definizione.proporzioni || '1 / 1';
      campoAttuale = campo;
      definizione.avvia(campo, strumenti);
    }
    box.querySelector('.ricomincia').addEventListener('click', avvia);
    avvia();
  });
})();

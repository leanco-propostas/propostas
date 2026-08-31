/* ============================================================
   Lean Company · Apresentação institucional
   Menu mobile · barra de progresso · navegação ativa
   abas de ferramentas · lightbox
   ============================================================ */
(function () {
  'use strict';

  /* ---------- menu mobile ---------- */
  var burger = document.getElementById('burger');
  var mnav = document.getElementById('mnav');

  burger.addEventListener('click', function () {
    var open = mnav.classList.toggle('on');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Fechar o menu' : 'Abrir o menu');
  });
  mnav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      mnav.classList.remove('on');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Abrir o menu');
    }
  });

  /* ---------- barra de progresso e navegação ativa ---------- */
  var prog = document.getElementById('prog');
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var secs = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);
  var ticking = false;

  function update() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    prog.style.width = (max > 0 ? (doc.scrollTop / max) * 100 : 0) + '%';

    var mark = doc.scrollTop + 140;
    var current = -1;
    for (var i = 0; i < secs.length; i++) {
      if (secs[i].offsetTop <= mark) current = i;
    }
    links.forEach(function (a, i) { a.classList.toggle('on', i === current); });
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();

  /* ---------- abas de ferramentas ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));

  function select(idx, focus) {
    tabs.forEach(function (t, i) {
      var on = i === idx;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tabs[idx].focus();
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(i); });
    t.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') n = 0;
      if (e.key === 'End') n = tabs.length - 1;
      if (n !== null) { e.preventDefault(); select(n, true); }
    });
  });

  /* ---------- lightbox ---------- */
  var lb = document.getElementById('lb');
  var lbimg = document.getElementById('lbimg');
  var lbcap = document.getElementById('lbcap');
  var lbx = document.getElementById('lbx');
  var last = null;

  function open(btn) {
    last = btn;
    lbimg.src = btn.getAttribute('data-src');
    lbimg.alt = btn.querySelector('img').alt;
    lbcap.textContent = btn.getAttribute('data-cap') || '';
    lb.classList.add('on');
    document.body.style.overflow = 'hidden';
    lbx.focus();
  }

  function close() {
    lb.classList.remove('on');
    lbimg.src = '';
    document.body.style.overflow = '';
    if (last) { last.focus(); last = null; }
  }

  document.querySelectorAll('.tool__shot').forEach(function (btn) {
    btn.addEventListener('click', function () { open(btn); });
  });
  lbx.addEventListener('click', close);
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lb.classList.contains('on')) close();
  });
})();

/* Habitap site — scroll + entrance animations */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('anim');

  // Mark reveal targets
  var targets = document.querySelectorAll(
    '.sec-head, .plat-card, .mod, .proj, .stat, .plogo, .cta-band .wrap > *, .page-hero > *, .hero-video-copy > *, .hero-video-copy, .contact-info > *, .contact-card'
  );
  targets.forEach(function (el, i) { el.classList.add('rv'); });

  // Stagger siblings within common parents
  var parents = new Map();
  targets.forEach(function (el) {
    var p = el.parentElement;
    if (!parents.has(p)) parents.set(p, 0);
    var n = parents.get(p);
    el.style.transitionDelay = Math.min(n * 70, 420) + 'ms';
    parents.set(p, n + 1);
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(function (el) { io.observe(el); });

  // Fail-safe: reveal anything already in (or above) the viewport on load,
  // in case IO doesn't fire initially (e.g. embedded iframes).
  function revealVisible() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    targets.forEach(function (el) {
      if (el.classList.contains('in')) return;
      var r = el.getBoundingClientRect();
      if (r.top < vh - 20) { el.classList.add('in'); io.unobserve(el); }
    });
  }
  requestAnimationFrame(function () { requestAnimationFrame(revealVisible); });
  window.addEventListener('load', revealVisible);
  setTimeout(revealVisible, 600);

  // Count-up for stats
  function countUp(el) {
    var raw = el.textContent.trim();
    var m = raw.match(/^(\d+)(.*)$/);
    if (!m) return;
    var end = parseInt(m[1], 10), suffix = m[2], t0 = null, dur = 1100;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var statIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { countUp(e.target); statIo.unobserve(e.target); }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.stat .n').forEach(function (el) { statIo.observe(el); });
})();

/* hero: video on desktop/landscape, static banner on mobile portrait */
(function () {
  var vid = document.getElementById('hero-video-el');
  if (!vid) return;
  var mq = window.matchMedia('(max-width:600px) and (orientation:portrait)');
  var loaded = false;
  function sync() {
    if (mq.matches) { vid.pause(); return; }
    if (!loaded) { vid.src = 'assets/Habitap_website_banner.mp4'; vid.load(); loaded = true; }
    vid.play().catch(function () {});
  }
  sync();
  mq.addEventListener('change', sync);
})();

/* mobile nav */
(function () {
  var burger = document.querySelector('.nav-burger'),
      panel = document.querySelector('.nav-panel');
  if (!burger || !panel) return;
  function set(open) {
    burger.classList.toggle('open', open);
    panel.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  burger.addEventListener('click', function () { set(!panel.classList.contains('open')); });
  panel.addEventListener('click', function (e) { if (e.target.tagName === 'A') set(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 640) set(false); });
})();

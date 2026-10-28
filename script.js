(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('.menu-toggle');
  const links = document.getElementById('nav-links');
  const navAnchors = [...links.querySelectorAll('a')];

  /* Mobile menu */
  const closeMenu = () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  };
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  navAnchors.forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', (e) => {
    if (!links.contains(e.target) && !toggle.contains(e.target)) closeMenu();
  });

  /* Theme toggle (dark by default, follows the system until the visitor chooses) */
  const themeBtn = document.querySelector('.theme-toggle');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)');
  const currentTheme = () => root.getAttribute('data-theme') || (prefersLight.matches ? 'light' : 'dark');
  const syncThemeLabel = () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    themeBtn.setAttribute('aria-label', `Switch to ${next} theme`);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', currentTheme() === 'dark' ? '#0a0b10' : '#f5f5f2');
  };
  themeBtn.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (_) { /* storage unavailable */ }
    syncThemeLabel();
  });
  prefersLight.addEventListener?.('change', syncThemeLabel);
  syncThemeLabel();

  /* Active section in the nav */
  const sections = navAnchors.map((a) => document.querySelector(a.getAttribute('href')));
  const onScroll = () => {
    const y = window.scrollY + window.innerHeight * 0.35;
    let active = -1;
    sections.forEach((s, i) => { if (s && s.offsetTop <= y) active = i; });
    navAnchors.forEach((a, i) => a.classList.toggle('active', i === active));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Reveal cards once as they enter the viewport */
  const revealEls = [...document.querySelectorAll('.reveal')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduceMotion) {
    root.classList.add('js');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => {
      // Anything already on screen at load shows immediately
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in');
      else io.observe(el);
    });
    // Safety net: never leave content hidden (e.g. jump links, print, odd browsers)
    window.addEventListener('hashchange', () => revealEls.forEach((el) => el.classList.add('in')));
    window.addEventListener('beforeprint', () => revealEls.forEach((el) => el.classList.add('in')));
  }

  /* Cursor spotlight on cards */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  /* Copy buttons */
  document.querySelectorAll('.copy').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
      } catch (_) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (_) { /* ignore */ }
        ta.remove();
      }
      btn.textContent = 'Copied';
      btn.classList.add('done');
      setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('done'); }, 1600);
    });
  });

  /* Footer year */
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();

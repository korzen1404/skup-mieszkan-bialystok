// Skup Mieszkań Białystok — interactions

// Sticky header
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// Hamburger
const ham = document.querySelector('.hamburger');
const mob = document.querySelector('.mobile-menu');
if (ham && mob) {
  ham.addEventListener('click', () => {
    const open = mob.classList.toggle('open');
    ham.setAttribute('aria-expanded', open);
    ham.querySelectorAll('span').forEach((s, i) => {
      if (open) {
        if (i === 0) s.style.transform = 'translateY(7px) rotate(45deg)';
        if (i === 1) s.style.opacity = '0';
        if (i === 2) s.style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        s.style.transform = '';
        s.style.opacity = '';
      }
    });
  });
  // Close mobile menu on link click
  mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mob.classList.remove('open');
    ham.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }));
}

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  if (!q || !a) return;
  q.addEventListener('click', () => {
    const isOpen = item.classList.toggle('open');
    a.style.maxHeight = isOpen ? a.scrollHeight + 'px' : '0';
    q.setAttribute('aria-expanded', isOpen);
  });
});

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '-10% 0px -5% 0px', threshold: 0.05 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// Cookie consent + GA4 conditional loader
(function() {
  const STORAGE_KEY = 'cookie-consent';
  const GA_ID = window.GA_MEASUREMENT_ID || null; // Wstawimy ID w Fazie 10

  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');

  function read() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (_) { return null; }
  }
  function write(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (_) {}
  }
  function show() { if (banner) banner.classList.add('show'); }
  function hide() { if (banner) banner.classList.remove('show'); }

  function loadAnalytics() {
    if (!GA_ID || window.__gaLoaded) return;
    window.__gaLoaded = true;
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
    setupEventTracking();
  }

  function setupEventTracking() {
    // Form submissions
    const wycenaForm = document.querySelector('#formularz form');
    if (wycenaForm) wycenaForm.addEventListener('submit', () => {
      if (window.gtag) window.gtag('event', 'form_submit_wycena', { event_category: 'lead', event_label: 'wycena' });
    });
    const kontaktForm = document.querySelector('#kontakt form');
    if (kontaktForm) kontaktForm.addEventListener('submit', () => {
      if (window.gtag) window.gtag('event', 'form_submit_kontakt', { event_category: 'lead', event_label: 'kontakt' });
    });
    // Phone clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(a => {
      a.addEventListener('click', () => {
        if (window.gtag) window.gtag('event', 'phone_click', { event_category: 'lead', event_label: a.getAttribute('href') });
      });
    });
    // CTA clicks (anchor links to #formularz)
    document.querySelectorAll('a[href*="#formularz"]').forEach(a => {
      a.addEventListener('click', () => {
        if (window.gtag) window.gtag('event', 'cta_click', { event_category: 'engagement', event_label: a.textContent.trim().slice(0, 40) });
      });
    });
  }

  function accept() { write('accepted'); hide(); loadAnalytics(); }
  function reject() { write('rejected'); hide(); }

  if (acceptBtn) acceptBtn.addEventListener('click', accept);
  if (rejectBtn) rejectBtn.addEventListener('click', reject);

  // Public reset (link "Zmień ustawienia cookies")
  window.cookieConsent = {
    reset: function() {
      try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
      show();
    },
    accept: accept,
    reject: reject,
    state: read
  };

  // Init
  const current = read();
  if (current === 'accepted') {
    loadAnalytics();
  } else if (current !== 'rejected') {
    // Pokaż banner po krótkim opóźnieniu (lepsza UX, nie blokuje pierwszego paint)
    setTimeout(show, 600);
  }
})();

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

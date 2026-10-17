(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const year = document.querySelector('#year');
  const newcomerForm = document.querySelector('#newcomer-form');
  if (year) year.textContent = new Date().getFullYear();
  const heroCarousel = document.querySelector('[data-hero-carousel]');
  if (heroCarousel) {
    const hero = heroCarousel.closest('.home-hero');
    const slides = Array.from(heroCarousel.querySelectorAll('.hero-slide'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const previous = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    const togglePlayback = hero.querySelector('[data-hero-toggle]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let activeIndex = 0;
    let manuallyPaused = reducedMotion.matches;
    let pointerInside = false;
    let focusInside = false;
    let timer = null;

    const stopTimer = () => {
      if (timer !== null) window.clearInterval(timer);
      timer = null;
    };
    const syncTimer = () => {
      stopTimer();
      if (!manuallyPaused && !pointerInside && !focusInside && !document.hidden) {
        timer = window.setInterval(() => showSlide(activeIndex + 1), 7000);
      }
    };
    const showSlide = index => {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === activeIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
      });
      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === activeIndex;
        dot.classList.toggle('is-active', isActive);
        if (isActive) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
      syncTimer();
    };
    const setPaused = paused => {
      manuallyPaused = paused;
      togglePlayback.dataset.paused = String(paused);
      togglePlayback.setAttribute('aria-label', paused ? 'Resume slideshow' : 'Pause slideshow');
      syncTimer();
    };

    previous.addEventListener('click', () => showSlide(activeIndex - 1));
    next.addEventListener('click', () => showSlide(activeIndex + 1));
    dots.forEach((dot, dotIndex) => dot.addEventListener('click', () => showSlide(dotIndex)));
    togglePlayback.addEventListener('click', () => {
      focusInside = false;
      setPaused(!manuallyPaused);
    });
    hero.addEventListener('pointerenter', () => { pointerInside = true; syncTimer(); });
    hero.addEventListener('pointerleave', () => { pointerInside = false; syncTimer(); });
    hero.addEventListener('focusin', () => { focusInside = true; syncTimer(); });
    hero.addEventListener('focusout', () => window.setTimeout(() => {
      focusInside = hero.contains(document.activeElement);
      syncTimer();
    }, 0));
    document.addEventListener('visibilitychange', syncTimer);
    reducedMotion.addEventListener('change', event => {
      if (event.matches) setPaused(true);
    });
    setPaused(manuallyPaused);
  }
  if (newcomerForm) {
    newcomerForm.addEventListener('submit', event => {
      event.preventDefault();
      const status = document.querySelector('#newcomer-form-status');
      const recipient = newcomerForm.dataset.recipient.trim();
      if (!recipient) {
        status.textContent = 'The form inbox is not connected yet. Please call (617) 817-9153 and we’ll be glad to help.';
        return;
      }
      const fields = new FormData(newcomerForm);
      const subject = `New visitor: ${fields.get('name')}`;
      const body = [
        `Name: ${fields.get('name')}`,
        `Email: ${fields.get('email')}`,
        `Phone: ${fields.get('phone') || 'Not provided'}`,
        `Visit timing: ${fields.get('visit-time')}`,
        `Message: ${fields.get('message') || 'None'}`
      ].join('\n');
      window.location.href = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = 'Your email app should open with your visit details ready to send.';
    });
  }
  if (!toggle || !nav) return;
  const closeMenu = () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = 'Menu';
  };
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
})();

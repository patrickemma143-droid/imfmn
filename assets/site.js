(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const year = document.querySelector('#year');
  const newcomerForm = document.querySelector('#newcomer-form');
  if (year) year.textContent = new Date().getFullYear();
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

export function initForm() {
  const contactForm = document.getElementById('contactForm');

  function showError(input, msg) {
    const error = document.createElement('span');
    error.className = 'form-error';
    error.textContent = msg;
    input.parentElement.appendChild(error);
    input.style.borderColor = 'var(--accent-warm)';
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', error.id = 'err-' + input.id);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameEl = document.getElementById('contactName');
      const emailEl = document.getElementById('contactEmail');
      const messageEl = document.getElementById('contactMessage');
      let valid = true;

      contactForm.querySelectorAll('.form-error').forEach(function (el) { el.remove(); });

      [nameEl, emailEl, messageEl].forEach(function (input) {
        if (!input) return;
        input.style.borderColor = '';
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
      });

      if (nameEl && !nameEl.value.trim()) {
        showError(nameEl, 'Name is required');
        valid = false;
      }

      if (emailEl) {
        if (!emailEl.value.trim()) {
          showError(emailEl, 'Email is required');
          valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
          showError(emailEl, 'Please enter a valid email');
          valid = false;
        }
      }

      if (messageEl && !messageEl.value.trim()) {
        showError(messageEl, 'Message is required');
        valid = false;
      }

      if (valid) {
        const subject = encodeURIComponent('Portfolio Contact from ' + nameEl.value.trim());
        const body = encodeURIComponent(
          'Name: ' + nameEl.value.trim() +
          '\nEmail: ' + emailEl.value.trim() +
          '\n\nMessage:\n' + messageEl.value.trim()
        );
        const link = document.createElement('a');
        link.href = 'mailto:dhnugroho@gmail.com?subject=' + subject + '&body=' + body;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        const btn = contactForm.querySelector('.btn-submit');
        if (btn) {
          const originalText = btn.textContent;
          btn.textContent = '✓ Opening mail client...';
          btn.disabled = true;
          btn.style.background = 'var(--accent-warm)';
          setTimeout(function () {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
          }, 3000);
        }
      } else {
        const firstError = contactForm.querySelector('[aria-invalid="true"]');
        if (firstError) firstError.focus();
      }
    });
  }
}

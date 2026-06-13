export function initModal() {
  const modalBackdrop = document.getElementById('portfolioModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTags = document.getElementById('modalTags');
  const modalClose = document.getElementById('modalClose');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])';
  let previouslyFocused = null;

  function renderTags(tagsString) {
    if (!modalTags) return;
    while (modalTags.firstChild) {
      modalTags.removeChild(modalTags.firstChild);
    }
    if (!tagsString) return;
    tagsString.split(',').forEach(function (tag) {
      const span = document.createElement('span');
      span.textContent = tag.trim();
      modalTags.appendChild(span);
    });
  }

  function openModal(card) {
    if (!modalBackdrop) return;

    const img = card.dataset.image || '';
    const title = card.dataset.title || '';
    const desc = card.dataset.description || '';
    const tags = card.dataset.tags || '';

    if (modalImage) {
      modalImage.src = img;
      modalImage.alt = title;
    }
    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = desc;
    renderTags(tags);

    previouslyFocused = document.activeElement;
    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (modalClose) {
      setTimeout(function () { modalClose.focus(); }, 50);
    }
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';

    if (previouslyFocused) {
      previouslyFocused.focus();
      previouslyFocused = null;
    }
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      const focusable = Array.from(modalBackdrop.querySelectorAll(FOCUSABLE));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  portfolioCards.forEach(function (card) {
    card.addEventListener('click', function () { openModal(card); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', function (e) {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });
}

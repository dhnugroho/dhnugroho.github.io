export function initModal() {
  const modalBackdrop = document.getElementById('portfolioModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTags = document.getElementById('modalTags');
  const modalClose = document.getElementById('modalClose');
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  const modalContent = modalBackdrop ? modalBackdrop.querySelector('.modal-content') : null;

  const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])';
  let previouslyFocused = null;

  // Touch swipe-to-dismiss state
  let touchStartY = 0;
  let touchCurrentY = 0;
  let isDragging = false;
  const DISMISS_THRESHOLD = 0.25; // 25% of modal height

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

    // Reset any drag transform
    if (modalContent) {
      modalContent.style.transform = '';
      modalContent.style.transition = '';
    }

    if (modalClose) {
      setTimeout(function () { modalClose.focus(); }, 50);
    }
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';

    // Reset drag state
    if (modalContent) {
      modalContent.style.transform = '';
      modalContent.style.transition = '';
    }

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

  // ---- Touch swipe-to-dismiss for mobile bottom sheet ----
  if (modalContent) {
    modalContent.addEventListener('touchstart', function (e) {
      // Only start drag when the modal is scrolled to the top
      if (modalContent.scrollTop > 5) return;
      touchStartY = e.touches[0].clientY;
      touchCurrentY = touchStartY;
      isDragging = true;
      modalContent.style.transition = 'none';
    }, { passive: true });

    modalContent.addEventListener('touchmove', function (e) {
      if (!isDragging) return;
      touchCurrentY = e.touches[0].clientY;
      const delta = touchCurrentY - touchStartY;

      // Only allow dragging downward
      if (delta > 0) {
        modalContent.style.transform = 'translateY(' + delta + 'px)';
        // Fade backdrop as user drags
        const progress = Math.min(delta / (window.innerHeight * 0.4), 1);
        modalBackdrop.style.background = 'rgba(10, 14, 23, ' + (0.92 * (1 - progress * 0.5)) + ')';
      }
    }, { passive: true });

    modalContent.addEventListener('touchend', function () {
      if (!isDragging) return;
      isDragging = false;
      const delta = touchCurrentY - touchStartY;
      const modalHeight = modalContent.offsetHeight;

      modalContent.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
      modalBackdrop.style.background = '';

      if (delta > modalHeight * DISMISS_THRESHOLD) {
        // Dismiss: animate off-screen then close
        modalContent.style.transform = 'translateY(100%)';
        setTimeout(closeModal, 350);
      } else {
        // Snap back
        modalContent.style.transform = '';
      }
    }, { passive: true });
  }
}

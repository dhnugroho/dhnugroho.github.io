export function initNavbar() {
  const navbar = document.getElementById('mainNav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  let isTicking = false;

  function renderNavbar() {
    if (!navbar) return;

    const scrollY = window.scrollY;

    // Scrolled navbar styling
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // When near top (hero header), remove active state from section links
    if (scrollY <= 80) {
      navLinks.forEach(function (link) {
        link.classList.remove('active');
      });
      return;
    }

    const navHeight = navbar.offsetHeight || 70;
    // Activation line offset below navbar
    const threshold = navHeight + 80;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const atBottom = scrollY + winHeight >= docHeight - 40;

    let currentSection = '';

    if (atBottom) {
      // Pick the last visible section on the page
      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec.offsetParent !== null) {
          currentSection = sec.getAttribute('id');
          break;
        }
      }
    } else {
      // Find the active section based on current viewport bounding rects
      sections.forEach(function (section) {
        if (section.offsetParent !== null) {
          const rect = section.getBoundingClientRect();
          // If section top is above the threshold, this section is current/scrolled-past
          if (rect.top <= threshold) {
            currentSection = section.getAttribute('id');
          }
        }
      });
    }

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      const isActive = currentSection && href === '#' + currentSection;
      link.classList.toggle('active', !!isActive);
    });
  }

  function updateNavbar() {
    if (!isTicking) {
      requestAnimationFrame(function () {
        renderNavbar();
        isTicking = false;
      });
      isTicking = true;
    }
  }

  window.addEventListener('resize', updateNavbar, { passive: true });
  window.addEventListener('scroll', updateNavbar, { passive: true });

  // Initial render
  renderNavbar();

  // Mobile navigation drawer toggle
  const navToggle = document.getElementById('navToggle');
  const navLinksContainer = document.getElementById('navLinks');

  if (navToggle && navLinksContainer) {
    function closeNav() {
      navToggle.classList.remove('open');
      navLinksContainer.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (navbar) navbar.classList.remove('nav-open');
    }

    navToggle.addEventListener('click', function () {
      const isOpen = navLinksContainer.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (navbar) navbar.classList.toggle('nav-open', isOpen);
    });

    navLinksContainer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    // Close nav when tapping the backdrop overlay
    if (navbar) {
      navbar.addEventListener('click', function (e) {
        if (e.target === navbar && navLinksContainer.classList.contains('open')) {
          closeNav();
        }
      });
    }
  }

  // SMOOTH SCROLL FOR ANCHOR LINKS
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const top = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
}

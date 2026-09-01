export function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIconDark  = document.getElementById('themeIconDark');
  const themeIconLight = document.getElementById('themeIconLight');

  // ── All available color theme variants ────────────────────────────────────
  const THEME_VARIANTS = ['default', 'green', 'cocoa', 'mocha', 'truffle'];
  const THEME_CLASSES  = ['green-theme', 'cocoa-theme', 'mocha-theme', 'truffle-theme'];

  // ── Light / Dark preference (persisted) ──────────────────────────────────
  const savedTheme        = localStorage.getItem('theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
    document.body.classList.add('light-mode');
    if (themeIconDark)  themeIconDark.style.display  = 'none';
    if (themeIconLight) themeIconLight.style.display = 'block';
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) metaThemeColor.setAttribute('content', '#ffffff');
  }
  // Clean up the early-init class now that body.light-mode is authoritative
  document.documentElement.classList.remove('light-mode-pending');

  // ── Color theme variant (cycles through all 5 on each refresh) ───────────
  try {
    let currentVariant = sessionStorage.getItem('colorThemeVariant');
    if (!currentVariant || !THEME_VARIANTS.includes(currentVariant)) {
      currentVariant = THEME_VARIANTS[0];
      sessionStorage.setItem('colorThemeVariant', currentVariant);
    }

    // Remove all theme classes first
    document.body.classList.remove(...THEME_CLASSES);

    // Apply the active theme class (if not 'default')
    if (currentVariant !== 'default') {
      document.body.classList.add(currentVariant + '-theme');
    }
  } catch (_) {
    // Fallback: just remove all theme classes
    document.body.classList.remove(...THEME_CLASSES);
  }

  // Clean up all pending theme classes
  THEME_CLASSES.forEach(cls => {
    document.documentElement.classList.remove(cls.replace('-theme', '-theme-pending'));
  });
  document.documentElement.classList.remove('green-theme-pending');

  // ── Theme toggle button ───────────────────────────────────────────────────
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      const isLight = document.body.classList.toggle('light-mode');

      if (isLight) {
        localStorage.setItem('theme', 'light');
        if (themeIconDark)  themeIconDark.style.display  = 'none';
        if (themeIconLight) themeIconLight.style.display = 'block';
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) metaThemeColor.setAttribute('content', '#ffffff');
      } else {
        localStorage.setItem('theme', 'dark');
        if (themeIconDark)  themeIconDark.style.display  = 'block';
        if (themeIconLight) themeIconLight.style.display = 'none';
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) metaThemeColor.setAttribute('content', '#0a0e17');
      }
    });
  }
}

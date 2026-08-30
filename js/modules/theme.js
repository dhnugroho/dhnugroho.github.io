export function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIconDark  = document.getElementById('themeIconDark');
  const themeIconLight = document.getElementById('themeIconLight');

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

  // ── Green alternate theme (strictly alternates on every refresh) ──────────
  try {
    let currentVariant = sessionStorage.getItem('colorThemeVariant');
    if (!currentVariant) {
      currentVariant = 'green';
      sessionStorage.setItem('colorThemeVariant', currentVariant);
    }
    if (currentVariant === 'green') {
      document.body.classList.add('green-theme');
    } else {
      document.body.classList.remove('green-theme');
    }
  } catch (_) {
    document.body.classList.toggle('green-theme');
  }
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

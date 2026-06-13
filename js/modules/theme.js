export function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIconDark = document.getElementById('themeIconDark');
  const themeIconLight = document.getElementById('themeIconLight');

  const savedTheme = localStorage.getItem('theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
    document.body.classList.add('light-mode');
    if (themeIconDark) themeIconDark.style.display = 'none';
    if (themeIconLight) themeIconLight.style.display = 'block';
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) metaThemeColor.setAttribute('content', '#ffffff');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      const isLight = document.body.classList.toggle('light-mode');
      
      if (isLight) {
        localStorage.setItem('theme', 'light');
        if (themeIconDark) themeIconDark.style.display = 'none';
        if (themeIconLight) themeIconLight.style.display = 'block';
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) metaThemeColor.setAttribute('content', '#ffffff');
      } else {
        localStorage.setItem('theme', 'dark');
        if (themeIconDark) themeIconDark.style.display = 'block';
        if (themeIconLight) themeIconLight.style.display = 'none';
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) metaThemeColor.setAttribute('content', '#0a0e17');
      }
    });
  }
}

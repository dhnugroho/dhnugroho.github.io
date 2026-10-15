/**
 * Design Thinking & Agile Note — Tab Switcher
 * Toggles the Design Thinking / Agile comparison panels.
 */

export function initNoteDtAgileTabs() {
  var wrap = document.getElementById('dtAgileCompare');
  if (!wrap) return;
  var tabs = wrap.querySelectorAll('.dt-tab');
  var panels = wrap.querySelectorAll('.dt-panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = this.getAttribute('data-panel');

      tabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');

      panels.forEach(function (p) {
        p.style.display = 'none';
      });
      var targetPanel = document.getElementById('panel-' + target);
      if (targetPanel) {
        targetPanel.style.display = '';
      }
    });
  });
}

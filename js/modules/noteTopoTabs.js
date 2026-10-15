/**
 * Topology Note — Tab Switcher
 * Toggles the topology comparison panels.
 */

export function initNoteTopoTabs() {
  var wrap = document.getElementById('topoNotesWrap');
  if (!wrap) return;
  var tabs = wrap.querySelectorAll('.topo-tab');
  var panels = wrap.querySelectorAll('.topo-panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var theme = this.getAttribute('data-theme');

      tabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');

      panels.forEach(function (p) {
        p.style.display = 'none';
      });
      var target = document.getElementById('panel-' + theme);
      if (target) {
        target.style.display = 'flex';
      }
    });
  });
}

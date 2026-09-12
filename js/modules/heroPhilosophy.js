/* ==========================================================================
   HERO PHILOSOPHY MODULE — Architecture Topology Explanations (Minimalist)
   Interactive explanations appearing from the hero profile avatar about each
   theme change having its own technical data engineering topology philosophy.
   ========================================================================== */

export const TOPOLOGIES = {
  default: {
    id: 'default',
    themeName: 'Stellar',
    emoji: '⚡',
    title: 'Distributed Cloud Mesh',
    philosophy: 'Full-width cross-region fiber trunks with 45° dogleg bypasses, dual cyan/violet sync packets, and <code>CLOUD::BACKBONE</code> telemetry.',
    telemetry: 'CLOUD::BACKBONE · 45° Dogleg Trunks',
    color: '#00e5ff'
  },
  green: {
    id: 'green',
    themeName: 'Void Mint',
    emoji: '🌿',
    title: 'ETL Data Pipeline (DAG)',
    philosophy: 'Directed Acyclic Graph cascading stages, extraction drops, merge gates, and emerald batch transformation packets.',
    telemetry: 'ETL::DAG_EXECUTOR · Cascading Stages',
    color: '#00C896'
  },
  cocoa: {
    id: 'cocoa',
    themeName: 'Espresso',
    emoji: '☕',
    title: 'Data Warehouse Columnar Fabric',
    philosophy: 'Dense memory bus lines, partitioned columnar nodes, and rhythmic warm amber/caramel memory sweep packets.',
    telemetry: 'DW::COLUMNAR_FABRIC · Memory Sweep',
    color: '#D4915C'
  },
  mocha: {
    id: 'mocha',
    themeName: 'Mocha',
    emoji: '🍫',
    title: 'Event-Driven Message Broker',
    philosophy: 'Segmented pub/sub queue lanes, fan-out junction hubs, and alternating bidirectional event packets.',
    telemetry: 'MQ::BROKER_CLUSTER · Pub/Sub Lanes',
    color: '#C49B82'
  },
  truffle: {
    id: 'truffle',
    themeName: 'Truffle',
    emoji: '✨',
    title: 'Real-Time OLAP Compute Matrix',
    philosophy: 'Precision analytical cross-grid, diamond routing nodes, and crisp high-frequency golden micro-packets.',
    telemetry: 'OLAP::QUERY_ENGINE · Diamond Matrix',
    color: '#C8A96E'
  },
  maroon: {
    id: 'maroon',
    themeName: 'Crimson Ruby',
    emoji: '💎',
    title: 'Mission-Critical Transaction Fabric & Security Gateway',
    philosophy: 'Redundant dual-rail transactional conduits, encryption validation gates, and pulsating ruby-crimson ACID transaction tokens.',
    telemetry: 'GATEWAY::DUAL_RAIL · ACID Tokens',
    color: '#800000'
  }
};

export function initHeroPhilosophy() {
  const avatarWrap = document.getElementById('heroAvatarWrap');
  const bubble = document.getElementById('heroTopologyBubble');
  if (!avatarWrap || !bubble) return;

  const themeIcon = document.getElementById('bubbleThemeIcon');
  const themeName = document.getElementById('bubbleThemeName');
  const paradigmTitle = document.getElementById('bubbleParadigmTitle');
  const philosophyText = document.getElementById('bubblePhilosophyText');
  const telemetryVal = document.getElementById('bubbleTelemetryVal');
  const timerBar = document.getElementById('bubbleTimerBar');
  const closeBtn = document.getElementById('bubbleCloseBtn');

  let currentThemeId = 'default';
  let isVisible = false;
  let timerAnimationId = null;
  let startTime = null;
  const DISPLAY_DURATION = 8500; // 8.5 seconds display
  let isPaused = false;
  let remainingTime = DISPLAY_DURATION;

  function detectCurrentTheme() {
    const cl = document.body.classList;
    if (cl.contains('maroon-theme')) return 'maroon';
    if (cl.contains('green-theme')) return 'green';
    if (cl.contains('cocoa-theme')) return 'cocoa';
    if (cl.contains('mocha-theme')) return 'mocha';
    if (cl.contains('truffle-theme')) return 'truffle';
    return 'default';
  }

  function updateCardContent(themeId) {
    const data = TOPOLOGIES[themeId] || TOPOLOGIES.default;
    currentThemeId = themeId;

    if (themeIcon) themeIcon.textContent = data.emoji;
    if (themeName) themeName.textContent = data.themeName;
    if (paradigmTitle) paradigmTitle.textContent = data.title;
    if (philosophyText) philosophyText.innerHTML = data.philosophy;
    if (telemetryVal) telemetryVal.textContent = data.telemetry;

    avatarWrap.setAttribute('aria-label', `Active Topology: ${data.title} (${data.themeName}). Click to toggle details.`);
    avatarWrap.setAttribute('title', `Active Topology: ${data.title} (${data.themeName})`);
  }

  function startTimer(duration) {
    cancelTimer();
    remainingTime = duration;
    startTime = performance.now();

    function tick(now) {
      if (isPaused) {
        startTime = now - (DISPLAY_DURATION - remainingTime);
        timerAnimationId = requestAnimationFrame(tick);
        return;
      }

      const elapsed = now - startTime;
      remainingTime = Math.max(0, DISPLAY_DURATION - elapsed);
      const ratio = remainingTime / DISPLAY_DURATION;

      if (timerBar) {
        timerBar.style.transform = `scaleX(${ratio})`;
      }

      if (remainingTime <= 0) {
        hideBubble();
      } else {
        timerAnimationId = requestAnimationFrame(tick);
      }
    }

    timerAnimationId = requestAnimationFrame(tick);
  }

  function cancelTimer() {
    if (timerAnimationId) {
      cancelAnimationFrame(timerAnimationId);
      timerAnimationId = null;
    }
    if (timerBar) {
      timerBar.style.transform = 'scaleX(1)';
    }
  }

  function showBubble(autoDismiss = true) {
    isVisible = true;
    bubble.classList.add('visible');
    bubble.setAttribute('aria-hidden', 'false');
    avatarWrap.classList.add('active');
    avatarWrap.setAttribute('aria-expanded', 'true');

    if (autoDismiss) {
      startTimer(DISPLAY_DURATION);
    } else {
      cancelTimer();
      if (timerBar) timerBar.style.transform = 'scaleX(0)';
    }
  }

  function hideBubble() {
    isVisible = false;
    bubble.classList.remove('visible');
    bubble.setAttribute('aria-hidden', 'true');
    avatarWrap.classList.remove('active');
    avatarWrap.setAttribute('aria-expanded', 'false');
    cancelTimer();
  }

  function toggleBubble() {
    if (isVisible) {
      hideBubble();
    } else {
      updateCardContent(detectCurrentTheme());
      showBubble(false);
    }
  }

  // ── Hover Pause/Resume ──────────────────────────────────────────────────
  function pauseTimer() {
    isPaused = true;
  }

  function resumeTimer() {
    isPaused = false;
  }

  bubble.addEventListener('mouseenter', pauseTimer);
  bubble.addEventListener('mouseleave', resumeTimer);
  avatarWrap.addEventListener('mouseenter', pauseTimer);
  avatarWrap.addEventListener('mouseleave', resumeTimer);

  // ── User Interaction Triggers ───────────────────────────────────────────
  avatarWrap.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleBubble();
  });

  avatarWrap.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleBubble();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hideBubble();
    });
  }

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isVisible) {
      hideBubble();
    }
  });

  // ── React to Theme Changes ──────────────────────────────────────────────
  let initialTheme = detectCurrentTheme();
  updateCardContent(initialTheme);

  window.addEventListener('themechange', (e) => {
    const nextThemeId = (e.detail && e.detail.themeId) || detectCurrentTheme();
    updateCardContent(nextThemeId);
    showBubble(true);
  });

  // MutationObserver for fallback body class changes
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.attributeName === 'class') {
        const tId = detectCurrentTheme();
        if (tId !== currentThemeId) {
          updateCardContent(tId);
          showBubble(true);
        }
        break;
      }
    }
  });
  observer.observe(document.body, { attributes: true });
}

/**
 * Note 9 — ECG Monitor
 * Animated background, ECG trace and flatline canvases with a live clock.
 */

export function initNoteEcgMonitor() {
  var bgC = document.getElementById('n9tBgCanvas');
  var mainC = document.getElementById('n9tEcgCanvas');
  var flC = document.getElementById('n9tFlatlineCanvas');
  if (!bgC || !mainC || !flC) return;

  var bgX = bgC.getContext('2d');
  var mainX = mainC.getContext('2d');
  var flX = flC.getContext('2d');

  var t = 0;
  var tickCount = 0;
  var flatlineProgress = 0;

  var mainBuf = [];
  var mainPx = 0;
  var flBuf = [];
  var flPx = 0;

  var monDot = document.getElementById('n9tMonDot');
  var monLabel = document.getElementById('n9tMonLabel');
  var statusLbl = document.getElementById('n9tEcgStatusLbl');
  var bpmLive = document.getElementById('n9tBpmLive');
  var sysStatus = document.getElementById('n9tSysStatus');
  var sigStatus = document.getElementById('n9tSigStatus');
  var monTime = document.getElementById('n9tMonTime');

  function sz(c, h) {
    var w = Math.floor(c.parentElement.getBoundingClientRect().width) || 600;
    if (c.width !== w) c.width = w;
    if (h && c.height !== h) c.height = h;
    return w;
  }

  function isLightMode() {
    return document.body.classList.contains('light-mode') ||
      document.documentElement.classList.contains('light-mode-pending');
  }

  function ecg(phase, bpm, amp) {
    if (bpm === 0) return (Math.random() - 0.5) * 0.005;
    var p = (phase * (bpm / 60)) % 1;
    var v = 0;
    if (p < 0.05) v = 0.1 * Math.sin(Math.PI * p / 0.05);
    else if (p < 0.09) v = 0;
    else if (p < 0.12) { var r = (p - 0.09) / 0.03; v = r < 0.5 ? r * 2 : 2 - r * 2; }
    else if (p < 0.15) { var r = (p - 0.12) / 0.03; v = -(r < 0.5 ? r * 2 : 2 - r * 2) * 0.55; }
    else if (p < 0.18) { var r = (p - 0.15) / 0.03; v = (r < 0.5 ? r * 2 : 2 - r * 2) * 0.18; }
    else if (p < 0.28) v = 0;
    else if (p < 0.48) { var r = (p - 0.28) / 0.2; v = 0.2 * Math.sin(Math.PI * r); }
    return v * amp + (Math.random() - 0.5) * 0.015;
  }

  function drawBg() {
    var w = sz(bgC);
    var h = bgC.parentElement.offsetHeight || 500;
    if (bgC.height !== h) bgC.height = h;
    bgX.clearRect(0, 0, w, h);
    // Gentle ambient grid behind card
    var light = isLightMode();
    bgX.strokeStyle = light ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.025)';
    bgX.lineWidth = 1;
    var step = 36;
    for (var x = 0; x < w; x += step) {
      bgX.beginPath(); bgX.moveTo(x, 0); bgX.lineTo(x, h); bgX.stroke();
    }
    for (var y = 0; y < h; y += step) {
      bgX.beginPath(); bgX.moveTo(0, y); bgX.lineTo(w, y); bgX.stroke();
    }
  }

  function drawMain() {
    var h = (mainC.parentElement && mainC.parentElement.clientHeight) || 80;
    var w = sz(mainC, h);
    var mid = h * 0.5, amp = h * 0.36;
    var bpm = flatlineProgress > 0.85 ? 0 : 72;
    var pt = ecg(t, bpm, 1);
    mainBuf.push({ x: mainPx, y: pt, flat: flatlineProgress > 0.85 });
    mainPx++;

    var maxVis = Math.floor(w * 0.95);
    if (mainPx > w * 2) mainBuf = mainBuf.filter(function (p) { return p.x > mainPx - maxVis; });
    var vis = mainBuf.filter(function (p) { return p.x > mainPx - maxVis; });

    mainX.clearRect(0, 0, w, h);

    var light = isLightMode();
    var alive = flatlineProgress < 0.85;

    // Medical grid
    mainX.strokeStyle = light ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.06)';
    mainX.lineWidth = 1;
    for (var gx = 0; gx < w; gx += 24) {
      mainX.beginPath(); mainX.moveTo(gx, 0); mainX.lineTo(gx, h); mainX.stroke();
    }
    for (var gy = 0; gy < h; gy += 16) {
      mainX.beginPath(); mainX.moveTo(0, gy); mainX.lineTo(w, gy); mainX.stroke();
    }

    if (vis.length < 2) return;
    var ox = w - (mainPx - vis[0].x);

    // Interactive trace: cyan/teal when active, rose when asystole
    var traceColor = alive ? (light ? '#0284c7' : '#2dd4bf') : '#fb7185';

    // Ambient glow
    mainX.beginPath();
    vis.forEach(function (p, i) {
      var px = ox + (p.x - vis[0].x);
      var py = mid - p.y * amp;
      if (i === 0) mainX.moveTo(px, py);
      else mainX.lineTo(px, py);
    });
    mainX.strokeStyle = traceColor;
    mainX.globalAlpha = light ? 0.25 : 0.4;
    mainX.lineWidth = 4;
    mainX.stroke();
    mainX.globalAlpha = 1.0;

    // Crisp signal line
    mainX.beginPath();
    vis.forEach(function (p, i) {
      var px = ox + (p.x - vis[0].x);
      var py = mid - p.y * amp;
      if (i === 0) mainX.moveTo(px, py);
      else mainX.lineTo(px, py);
    });
    mainX.strokeStyle = traceColor;
    mainX.lineWidth = 2.2;
    mainX.stroke();

    // Leading trace head
    var last = vis[vis.length - 1];
    var lx = ox + (last.x - vis[0].x);
    var ly = mid - last.y * amp;
    mainX.beginPath();
    mainX.arc(lx, ly, 3.5, 0, Math.PI * 2);
    mainX.fillStyle = '#ffffff';
    mainX.shadowColor = traceColor;
    mainX.shadowBlur = 8;
    mainX.fill();
    mainX.shadowBlur = 0;
  }

  function drawFlatline() {
    var w = sz(flC, 36);
    var h = 36, mid = h * 0.5;
    var pt = (Math.random() - 0.5) * 0.02;
    flBuf.push({ x: flPx, y: pt });
    flPx++;

    if (flPx > w * 2) flBuf = flBuf.filter(function (p) { return p.x > flPx - w; });
    var vis = flBuf.filter(function (p) { return p.x > flPx - w; });

    flX.clearRect(0, 0, w, h);
    if (vis.length < 2) return;
    var ox = w - (flPx - vis[0].x);

    flX.beginPath();
    vis.forEach(function (p, i) {
      var px = ox + (p.x - vis[0].x), py = mid - p.y * h * 0.3;
      if (i === 0) flX.moveTo(px, py);
      else flX.lineTo(px, py);
    });
    flX.strokeStyle = '#fb7185';
    flX.lineWidth = 1.6;
    flX.stroke();
  }

  function updateClock() {
    var now = new Date();
    var pad = function (n) { return String(n).padStart(2, '0'); };
    if (monTime) monTime.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds()) + ' WIB';
  }

  function updateStatus() {
    var alive = flatlineProgress < 0.85;
    var light = isLightMode();
    var traceColor = alive ? (light ? '#0284c7' : '#2dd4bf') : '#fb7185';

    if (monDot) monDot.className = 'n9t-mon-dot' + (alive ? '' : ' dead');
    if (statusLbl) {
      statusLbl.textContent = alive ? 'continuous improvement active' : 'ASYSTOLE DETECTED · ITERATION HALTED';
      statusLbl.style.color = traceColor;
    }
    if (bpmLive) {
      bpmLive.textContent = alive ? '72 BPM' : '0 BPM';
      bpmLive.style.color = traceColor;
    }
    if (sysStatus) {
      sysStatus.textContent = alive ? 'ACTIVE' : 'HALTED';
      sysStatus.className = 'n9t-sg-val ' + (alive ? 'green' : 'red');
    }
    if (sigStatus) {
      sigStatus.textContent = alive ? 'CONTINUOUS' : 'ASYSTOLE';
      sigStatus.className = 'n9t-sg-val ' + (alive ? 'green' : 'red');
    }
  }

  function animTick() {
    t += 0.014;
    tickCount++;

    if (tickCount > 280 && tickCount < 600) {
      flatlineProgress = Math.min(1, (tickCount - 280) / 40);
    } else if (tickCount >= 600) {
      flatlineProgress = Math.max(0, flatlineProgress - 0.04);
      if (tickCount > 720) tickCount = 0;
    } else {
      flatlineProgress = 0;
    }

    updateStatus();
    drawBg();
    drawMain();
    drawFlatline();
    if (tickCount % 60 === 0) updateClock();
    requestAnimationFrame(animTick);
  }

  updateClock();
  animTick();
}

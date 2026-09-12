/* ==========================================================================
   HERO BACKGROUND — Multi-Paradigm Enterprise Architecture Grid
   Replaces generic AI-slop particles with 6 bespoke, theme-specific
   system architecture pipeline topologies:
     • Stellar ⚡    → Distributed Cloud Backbone Mesh
     • Void Mint 🌿  → ETL Pipeline & Directed Acyclic Graph (DAG)
     • Espresso ☕   → Data Warehouse Columnar Fabric & Storage Engine
     • Mocha 🍫     → Event-Driven Message Broker & Async Queues
     • Truffle ✨    → Real-Time OLAP Compute Matrix
     • Maroon 🍷    → Mission-Critical Transaction Fabric & Zero-Trust Gateway
   ========================================================================== */

export function initHeroBackground() {
  const canvas = document.getElementById('particleCanvas') || document.getElementById('heroBackgroundCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let animationId = null;
  let isVisible = true;
  let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let isMobile = window.innerWidth < 768;

  // ── Mouse & Interaction State ─────────────────────────────────────────────
  const mouse = {
    x: null,
    y: null,
    targetX: null,
    targetY: null,
    isHovering: false,
    radius: 180,
  };

  // ── Color Parser & Theme Lerping Engine ───────────────────────────────────
  function parseColorToRgb(str, fallback) {
    if (!str) return fallback;
    str = str.trim();

    // Handle Hex: #rgb, #rgba, #rrggbb, #rrggbbaa
    if (str.startsWith('#')) {
      let hex = str.slice(1);
      if (hex.length === 3 || hex.length === 4) {
        hex = hex.split('').map(c => c + c).join('');
      }
      const num = parseInt(hex.slice(0, 6), 16);
      if (isNaN(num)) return fallback;
      return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
      };
    }

    // Handle rgb(r, g, b) or rgba(r, g, b, a)
    const rgbMatch = str.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1], 10),
        g: parseInt(rgbMatch[2], 10),
        b: parseInt(rgbMatch[3], 10),
      };
    }

    return fallback;
  }

  // Active theme colors (lerped smoothly during transitions)
  const currentColors = {
    primary: { r: 0, g: 229, b: 255 },
    glow: { r: 124, g: 58, b: 237 },
    warm: { r: 255, g: 107, b: 55 },
    grid: { r: 148, g: 163, b: 184 },
    isLight: false,
  };

  const targetColors = {
    primary: { r: 0, g: 229, b: 255 },
    glow: { r: 124, g: 58, b: 237 },
    warm: { r: 255, g: 107, b: 55 },
    grid: { r: 148, g: 163, b: 184 },
    isLight: false,
  };

  function detectThemeId() {
    const cl = document.body.classList;
    if (cl.contains('maroon-theme')) return 'maroon';
    if (cl.contains('green-theme')) return 'green';
    if (cl.contains('cocoa-theme')) return 'cocoa';
    if (cl.contains('mocha-theme')) return 'mocha';
    if (cl.contains('truffle-theme')) return 'truffle';
    return 'default';
  }

  function updateThemeTargetColors() {
    const computed = window.getComputedStyle(document.body);
    const docComputed = window.getComputedStyle(document.documentElement);
    const isLight = document.body.classList.contains('light-mode');

    targetColors.isLight = isLight;
    targetColors.primary = parseColorToRgb(
      computed.getPropertyValue('--accent-primary') || docComputed.getPropertyValue('--accent-primary'),
      isLight ? { r: 2, g: 132, b: 199 } : { r: 0, g: 229, b: 255 }
    );
    targetColors.glow = parseColorToRgb(
      computed.getPropertyValue('--accent-glow') || docComputed.getPropertyValue('--accent-glow'),
      isLight ? { r: 126, g: 34, b: 206 } : { r: 124, g: 58, b: 237 }
    );
    targetColors.warm = parseColorToRgb(
      computed.getPropertyValue('--accent-warm') || docComputed.getPropertyValue('--accent-warm'),
      isLight ? { r: 234, g: 88, b: 12 } : { r: 255, g: 107, b: 55 }
    );
    targetColors.grid = isLight ? { r: 71, g: 85, b: 105 } : { r: 148, g: 163, b: 184 };
  }

  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function lerpColors(factor = 0.08) {
    ['primary', 'glow', 'warm', 'grid'].forEach(key => {
      currentColors[key].r = lerp(currentColors[key].r, targetColors[key].r, factor);
      currentColors[key].g = lerp(currentColors[key].g, targetColors[key].g, factor);
      currentColors[key].b = lerp(currentColors[key].b, targetColors[key].b, factor);
    });
    currentColors.isLight = targetColors.isLight;
  }

  // ── Architecture Metadata & Presets ───────────────────────────────────────
  const THEME_PRESETS = {
    default: {
      name: 'Distributed Cloud Mesh',
      telemetry: 'CLOUD::BACKBONE',
      subTelemetry: 'CROSS_REGION::ACTIVE [12ms]',
      nodeShape: 'circle',
      gridType: 'crosshair',
    },
    green: {
      name: 'ETL Data Pipeline (DAG)',
      telemetry: 'ETL::DAG_EXECUTOR',
      subTelemetry: 'STAGE::TRANSFORM_LOAD [10K/s]',
      nodeShape: 'square',
      gridType: 'dag_lanes',
    },
    cocoa: {
      name: 'Data Warehouse Columnar Fabric',
      telemetry: 'DW::COLUMNAR_FABRIC',
      subTelemetry: 'PARTITION::HOT_CACHE [45K IOPS]',
      nodeShape: 'block',
      gridType: 'columnar_stripes',
    },
    mocha: {
      name: 'Event-Driven Message Broker',
      telemetry: 'MQ::BROKER_CLUSTER',
      subTelemetry: 'TOPIC::ENTERPRISE_STREAM [ACK_OK]',
      nodeShape: 'ring',
      gridType: 'message_buses',
    },
    truffle: {
      name: 'Real-Time OLAP Compute Matrix',
      telemetry: 'OLAP::QUERY_ENGINE',
      subTelemetry: 'QUERY_LATENCY::0.8ms [CALIBRATED]',
      nodeShape: 'diamond',
      gridType: 'precision_matrix',
    },
    maroon: {
      name: 'Mission-Critical Transaction Fabric & Security Gateway',
      telemetry: 'GATEWAY::DUAL_RAIL_SECURITY',
      subTelemetry: 'TX::ACID_CONSENSUS [0x8F4E]',
      nodeShape: 'hex_vault',
      gridType: 'security_mesh',
    }
  };

  // ── Conduit & Packet Core Classes ─────────────────────────────────────────
  class Conduit {
    constructor(points, type = 'trunk', meta = {}) {
      this.points = points;
      this.type = type;
      this.meta = meta;
      this.length = this.calculateLength();
    }

    calculateLength() {
      let len = 0;
      for (let i = 0; i < this.points.length - 1; i++) {
        const dx = this.points[i + 1].x - this.points[i].x;
        const dy = this.points[i + 1].y - this.points[i].y;
        len += Math.sqrt(dx * dx + dy * dy);
      }
      return Math.max(len, 1);
    }

    getPointAt(progress) {
      const targetDist = progress * this.length;
      let accumulated = 0;

      for (let i = 0; i < this.points.length - 1; i++) {
        const p1 = this.points[i];
        const p2 = this.points[i + 1];
        const segDist = Math.hypot(p2.x - p1.x, p2.y - p1.y);

        if (accumulated + segDist >= targetDist || i === this.points.length - 2) {
          const segProgress = segDist > 0 ? (targetDist - accumulated) / segDist : 0;
          return {
            x: p1.x + (p2.x - p1.x) * segProgress,
            y: p1.y + (p2.y - p1.y) * segProgress,
            angle: Math.atan2(p2.y - p1.y, p2.x - p1.x)
          };
        }
        accumulated += segDist;
      }
      return { x: this.points[0].x, y: this.points[0].y, angle: 0 };
    }
  }

  class DataPacket {
    constructor(conduit, options = {}) {
      this.conduit = conduit;
      this.progress = options.progress !== undefined ? options.progress : Math.random();
      this.speed = options.speed || ((isMobile ? 0.35 : 0.5) + Math.random() * 0.45) * (isReducedMotion ? 0.2 : 1);
      this.size = options.size || (isMobile ? 2.5 : 3.2);
      this.length = options.length || (25 + Math.random() * 35);
      this.colorType = options.colorType || (Math.random() > 0.3 ? 'primary' : 'warm');
      this.opacity = options.opacity || (0.75 + Math.random() * 0.25);
      this.forward = options.forward !== undefined ? options.forward : Math.random() > 0.15;
      this.pulseCycle = Math.random() * Math.PI * 2;
    }

    update() {
      const delta = (this.speed * 60) / Math.max(this.conduit.length, 100);
      this.pulseCycle += 0.05;

      if (this.forward) {
        this.progress += delta * 0.0012;
        if (this.progress > 1) {
          this.progress = 0;
          if (Math.random() < 0.35 && conduits.length > 1) {
            this.conduit = conduits[Math.floor(Math.random() * conduits.length)];
          }
        }
      } else {
        this.progress -= delta * 0.0012;
        if (this.progress < 0) {
          this.progress = 1;
        }
      }
    }

    draw(themeAlpha = 1) {
      const head = this.conduit.getPointAt(this.progress);
      const tailProgress = Math.max(0, Math.min(1, this.progress - (this.length / this.conduit.length) * (this.forward ? 1 : -1)));
      const tail = this.conduit.getPointAt(tailProgress);

      const color = currentColors[this.colorType] || currentColors.primary;
      const alpha = (currentColors.isLight ? Math.min(this.opacity * 0.85, 0.75) : this.opacity) * themeAlpha;

      // Pulse tail gradient
      const grad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
      grad.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
      grad.addColorStop(0.7, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.4})`);
      grad.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`);

      ctx.beginPath();
      ctx.moveTo(tail.x, tail.y);
      ctx.lineTo(head.x, head.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = currentColors.isLight ? this.size * 0.9 : this.size;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Glowing head
      const pulseSize = this.size * (1 + 0.15 * Math.sin(this.pulseCycle));
      ctx.beginPath();
      ctx.arc(head.x, head.y, pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
      ctx.fill();

      // Outer halo in dark mode
      if (!currentColors.isLight) {
        ctx.beginPath();
        ctx.arc(head.x, head.y, pulseSize * 2.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.2})`;
        ctx.fill();
      }
    }
  }

  // ── Topology Builders for Each Theme ──────────────────────────────────────
  let conduits = [];
  let junctions = [];
  let packets = [];
  let activeThemeId = 'default';
  let topologyAlpha = 1.0;
  let isSwitchingTopology = false;

  // 1. Stellar: Distributed Multi-Region Cloud Mesh
  function buildCloudMeshTopology() {
    const gridStep = isMobile ? 52 : 68;
    const trunkCount = isMobile ? 5 : 8;

    for (let t = 0; t < trunkCount; t++) {
      const y = (t + 1) * (height / (trunkCount + 1));
      const points = [];
      let curX = 0;
      let curY = y;
      points.push({ x: curX, y: curY });

      while (curX < width) {
        const segLen = (Math.floor(Math.random() * 3) + 3) * gridStep;
        curX += segLen;
        if (curX >= width) {
          points.push({ x: width, y: curY });
          break;
        }
        points.push({ x: curX, y: curY });
        junctions.push({ x: curX, y: curY, type: 'circle' });

        if (Math.random() > 0.4) {
          const chamfer = 20;
          const shift = (Math.random() > 0.5 ? 1 : -1) * (gridStep * 0.9);
          points.push({ x: curX + chamfer, y: curY + (shift > 0 ? chamfer : -chamfer) });
          curY = Math.max(gridStep, Math.min(height - gridStep, curY + shift));
          curX += chamfer * 2;
          points.push({ x: curX, y: curY });
          junctions.push({ x: curX, y: curY, type: 'circle' });
        }
      }

      const conduit = new Conduit(points, 'cloud_trunk');
      conduits.push(conduit);
      packets.push(new DataPacket(conduit, { colorType: 'primary', size: 3.2 }));
      packets.push(new DataPacket(conduit, { colorType: 'glow', size: 2.8, forward: false }));
    }

    // Cross-region vertical conduits
    const vCount = isMobile ? 3 : 5;
    for (let v = 0; v < vCount; v++) {
      const x = (v + 1) * (width / (vCount + 1));
      const conduit = new Conduit([{ x, y: 0 }, { x, y: height }], 'cross_backbone');
      conduits.push(conduit);
      packets.push(new DataPacket(conduit, { colorType: 'warm', speed: 0.4 }));
    }
  }

  // 2. Void Mint: ETL Pipeline & Directed Acyclic Graph (DAG)
  function buildDagPipelineTopology() {
    const colCount = isMobile ? 4 : 7;
    const colWidth = width / colCount;

    // Stage columns: Extract -> Stage -> Transform -> Validate -> Load
    for (let c = 0; c < colCount - 1; c++) {
      const x1 = (c + 0.5) * colWidth;
      const x2 = (c + 1.5) * colWidth;
      const rows = isMobile ? 3 : 4;

      for (let r = 0; r < rows; r++) {
        const y1 = (r + 0.5) * (height / rows);
        const y2 = ((r + (Math.random() > 0.5 ? 0 : (r > 0 ? -1 : 1))) + 0.5) * (height / rows);
        const clampedY2 = Math.max(height * 0.1, Math.min(height * 0.9, y2));

        const midX = (x1 + x2) / 2;
        const conduit = new Conduit([
          { x: x1, y: y1 },
          { x: midX, y: y1 },
          { x: midX, y: clampedY2 },
          { x: x2, y: clampedY2 }
        ], 'dag_edge');
        conduits.push(conduit);

        junctions.push({ x: x1, y: y1, type: 'square' });
        junctions.push({ x: x2, y: clampedY2, type: 'square' });

        if (Math.random() > 0.3) {
          packets.push(new DataPacket(conduit, {
            colorType: 'primary',
            speed: 0.6 + Math.random() * 0.4,
            size: 3.4
          }));
        }
      }
    }
  }

  // 3. Espresso: Data Warehouse Columnar Fabric
  function buildStorageFabricTopology() {
    const rowCount = isMobile ? 6 : 10;
    const rowHeight = height / rowCount;

    // Parallel columnar memory tracks
    for (let r = 0; r < rowCount; r++) {
      const y = (r + 0.5) * rowHeight;
      const conduit = new Conduit([
        { x: 0, y },
        { x: width, y }
      ], 'columnar_track');
      conduits.push(conduit);

      // Memory partition blocks at regular intervals
      const blockCount = isMobile ? 4 : 7;
      for (let b = 1; b < blockCount; b++) {
        const bx = b * (width / blockCount);
        junctions.push({ x: bx, y, type: 'block' });
      }

      packets.push(new DataPacket(conduit, {
        colorType: 'primary',
        length: 45,
        size: 3.5,
        speed: 0.45 + (r % 2) * 0.2
      }));
    }

    // Interleaved vertical partition rails
    const pCount = isMobile ? 3 : 5;
    for (let p = 0; p < pCount; p++) {
      const px = (p + 0.5) * (width / pCount);
      const conduit = new Conduit([{ x: px, y: 0 }, { x: px, y: height }], 'partition_bus');
      conduits.push(conduit);
      packets.push(new DataPacket(conduit, { colorType: 'warm', speed: 0.35 }));
    }
  }

  // 4. Mocha: Event-Driven Message Broker
  function buildMessageBrokerTopology() {
    const laneCount = isMobile ? 5 : 8;
    const laneHeight = height / laneCount;

    for (let i = 0; i < laneCount; i++) {
      const y = (i + 0.5) * laneHeight;
      const loopOffset = (i % 2 === 0 ? 1 : -1) * 22;

      // Wavy queue buffer lane
      const points = [
        { x: 0, y },
        { x: width * 0.28, y },
        { x: width * 0.35, y: y + loopOffset },
        { x: width * 0.65, y: y + loopOffset },
        { x: width * 0.72, y },
        { x: width, y }
      ];

      const conduit = new Conduit(points, 'queue_lane');
      conduits.push(conduit);

      junctions.push({ x: width * 0.28, y, type: 'ring' });
      junctions.push({ x: width * 0.72, y, type: 'ring' });

      packets.push(new DataPacket(conduit, {
        colorType: 'primary',
        speed: 0.5,
        size: 3.2
      }));
      packets.push(new DataPacket(conduit, {
        colorType: 'glow',
        speed: 0.4,
        forward: false
      }));
    }
  }

  // 5. Truffle: Real-Time OLAP Compute Matrix
  function buildOlapMatrixTopology() {
    const step = isMobile ? 56 : 72;
    const cols = Math.floor(width / step);
    const rows = Math.floor(height / step);

    // Cross-grid precision diamond pathways
    for (let r = 1; r < rows; r++) {
      const y = r * step;
      const conduit = new Conduit([{ x: 0, y }, { x: width, y }], 'olap_row');
      conduits.push(conduit);
      if (r % 2 === 0) {
        packets.push(new DataPacket(conduit, {
          colorType: 'primary',
          speed: 0.65,
          size: 2.8,
          length: 22
        }));
      }
    }

    for (let c = 1; c < cols; c++) {
      const x = c * step;
      const conduit = new Conduit([{ x, y: 0 }, { x, y: height }], 'olap_col');
      conduits.push(conduit);
      if (c % 2 === 1) {
        packets.push(new DataPacket(conduit, {
          colorType: 'warm',
          speed: 0.55,
          size: 2.8,
          length: 22
        }));
      }
    }

    // Grid intersections with diamond nodes
    for (let r = 1; r < rows; r += 2) {
      for (let c = 1; c < cols; c += 2) {
        junctions.push({ x: c * step, y: r * step, type: 'diamond' });
      }
    }
  }

  // 6. Crimson Ruby / Maroon: Zero-Trust Transaction Fabric
  function buildTransactionSecurityTopology() {
    const trackCount = isMobile ? 4 : 7;
    const spacing = height / (trackCount + 1);

    for (let t = 0; t < trackCount; t++) {
      const y = (t + 1) * spacing;
      const railGap = 10; // Dual-rail redundant security trace

      // Primary security rail
      const pointsA = [];
      const pointsB = [];

      let curX = 0;
      pointsA.push({ x: 0, y: y - railGap });
      pointsB.push({ x: 0, y: y + railGap });

      while (curX < width) {
        const seg = (Math.floor(Math.random() * 2) + 3) * (isMobile ? 50 : 80);
        curX += seg;
        if (curX >= width) {
          pointsA.push({ x: width, y: y - railGap });
          pointsB.push({ x: width, y: y + railGap });
          break;
        }

        pointsA.push({ x: curX, y: y - railGap });
        pointsB.push({ x: curX, y: y + railGap });

        // Cryptographic consensus checkpoint gate
        junctions.push({ x: curX, y, type: 'hex_vault' });

        // 45° bypass jog occasionally
        if (Math.random() > 0.5) {
          const jog = 16;
          pointsA.push({ x: curX + jog, y: y - railGap - 8 });
          pointsB.push({ x: curX + jog, y: y + railGap + 8 });
          curX += jog * 2;
          pointsA.push({ x: curX, y: y - railGap });
          pointsB.push({ x: curX, y: y + railGap });
        }
      }

      const conduitA = new Conduit(pointsA, 'tx_rail_a');
      const conduitB = new Conduit(pointsB, 'tx_rail_b');
      conduits.push(conduitA, conduitB);

      // ACID transaction tokens with rhythmic cadence
      packets.push(new DataPacket(conduitA, {
        colorType: 'primary',
        size: 3.6,
        length: 35,
        speed: 0.55
      }));
      packets.push(new DataPacket(conduitB, {
        colorType: 'warm',
        size: 3.2,
        length: 28,
        speed: 0.48,
        forward: false
      }));
    }
  }

  // Master topology dispatcher
  function buildActiveTopology(themeId) {
    conduits = [];
    junctions = [];
    packets = [];

    activeThemeId = themeId || detectThemeId();

    switch (activeThemeId) {
      case 'green':
        buildDagPipelineTopology();
        break;
      case 'cocoa':
        buildStorageFabricTopology();
        break;
      case 'mocha':
        buildMessageBrokerTopology();
        break;
      case 'truffle':
        buildOlapMatrixTopology();
        break;
      case 'maroon':
        buildTransactionSecurityTopology();
        break;
      case 'default':
      default:
        buildCloudMeshTopology();
        break;
    }
  }

  // Smooth topology transition handler
  function transitionToTheme(newThemeId) {
    if (newThemeId === activeThemeId && conduits.length > 0) return;
    if (isSwitchingTopology) return;

    isSwitchingTopology = true;
    let fadeOut = 1.0;

    const fadeInterval = setInterval(() => {
      fadeOut -= 0.15;
      if (fadeOut <= 0) {
        clearInterval(fadeInterval);
        buildActiveTopology(newThemeId);
        updateThemeTargetColors();

        let fadeIn = 0.0;
        const fadeInInterval = setInterval(() => {
          fadeIn += 0.15;
          topologyAlpha = Math.min(1.0, fadeIn);
          if (fadeIn >= 1.0) {
            clearInterval(fadeInInterval);
            isSwitchingTopology = false;
          }
        }, 16);
      } else {
        topologyAlpha = Math.max(0, fadeOut);
      }
    }, 16);
  }

  // ── Dispatch Dynamic Packets from Interaction ─────────────────────────────
  function dispatchPacketsAt(x, y, count = 3) {
    if (!conduits.length) return;

    const sorted = conduits.slice().sort((a, b) => {
      const pA = a.getPointAt(0.5);
      const pB = b.getPointAt(0.5);
      return Math.hypot(pA.x - x, pA.y - y) - Math.hypot(pB.x - x, pB.y - y);
    });

    for (let i = 0; i < Math.min(count, sorted.length); i++) {
      const c = sorted[i];
      packets.push(new DataPacket(c, {
        progress: Math.random(),
        speed: (isMobile ? 0.8 : 1.2) + Math.random() * 0.6,
        size: isMobile ? 3.4 : 4.2,
        colorType: activeThemeId === 'maroon' ? 'primary' : 'warm',
        opacity: 0.95,
      }));
    }

    const maxPackets = isMobile ? 32 : 60;
    if (packets.length > maxPackets) {
      packets.splice(0, packets.length - maxPackets);
    }
  }

  // ── Drawing Subroutines ───────────────────────────────────────────────────
  function drawBackgroundGrid() {
    const gridStep = isMobile ? 50 : 64;
    const gColor = currentColors.grid;
    const isLight = currentColors.isLight;
    const preset = THEME_PRESETS[activeThemeId] || THEME_PRESETS.default;

    const crossSize = 3;
    const baseAlpha = isLight ? 0.07 : 0.04;

    ctx.lineWidth = 1;

    for (let x = gridStep; x < width; x += gridStep) {
      for (let y = gridStep; y < height; y += gridStep) {
        let alpha = baseAlpha;
        if (mouse.isHovering && mouse.x !== null) {
          const dist = Math.hypot(x - mouse.x, y - mouse.y);
          if (dist < mouse.radius) {
            const factor = 1 - (dist / mouse.radius);
            alpha = baseAlpha + factor * (isLight ? 0.28 : 0.22);
          }
        }

        ctx.strokeStyle = `rgba(${gColor.r}, ${gColor.g}, ${gColor.b}, ${alpha * topologyAlpha})`;

        if (preset.gridType === 'precision_matrix') {
          // Subtle diagonal ticks
          ctx.beginPath();
          ctx.moveTo(x - 2, y - 2);
          ctx.lineTo(x + 2, y + 2);
          ctx.moveTo(x + 2, y - 2);
          ctx.lineTo(x - 2, y + 2);
          ctx.stroke();
        } else {
          // Standard coordinate crosshairs
          ctx.beginPath();
          ctx.moveTo(x - crossSize, y);
          ctx.lineTo(x + crossSize, y);
          ctx.moveTo(x, y - crossSize);
          ctx.lineTo(x, y + crossSize);
          ctx.stroke();
        }
      }
    }

    // Ambient radial mouse spotlight
    if (mouse.isHovering && mouse.x !== null) {
      const prim = currentColors.primary;
      const spotAlpha = isLight ? 0.08 : 0.06;
      const spotGrad = ctx.createRadialGradient(
        mouse.x, mouse.y, 10,
        mouse.x, mouse.y, mouse.radius * 1.3
      );
      spotGrad.addColorStop(0, `rgba(${prim.r}, ${prim.g}, ${prim.b}, ${spotAlpha * topologyAlpha})`);
      spotGrad.addColorStop(1, `rgba(${prim.r}, ${prim.g}, ${prim.b}, 0)`);

      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, mouse.radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Theme-specific micro telemetry readout near cursor (desktop only)
      if (!isMobile) {
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = `rgba(${prim.r}, ${prim.g}, ${prim.b}, ${(isLight ? 0.6 : 0.45) * topologyAlpha})`;
        ctx.fillText(`${preset.telemetry} [${Math.round(mouse.x)}, ${Math.round(mouse.y)}]`, mouse.x + 16, mouse.y - 14);

        ctx.fillStyle = `rgba(${gColor.r}, ${gColor.g}, ${gColor.b}, ${(isLight ? 0.45 : 0.3) * topologyAlpha})`;
        ctx.fillText(`// ${preset.subTelemetry}`, mouse.x + 16, mouse.y - 2);
      }
    }
  }

  function drawConduits() {
    const isLight = currentColors.isLight;
    const prim = currentColors.primary;
    const gColor = currentColors.grid;

    conduits.forEach(conduit => {
      const pts = conduit.points;
      if (pts.length < 2) return;

      // Base conduit line
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }

      const conduitAlpha = (isLight ? 0.13 : 0.08) * topologyAlpha;
      ctx.strokeStyle = `rgba(${gColor.r}, ${gColor.g}, ${gColor.b}, ${conduitAlpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Interactive highlight section near mouse
      if (mouse.isHovering && mouse.x !== null) {
        for (let i = 0; i < pts.length - 1; i++) {
          const midX = (pts[i].x + pts[i + 1].x) / 2;
          const midY = (pts[i].y + pts[i + 1].y) / 2;
          const dist = Math.hypot(midX - mouse.x, midY - mouse.y);

          if (dist < mouse.radius) {
            const factor = (1 - dist / mouse.radius);
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[i + 1].x, pts[i + 1].y);
            ctx.strokeStyle = `rgba(${prim.r}, ${prim.g}, ${prim.b}, ${factor * (isLight ? 0.38 : 0.28) * topologyAlpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }
    });

    // Draw junction micro-nodes with theme-specific shapes
    junctions.forEach(j => {
      let jAlpha = (isLight ? 0.22 : 0.14) * topologyAlpha;
      let jRadius = 2.2;

      if (mouse.isHovering && mouse.x !== null) {
        const dist = Math.hypot(j.x - mouse.x, j.y - mouse.y);
        if (dist < mouse.radius * 0.8) {
          const factor = 1 - (dist / (mouse.radius * 0.8));
          jAlpha = (0.2 + factor * 0.65) * topologyAlpha;
          jRadius = 2.2 + factor * 1.8;
        }
      }

      ctx.fillStyle = `rgba(${prim.r}, ${prim.g}, ${prim.b}, ${jAlpha})`;

      if (j.type === 'square') {
        ctx.fillRect(j.x - jRadius, j.y - jRadius, jRadius * 2, jRadius * 2);
      } else if (j.type === 'diamond') {
        ctx.beginPath();
        ctx.moveTo(j.x, j.y - jRadius * 1.3);
        ctx.lineTo(j.x + jRadius * 1.3, j.y);
        ctx.lineTo(j.x, j.y + jRadius * 1.3);
        ctx.lineTo(j.x - jRadius * 1.3, j.y);
        ctx.closePath();
        ctx.fill();
      } else if (j.type === 'hex_vault') {
        // Hexagonal validation checkpoint gate
        ctx.beginPath();
        for (let a = 0; a < 6; a++) {
          const angle = (Math.PI / 3) * a;
          const hx = j.x + jRadius * 1.4 * Math.cos(angle);
          const hy = j.y + jRadius * 1.4 * Math.sin(angle);
          if (a === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.fill();
      } else if (j.type === 'block') {
        ctx.fillRect(j.x - jRadius * 1.5, j.y - jRadius * 0.8, jRadius * 3, jRadius * 1.6);
      } else if (j.type === 'ring') {
        ctx.beginPath();
        ctx.arc(j.x, j.y, jRadius * 1.2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${prim.r}, ${prim.g}, ${prim.b}, ${jAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        // Standard circle
        ctx.beginPath();
        ctx.arc(j.x, j.y, jRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  // ── Main Animation Loop ───────────────────────────────────────────────────
  function animate() {
    if (!isVisible) return;

    lerpColors(0.08);

    ctx.clearRect(0, 0, width, height);

    // Smooth mouse inertia
    if (mouse.targetX !== null && mouse.x !== null) {
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;
    }

    drawBackgroundGrid();
    drawConduits();

    packets.forEach(packet => {
      packet.update();
      packet.draw(topologyAlpha);
    });

    animationId = requestAnimationFrame(animate);
  }

  // ── Resize Handler ────────────────────────────────────────────────────────
  function resizeCanvas() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }

    const parent = canvas.parentElement;
    width = parent ? parent.clientWidth : window.innerWidth;
    height = parent ? parent.clientHeight : window.innerHeight;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    isMobile = window.innerWidth < 768;
    isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    updateThemeTargetColors();
    // Snap initial colors
    Object.assign(currentColors.primary, targetColors.primary);
    Object.assign(currentColors.glow, targetColors.glow);
    Object.assign(currentColors.warm, targetColors.warm);
    Object.assign(currentColors.grid, targetColors.grid);
    currentColors.isLight = targetColors.isLight;

    buildActiveTopology(detectThemeId());
    animate();
  }

  // ── Event Listeners ───────────────────────────────────────────────────────
  let canvasRect = null;
  function updateRect() {
    canvasRect = canvas.getBoundingClientRect();
  }

  canvas.addEventListener('mouseenter', e => {
    updateRect();
    mouse.isHovering = true;
    mouse.targetX = e.clientX - canvasRect.left;
    mouse.targetY = e.clientY - canvasRect.top;
    mouse.x = mouse.targetX;
    mouse.y = mouse.targetY;
  });

  canvas.addEventListener('mousemove', e => {
    if (!canvasRect) updateRect();
    mouse.isHovering = true;
    mouse.targetX = e.clientX - canvasRect.left;
    mouse.targetY = e.clientY - canvasRect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.isHovering = false;
    mouse.targetX = null;
    mouse.targetY = null;
    mouse.x = null;
    mouse.y = null;
    canvasRect = null;
  });

  // Click dispatches dynamic data packets along nearest conduits
  canvas.addEventListener('click', e => {
    if (!canvasRect) updateRect();
    const clickX = e.clientX - canvasRect.left;
    const clickY = e.clientY - canvasRect.top;
    dispatchPacketsAt(clickX, clickY, isMobile ? 3 : 5);
  });

  // Touch support
  canvas.addEventListener('touchstart', e => {
    if (e.touches.length > 0) {
      updateRect();
      const touch = e.touches[0];
      const tx = touch.clientX - canvasRect.left;
      const ty = touch.clientY - canvasRect.top;
      mouse.isHovering = true;
      mouse.x = tx;
      mouse.y = ty;
      dispatchPacketsAt(tx, ty, 3);
    }
  }, { passive: true });

  canvas.addEventListener('touchend', () => {
    mouse.isHovering = false;
  }, { passive: true });

  // ── Theme Reactivity ──────────────────────────────────────────────────────
  // 1. MutationObserver on <body> class changes
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.attributeName === 'class') {
        const newTheme = detectThemeId();
        updateThemeTargetColors();
        if (newTheme !== activeThemeId) {
          transitionToTheme(newTheme);
        }
        break;
      }
    }
  });
  observer.observe(document.body, { attributes: true });

  // 2. Custom window event listener for immediate responsive dispatch
  window.addEventListener('themechange', e => {
    const newTheme = (e.detail && e.detail.themeId) || detectThemeId();
    updateThemeTargetColors();
    if (newTheme !== activeThemeId) {
      transitionToTheme(newTheme);
    }
  });

  // ── Debounced Resize ──────────────────────────────────────────────────────
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeCanvas, 150);
  });

  // ── Intersection Observer (Battery & CPU Saver) ───────────────────────────
  const heroSection = canvas.closest('#hero') || canvas.parentElement;
  if ('IntersectionObserver' in window && heroSection) {
    const visibilityObserver = new IntersectionObserver(entries => {
      const entry = entries[0];
      isVisible = entry.isIntersecting;
      if (isVisible) {
        if (animationId === null) animate();
      } else {
        if (animationId !== null) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      }
    }, { threshold: 0 });
    visibilityObserver.observe(heroSection);
  }

  // Initial boot
  resizeCanvas();
}

// Backward-compatible alias
export const initParticles = initHeroBackground;

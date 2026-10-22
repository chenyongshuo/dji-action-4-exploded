/* ===========================================================================
   OSMO ACTION 4 — Interactive 3D Teardown
   Pure Three.js r159 (UMD) · no external model files · procedural geometry
   =========================================================================== */
(function () {
  'use strict';

  if (typeof THREE === 'undefined') {
    document.body.innerHTML =
      '<div style="color:#e9f0f7;font:16px/1.7 Segoe UI,sans-serif;padding:48px;text-align:center">' +
      'Three.js 加载失败：请确认 <code>vendor/three.min.js</code> 与页面位于同一目录。</div>';
    return;
  }

  /* =======================================================================
     1. PART DATABASE — 9 modules · real Osmo Action 4 specifications
        specs = [label, value, unit]
     ======================================================================= */
  var PARTS = [
    {
      id: 'chassis', idx: '01', code: 'A4-CHS-01',
      name: '机身中框', en: 'MAIN CHASSIS FRAME',
      cat: 'CHASSIS STRUCTURE / 结构件',
      color: '#9fb2c4', coSpec: '铝合金中框 · IP68 · 18 m',
      desc: '航空级铝合金一体成型中框，承载全部光学、电子与散热模块。整机通过 GB/T 4208-2017 与 IEC 60529 的 IP68 防护测试，裸机防水 18 米。前后视窗采用高强度玻璃，三重密封结构兼顾抗压与透光。',
      specs: [
        ['尺寸', '70.5×44.2×32.8', 'mm'], ['重量', '145', 'g'],
        ['裸机防水', '18', 'm'], ['防护等级', 'IP68', ''],
        ['工作温度', '-20~45', '℃'], ['材质', '铝合金', 'CNC']
      ],
      features: ['一体成型 CNC 中框', '三重密封防水', '石墨均热散热层', '磁吸底座定位面', '3 麦克风声学通道'],
      note: '中框是整机的结构基准，所有模块以其为装配参考面。拆解时中框保持固定并半透明化，其余八个模块沿光学轴与功能轴依次分离。',
      explode: [0, 0, 0], delay: 0, dur: 0.4,
      label: { dir: -1, oy: -46 }, anchor: [-3.1, 1.85, 0.4]
    },
    {
      id: 'lens', idx: '02', code: 'A4-LNS-02',
      name: '超广角镜头组', en: 'ULTRA-WIDE LENS MODULE',
      cat: 'OPTICAL SYSTEM / 光学系统',
      color: '#5ed9ff', coSpec: '155° f/2.8 超广角',
      desc: '七片式超广角定焦镜头，视场角达 155°，恒定光圈 f/2.8，焦点范围 0.4 米至无穷远。最外侧为可更换旋入式镜头保护盖，前组镜片镀多层增透膜，有效抑制眩光与鬼影，支撑 4K/120fps 与 10-bit D-Log M 录制。',
      specs: [
        ['视场角', '155', '°'], ['光圈', 'f/2.8', '恒定'],
        ['最近对焦', '0.4', 'm'], ['镜片结构', '7', '片'],
        ['镀膜', '多层 AR', ''], ['保护盖', '旋入式', '可换']
      ],
      features: ['155° 超广视角', 'f/2.8 弱光拍摄', '0.4 m 近摄', '旋入式保护盖', '低畸变设计'],
      note: '镜头模组沿光学轴 (+Z) 最先分离，后镜筒伸入机身与传感器模块对接。前组玻璃反射由程序化 PMREM 环境贴图实时生成。',
      explode: [-0.85, 0.42, 4.7], delay: 0.06, dur: 0.48,
      label: { dir: -1, oy: -46 }, anchor: [0, 1.28, 0.42]
    },
    {
      id: 'sensor', idx: '03', code: 'A4-SNS-03',
      name: '影像传感器', en: 'IMAGE SENSOR MODULE',
      cat: 'IMAGING CORE / 成像核心',
      color: '#b6f36a', coSpec: '1/1.3″ CMOS · 4K/120',
      desc: '1/1.3 英寸 CMOS 影像传感器，最大照片分辨率 3648 × 2736。支持 ISO 100–12800、电子快门 1/8000 s–30 s，可录制 4K/120fps 与 10-bit D-Log M / HLG 视频，配合 RockSteady 4.0 与地平线增稳实现强力防抖。',
      specs: [
        ['靶面', '1/1.3', '″ CMOS'], ['照片分辨率', '3648×2736', ''],
        ['ISO 范围', '100-12800', ''], ['电子快门', '1/8000', 's'],
        ['最高视频', '4K/120', 'fps'], ['防抖', 'RockSteady', '4.0']
      ],
      features: ['1/1.3″ 大底', '10-bit D-Log M', 'HLG 视频', '地平线增稳', 'IR 滤光模组'],
      note: '传感器位于镜头正后方，是成像链核心。拆解时沿光学轴前移，与镜头、主板形成清晰的层级关系。',
      explode: [-1.25, -0.22, 2.95], delay: 0.2, dur: 0.44,
      label: { dir: -1, oy: 30 }, anchor: [-0.7, 0.95, 0.2]
    },
    {
      id: 'frontScreen', idx: '04', code: 'A4-FSC-04',
      name: '前触控屏', en: 'FRONT TOUCHSCREEN',
      cat: 'DISPLAY · INPUT / 显示交互',
      color: '#ffc46b', coSpec: '1.4″ 320×320 · 750 nit',
      desc: '1.4 英寸正方形前置触控屏，分辨率 320 × 320，像素密度 323 ppi，亮度 750 ± 50 cd/m²。支持自拍取景、模式滑动切换与参数调节，表面覆盖疏油层玻璃，湿手触控依然可用。',
      specs: [
        ['尺寸', '1.4', '″'], ['分辨率', '320×320', ''],
        ['像素密度', '323', 'ppi'], ['亮度', '750', 'nit'],
        ['触控', '多点电容', ''], ['屏占比', '1:1', '方形']
      ],
      features: ['自拍实时取景', '滑动切换模式', '湿手触控', '户外高亮可视', '疏油层玻璃'],
      note: '前屏与镜头同处前面板，拆解时向前右方分离，展示独立触控模组与排线接口。',
      explode: [2.35, 0.62, 2.75], delay: 0.12, dur: 0.44,
      label: { dir: 1, oy: -36 }, anchor: [0.95, 1.05, 0.15]
    },
    {
      id: 'rearScreen', idx: '05', code: 'A4-RSC-05',
      name: '后触控屏', en: 'REAR TOUCHSCREEN',
      cat: 'DISPLAY · INPUT / 显示交互',
      color: '#ffc46b', coSpec: '2.25″ 360×640 · 750 nit',
      desc: '2.25 英寸后置触控屏，分辨率 360 × 640，像素密度 326 ppi，亮度 750 ± 50 cd/m²。承担主取景、回放与全部设置操作，支持双指缩放与下拉快捷菜单，是整机交互中枢。',
      specs: [
        ['尺寸', '2.25', '″'], ['分辨率', '360×640', ''],
        ['像素密度', '326', 'ppi'], ['亮度', '750', 'nit'],
        ['刷新率', '60', 'Hz'], ['面板', '强化玻璃', '']
      ],
      features: ['主取景与回放', '手势缩放', '快捷菜单', '高亮户外可视', '强化玻璃面板'],
      note: '后屏沿光学轴向后 (-Z) 分离，背面可见显示驱动排线与中框密封结构。',
      explode: [0.2, 0.12, -4.25], delay: 0.42, dur: 0.44,
      label: { dir: 1, oy: -34 }, anchor: [2.1, 1.15, -0.1]
    },
    {
      id: 'pcb', idx: '06', code: 'A4-PCB-06',
      name: '主控电路板', en: 'MAIN CIRCUIT BOARD',
      cat: 'ELECTRONICS / 电子系统',
      color: '#ad92ff', coSpec: 'SoC · 3 Mic · Wi-Fi 6',
      desc: '高密度多层主板，集成影像处理 SoC 与增稳协处理器。板载 3 个数字 MEMS 麦克风阵列、microSD 卡座（最大 512 GB）与 USB-C 接口，支持 Wi-Fi 6 与蓝牙 5.1 高速传输，音频采样 48 kHz。',
      specs: [
        ['麦克风', '3', 'MEMS'], ['存储上限', '512', 'GB'],
        ['有线接口', 'USB-C', ''], ['无线', 'Wi-Fi 6', ''],
        ['蓝牙', '5.1', ''], ['音频', '48', 'kHz']
      ],
      features: ['多层 HDI 布线', '3 麦克风降噪阵列', '屏蔽罩 SoC', 'USB-C 传输', '无线快传'],
      note: '主板位于机身中后部，拆解时向后下方抽出，可见金色连接器、屏蔽罩与板对板排线座。',
      explode: [-0.6, -2.6, -1.2], delay: 0.34, dur: 0.48,
      label: { dir: -1, oy: 92 }, anchor: [-2.1, 1.25, 0]
    },
    {
      id: 'battery', idx: '07', code: 'A4-BAT-07',
      name: '极端环境电池', en: 'EXTREME BATTERY',
      cat: 'POWER SYSTEM / 能源系统',
      color: '#ff7138', coSpec: '1770 mAh · -20℃ · 160 min',
      desc: '1770 mAh 极端环境电池，支持 -20℃ 低温放电。1080p/24fps 录像续航约 160 分钟，4K/60fps 约 100 分钟。侧向抽拉式仓体配合一体密封仓盖实现 IP68 防水，支持 USB-C 快充与边充边录。',
      specs: [
        ['容量', '1770', 'mAh'], ['能量', '13.6', 'Wh'],
        ['续航 1080p', '160', 'min'], ['续航 4K/60', '100', 'min'],
        ['低温放电', '-20', '℃'], ['电压', '7.7', 'V']
      ],
      features: ['1770 mAh 大容量', '-20℃ 耐寒', '160 分钟续航', '侧向快拆仓体', '边充边录'],
      note: '电池从机身右侧 (+X) 抽拉取出，仓盖与密封圈随电池模组一体移出，是整机防水的关键活动部件。',
      explode: [4.95, 0.1, 0.3], delay: 0.26, dur: 0.48,
      label: { dir: 1, oy: 0 }, anchor: [0.3, 1.6, 0]
    },
    {
      id: 'mount', idx: '08', code: 'A4-MNT-08',
      name: '磁吸快拆底座', en: 'MAGNETIC QUICK-RELEASE',
      cat: 'EXPANSION / 扩展接口',
      color: '#8fe3ff', coSpec: 'N52 磁组 · ±0.05 mm',
      desc: '底部磁吸快拆接口，N52 高强磁组与机械锁止双重固定，秒速切换横竖拍与各类配件。定位面精度 ±0.05 mm，确保快拆后光轴一致，兼容 DJI 全套磁吸配件生态。',
      specs: [
        ['磁组', 'N52', '强磁'], ['定位精度', '±0.05', 'mm'],
        ['承载', '≥2', 'kg'], ['锁止', '机械+磁吸', ''],
        ['横竖切换', '免工具', ''], ['生态', 'DJI 磁吸', '通用']
      ],
      features: ['N52 强磁吸附', '机械锁止双保险', '横竖拍秒换', '±0.05 mm 定位', '配件生态兼容'],
      note: '底座沿 -Y 轴向下分离，展示磁组阵列、锁止销与快释放滑钮结构。',
      explode: [0, -3.15, 0], delay: 0.5, dur: 0.5,
      label: { dir: 1, oy: 28 }, anchor: [2.0, 0.1, 0]
    },
    {
      id: 'buttons', idx: '09', code: 'A4-BTN-09',
      name: '按键控制组', en: 'BUTTON CONTROL SET',
      cat: 'CONTROL UI / 操控界面',
      color: '#ff9160', coSpec: '快门 / 电源 / QS 快切',
      desc: '顶部按键组包含大行程快门/录像键、电源键与 QS 快切键。防水硅胶密封结构，行程清晰、盲操可靠。快门键嵌橙色状态指示环，电源键长按唤醒，QS 键一键循环拍摄模式。',
      specs: [
        ['按键', '3', '组'], ['快门键', '大行程', ''],
        ['密封', '硅胶防水', ''], ['手感', '段落式', ''],
        ['QS 键', '模式快切', ''], ['指示', '状态环', '']
      ],
      features: ['大行程快门', 'QS 一键快切', '防水硅胶密封', '段落式手感', '橙色指示环'],
      note: '按键组沿 +Y 轴向上抬起，展示硅胶密封垫、触发触点与金属支架结构。',
      explode: [0.4, 2.95, 0.2], delay: 0.0, dur: 0.45,
      label: { dir: 1, oy: -32 }, anchor: [1.9, 0.3, 0.3]
    }
  ];

  var PART_BY_ID = {};
  PARTS.forEach(function (p) { PART_BY_ID[p.id] = p; });

  /* =======================================================================
     2. CONFIG — real dimensions, 1 unit = 1 cm (70.5 × 44.2 × 32.8 mm)
     ======================================================================= */
  var BW = 7.05, BH = 4.42, BD = 3.28;
  var BODY_R = 0.5;
  var LENS_X = -1.15, LENS_Y = 0.06;
  var FSCR_X = 2.02, FSCR_Y = 0.06;
  var FRONT_Z = BD / 2, REAR_Z = -BD / 2;

  var BASE_POS = {
    chassis:     [0, 0, 0],
    lens:        [LENS_X, LENS_Y, FRONT_Z - 0.06],
    sensor:      [LENS_X, LENS_Y, 0.55],
    frontScreen: [FSCR_X, FSCR_Y, FRONT_Z - 0.10],
    rearScreen:  [0, 0, REAR_Z + 0.10],
    pcb:         [-0.3, -0.1, -0.35],
    battery:     [2.7, 0, 0],
    mount:       [0, -BH / 2 - 0.12, 0],
    buttons:     [0.6, BH / 2 + 0.02, 0.35]
  };

  var CAM_HOME = { radius: 13, phi: 1.16, theta: 0.62 };

  /* =======================================================================
     3. STATE
     ======================================================================= */
  var renderer, scene, camera, envMap, modelGroup, controls;
  var partGroups = {}, glowData = {}, pickMeshes = [], calloutEls = {}, rowEls = {};
  var selectLight, shellMat, plateMat;
  var explodeProgress = 0, explodeTarget = 0;
  var selectedId = null, hoveredId = null;
  var labelsVisible = true, autoRotate = false, bootDone = false;
  var pointerInside = false, pointerX = 0, pointerY = 0, hoverDirty = false;
  var clock = new THREE.Clock();
  var raycaster = new THREE.Raycaster();
  var pointerNDC = new THREE.Vector2();
  var _v3a = new THREE.Vector3(), _v3b = new THREE.Vector3();
  var yawTick = 0;
  var reducedMotion = false;
  try {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  var dom = {};
  function $(id) { return document.getElementById(id); }

  /* =======================================================================
     4. HELPERS
     ======================================================================= */
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function smoothstep(a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }

  function roundedRectShape(w, h, r) {
    r = Math.min(r, w / 2 - 0.001, h / 2 - 0.001);
    var s = new THREE.Shape();
    var x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }
  function roundedBoxGeo(w, h, d, r, bevelSegs, curveSegs) {
    var shape = roundedRectShape(w, h, r);
    var bevel = Math.min(r * 0.85, d / 2 - 0.002);
    var geo = new THREE.ExtrudeGeometry(shape, {
      depth: Math.max(0.01, d - bevel * 2),
      bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.9,
      bevelOffset: 0, bevelSegments: bevelSegs || 2, curveSegments: curveSegs || 5
    });
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }
  function M(geo, mat, px, py, pz, rx, ry, rz) {
    var m = new THREE.Mesh(geo, mat);
    if (px !== undefined) m.position.set(px, py || 0, pz || 0);
    if (rx !== undefined) m.rotation.set(rx, ry || 0, rz || 0);
    m.castShadow = true; m.receiveShadow = true;
    return m;
  }

  /* =======================================================================
     5. PROCEDURAL CANVAS TEXTURES
     ======================================================================= */
  function canvas2d(w, h) {
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    return { c: c, x: c.getContext('2d') };
  }
  function toTex(c, srgb) {
    var t = new THREE.CanvasTexture(c);
    if (srgb !== false) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }

  function lensRingTex() {
    var g = canvas2d(1024, 56), x = g.x;
    x.fillStyle = '#0c0e11'; x.fillRect(0, 0, 1024, 56);
    x.fillStyle = '#77838f'; x.font = '600 21px "Segoe UI",sans-serif'; x.textBaseline = 'middle';
    var txt = 'DJI · OSMO ACTION 4 · 155° f/2.8 · 1/1.3" CMOS ';
    var tw = x.measureText(txt).width, px = 0;
    while (px < 1024) { x.fillText(txt, px, 29); px += tw + 30; }
    x.strokeStyle = 'rgba(130,150,170,0.22)'; x.lineWidth = 1;
    x.beginPath(); x.moveTo(0, 5); x.lineTo(1024, 5); x.moveTo(0, 51); x.lineTo(1024, 51); x.stroke();
    return toTex(g.c);
  }

  function screenTex(isFront) {
    var w = isFront ? 320 : 640, h = isFront ? 320 : 360;
    var g = canvas2d(w, h), x = g.x;
    var bg = x.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#0c1219'); bg.addColorStop(1, '#05080d');
    x.fillStyle = bg; x.fillRect(0, 0, w, h);
    /* rule-of-thirds grid */
    x.strokeStyle = 'rgba(125,165,195,0.10)'; x.lineWidth = 1;
    for (var i = 1; i < 3; i++) {
      x.beginPath(); x.moveTo(w * i / 3, 0); x.lineTo(w * i / 3, h); x.stroke();
      x.beginPath(); x.moveTo(0, h * i / 3); x.lineTo(w, h * i / 3); x.stroke();
    }
    /* focus box */
    x.strokeStyle = 'rgba(94,217,255,0.6)'; x.lineWidth = 1.5;
    var bw = w * (isFront ? 0.36 : 0.2), bh = h * (isFront ? 0.36 : 0.36);
    x.strokeRect(w / 2 - bw / 2, h / 2 - bh / 2, bw, bh);
    x.strokeStyle = 'rgba(94,217,255,0.25)';
    x.strokeRect(w / 2 - bw / 2 - 6, h / 2 - bh / 2 - 6, bw + 12, bh + 12);
    /* REC */
    x.fillStyle = '#ff453a'; x.beginPath(); x.arc(24, 24, 7, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#ffd9d4'; x.font = '700 15px "Segoe UI",sans-serif'; x.textBaseline = 'middle';
    x.fillText('REC', 38, 25);
    /* timecode */
    x.fillStyle = '#cfe6f5'; x.font = '500 15px Consolas,monospace';
    x.fillText('00:12:34', w - 92, 25);
    /* mode badge */
    var mbw = isFront ? 104 : 116, mbh = 26, mbx = w / 2 - mbw / 2, mby = h - 44;
    x.fillStyle = 'rgba(94,217,255,0.13)'; x.fillRect(mbx, mby, mbw, mbh);
    x.strokeStyle = 'rgba(94,217,255,0.55)'; x.lineWidth = 1; x.strokeRect(mbx, mby, mbw, mbh);
    x.fillStyle = '#8fe3ff'; x.font = '700 13px "Segoe UI",sans-serif';
    x.fillText('4K / 120fps', mbx + (isFront ? 14 : 16), mby + 14);
    /* battery */
    x.strokeStyle = '#b6f36a'; x.lineWidth = 1.5;
    var bx = w - 54, by = h - 34;
    x.strokeRect(bx, by, 30, 15); x.fillStyle = '#b6f36a'; x.fillRect(bx + 2, by + 2, 21, 11); x.fillRect(bx + 31, by + 4, 3, 7);
    /* EIS badge */
    x.fillStyle = 'rgba(182,243,106,0.14)'; x.fillRect(16, h - 44, isFront ? 74 : 96, 24);
    x.fillStyle = '#b6f36a'; x.font = '600 12px "Segoe UI",sans-serif';
    x.fillText(isFront ? 'EIS ON' : 'RockSteady', 24, h - 31);
    if (!isFront) {
      x.fillStyle = 'rgba(255,255,255,0.05)';
      for (var r2 = 0; r2 < 3; r2++) x.fillRect(24, 56 + r2 * 30, 170, 22);
      x.fillStyle = '#9fb8c8'; x.font = '500 12px "Segoe UI",sans-serif';
      x.fillText('ISO 100-12800', 34, 71);
      x.fillText('FOV 155° Ultra Wide', 34, 101);
      x.fillText('D-Log M · 10-bit', 34, 131);
      x.fillStyle = 'rgba(200,220,235,0.35)'; x.font = '700 14px "Segoe UI",sans-serif';
      x.fillText('DJI', w - 60, h - 74);
    } else {
      x.fillStyle = 'rgba(200,220,235,0.35)'; x.font = '700 13px "Segoe UI",sans-serif';
      x.fillText('DJI', w / 2 - 14, h - 14);
    }
    return toTex(g.c);
  }

  function pcbTex() {
    var g = canvas2d(512, 340), x = g.x;
    x.fillStyle = '#08130d'; x.fillRect(0, 0, 512, 340);
    var seed = 7;
    function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
    x.strokeStyle = 'rgba(198,162,60,0.45)'; x.lineWidth = 1.3;
    for (var i = 0; i < 44; i++) {
      x.beginPath();
      var sx = rnd() * 512, sy = rnd() * 340; x.moveTo(sx, sy);
      var cx2 = sx, cy2 = sy;
      for (var s = 0; s < 3; s++) {
        if (rnd() > 0.5) cx2 += (rnd() - 0.5) * 90; else cy2 += (rnd() - 0.5) * 90;
        x.lineTo(cx2, cy2);
      }
      x.stroke();
      x.fillStyle = 'rgba(210,175,80,0.55)';
      x.beginPath(); x.arc(cx2, cy2, 2.3, 0, Math.PI * 2); x.fill();
    }
    x.fillStyle = 'rgba(190,200,210,0.14)';
    for (var k = 0; k < 8; k++) {
      var px2 = 40 + rnd() * 380, py2 = 30 + rnd() * 260, pw = 26 + rnd() * 40, ph = 18 + rnd() * 28;
      x.fillRect(px2, py2, pw, ph);
      x.strokeStyle = 'rgba(220,230,240,0.2)'; x.lineWidth = 1; x.strokeRect(px2, py2, pw, ph);
    }
    x.fillStyle = 'rgba(226,236,244,0.55)'; x.font = '600 13px Consolas,monospace';
    x.fillText('OA4-MAIN-V2.1', 18, 24);
    x.fillText('DJI 2023', 18, 326);
    x.font = '500 10px Consolas,monospace'; x.fillStyle = 'rgba(226,236,244,0.35)';
    x.fillText('microSD', 400, 326); x.fillText('USB-C', 404, 24);
    return toTex(g.c);
  }

  function batteryTex() {
    /* portrait label 400×528 mapped on Z(2.5)×Y(3.3) face */
    var g = canvas2d(400, 528), x = g.x;
    x.fillStyle = '#15181c'; x.fillRect(0, 0, 400, 528);
    var stripe = x.createLinearGradient(0, 0, 400, 0);
    stripe.addColorStop(0, '#ff7138'); stripe.addColorStop(1, '#ff9160');
    x.fillStyle = stripe; x.fillRect(0, 0, 400, 14);
    x.fillStyle = 'rgba(255,113,56,0.10)'; x.fillRect(0, 14, 400, 44);
    x.fillStyle = '#e9f0f7'; x.font = '800 52px "Segoe UI",sans-serif'; x.textBaseline = 'middle';
    x.fillText('DJI', 32, 92);
    x.fillStyle = '#a3b0be'; x.font = '600 21px "Segoe UI",sans-serif';
    x.fillText('EXTREME BATTERY', 32, 148);
    x.fillStyle = '#ff9160'; x.font = '700 64px Consolas,monospace';
    x.fillText('1770', 32, 224);
    x.fillStyle = '#a3b0be'; x.font = '600 26px "Segoe UI",sans-serif';
    x.fillText('mAh', 208, 224);
    x.fillStyle = '#6f7d8d'; x.font = '500 17px "Segoe UI",sans-serif';
    x.fillText('7.7 V ⎓ 13.6 Wh', 32, 286);
    x.fillText('Li-ion  LIPO', 32, 314);
    x.fillStyle = '#8fa2b3'; x.font = '600 19px "Segoe UI",sans-serif';
    x.fillText('-20℃ LOW TEMP', 32, 360);
    x.strokeStyle = 'rgba(255,196,107,0.5)'; x.lineWidth = 2;
    x.strokeRect(32, 396, 336, 100);
    x.fillStyle = 'rgba(255,196,107,0.75)'; x.font = '700 15px "Segoe UI",sans-serif';
    x.fillText('⚠ DO NOT DISASSEMBLE', 48, 424);
    x.font = '500 13px "Segoe UI",sans-serif'; x.fillStyle = 'rgba(255,196,107,0.5)';
    x.fillText('IP68 SEALED · NO USER SERVICE', 48, 452);
    x.fillText('MADE FOR OSMO ACTION 4', 48, 476);
    return toTex(g.c);
  }

  function bodyDecalTex() {
    var g = canvas2d(512, 128), x = g.x;
    x.clearRect(0, 0, 512, 128);
    x.textBaseline = 'middle';
    x.fillStyle = 'rgba(214,228,240,0.88)'; x.font = '800 54px "Segoe UI",sans-serif';
    x.fillText('DJI', 14, 52);
    x.fillStyle = 'rgba(163,182,200,0.62)'; x.font = '600 25px "Segoe UI",sans-serif';
    x.fillText('OSMO ACTION 4', 148, 42);
    x.fillStyle = 'rgba(255,113,56,0.85)'; x.font = '700 20px "Segoe UI",sans-serif';
    x.fillText('4K/120 · 18 m · IP68', 148, 84);
    var t = new THREE.CanvasTexture(g.c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  function gripTex() {
    var g = canvas2d(256, 256), x = g.x;
    x.fillStyle = '#101215'; x.fillRect(0, 0, 256, 256);
    x.fillStyle = 'rgba(255,255,255,0.05)';
    for (var i = 6; i < 256; i += 13) for (var j = 6; j < 256; j += 13) {
      x.beginPath(); x.arc(i, j, 2.1, 0, Math.PI * 2); x.fill();
    }
    var t = toTex(g.c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 2);
    return t;
  }

  /* =======================================================================
     6. MATERIALS
     ======================================================================= */
  var MAT = {};
  function buildMaterials() {
    MAT.bodyDark = new THREE.MeshStandardMaterial({ color: 0x1b1e23, metalness: 0.82, roughness: 0.36, envMapIntensity: 1.15 });
    MAT.bodyMid = new THREE.MeshStandardMaterial({ color: 0x2a2e34, metalness: 0.7, roughness: 0.42, envMapIntensity: 1.0 });
    MAT.bodyLight = new THREE.MeshStandardMaterial({ color: 0x3a4048, metalness: 0.6, roughness: 0.5, envMapIntensity: 0.9 });
    MAT.rubber = new THREE.MeshStandardMaterial({ color: 0x0e1013, metalness: 0.05, roughness: 0.88, envMapIntensity: 0.5 });
    MAT.steel = new THREE.MeshStandardMaterial({ color: 0x9aa3ac, metalness: 0.95, roughness: 0.22, envMapIntensity: 1.6 });
    MAT.darkSteel = new THREE.MeshStandardMaterial({ color: 0x4a525a, metalness: 0.9, roughness: 0.3, envMapIntensity: 1.3 });
    MAT.lensRing = new THREE.MeshStandardMaterial({ color: 0x0d0f12, metalness: 0.92, roughness: 0.18, envMapIntensity: 1.5 });
    MAT.lensGlass = new THREE.MeshPhysicalMaterial({
      color: 0x050a12, metalness: 0.0, roughness: 0.02, ior: 1.6, envMapIntensity: 3.2,
      clearcoat: 1.0, clearcoatRoughness: 0.02, specularIntensity: 1.0,
      specularColor: new THREE.Color(0x9cc4ff), transparent: true, opacity: 0.94
    });
    MAT.lensInner = new THREE.MeshStandardMaterial({ color: 0x02040a, metalness: 0.3, roughness: 0.15, envMapIntensity: 0.8 });
    MAT.accent = new THREE.MeshStandardMaterial({ color: 0xff7138, metalness: 0.35, roughness: 0.45, emissive: 0xff5a1e, emissiveIntensity: 0.25 });
    MAT.accentDim = new THREE.MeshStandardMaterial({ color: 0xc85a2e, metalness: 0.4, roughness: 0.5 });
    MAT.screenGlass = new THREE.MeshPhysicalMaterial({
      color: 0x04070b, metalness: 0.1, roughness: 0.06, envMapIntensity: 1.5,
      clearcoat: 1.0, clearcoatRoughness: 0.04, transparent: true, opacity: 0.3
    });
    MAT.pcb = new THREE.MeshStandardMaterial({ color: 0x0a2a1a, metalness: 0.25, roughness: 0.62, envMapIntensity: 0.7 });
    MAT.chip = new THREE.MeshStandardMaterial({ color: 0x14171b, metalness: 0.55, roughness: 0.42, envMapIntensity: 0.9 });
    MAT.chipTop = new THREE.MeshStandardMaterial({ color: 0x22262c, metalness: 0.6, roughness: 0.35 });
    MAT.gold = new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 0.92, roughness: 0.28, envMapIntensity: 1.5 });
    MAT.copper = new THREE.MeshStandardMaterial({ color: 0xb0703a, metalness: 0.85, roughness: 0.35 });
    MAT.batteryBody = new THREE.MeshStandardMaterial({ color: 0x1c1f24, metalness: 0.4, roughness: 0.5, envMapIntensity: 0.8 });
    MAT.magnet = new THREE.MeshStandardMaterial({ color: 0x565e66, metalness: 0.95, roughness: 0.18, envMapIntensity: 1.7 });
    MAT.led = new THREE.MeshBasicMaterial({ color: 0x8fe3ff });
    MAT.white = new THREE.MeshStandardMaterial({ color: 0xdfe8f0, metalness: 0.1, roughness: 0.6 });
    /* chassis-exclusive fading clones */
    shellMat = MAT.bodyDark.clone(); shellMat.transparent = true; shellMat.opacity = 1;
    plateMat = MAT.bodyMid.clone(); plateMat.transparent = true; plateMat.opacity = 1;
  }

  /* =======================================================================
     7. ENVIRONMENT + LIGHTS
     ======================================================================= */
  function createEnvironment() {
    var pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    var g = canvas2d(512, 256), x = g.x;
    var grad = x.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#26394a'); grad.addColorStop(0.42, '#101a24');
    grad.addColorStop(0.62, '#0a1017'); grad.addColorStop(1, '#05080c');
    x.fillStyle = grad; x.fillRect(0, 0, 512, 256);
    var rg = x.createRadialGradient(140, 52, 4, 140, 52, 100);
    rg.addColorStop(0, 'rgba(215,235,255,0.95)'); rg.addColorStop(1, 'rgba(215,235,255,0)');
    x.fillStyle = rg; x.beginPath(); x.ellipse(140, 52, 100, 54, 0, 0, Math.PI * 2); x.fill();
    var rg2 = x.createRadialGradient(392, 96, 4, 392, 96, 84);
    rg2.addColorStop(0, 'rgba(255,150,90,0.5)'); rg2.addColorStop(1, 'rgba(255,150,90,0)');
    x.fillStyle = rg2; x.beginPath(); x.ellipse(392, 96, 84, 48, 0, 0, Math.PI * 2); x.fill();
    var rg3 = x.createRadialGradient(56, 150, 4, 56, 150, 72);
    rg3.addColorStop(0, 'rgba(90,170,230,0.28)'); rg3.addColorStop(1, 'rgba(90,170,230,0)');
    x.fillStyle = rg3; x.beginPath(); x.ellipse(56, 150, 72, 42, 0, 0, Math.PI * 2); x.fill();
    var tex = new THREE.CanvasTexture(g.c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    envMap = pmrem.fromEquirectangular(tex).texture;
    tex.dispose(); pmrem.dispose();
    scene.environment = envMap;
  }

  function setupLights() {
    scene.add(new THREE.AmbientLight(0x2a3a4a, 0.55));
    var key = new THREE.DirectionalLight(0xdceaff, 2.2);
    key.position.set(6, 9, 8);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1; key.shadow.camera.far = 34;
    key.shadow.camera.left = -10; key.shadow.camera.right = 10;
    key.shadow.camera.top = 10; key.shadow.camera.bottom = -10;
    key.shadow.bias = -0.0012;
    scene.add(key);
    var rim = new THREE.DirectionalLight(0xff9a5e, 0.95);
    rim.position.set(-7, 3, -6); scene.add(rim);
    var fill = new THREE.DirectionalLight(0x6fa8d8, 0.55);
    fill.position.set(-4, -5, 6); scene.add(fill);
    selectLight = new THREE.PointLight(0xffffff, 0, 9, 2);
    selectLight.visible = false;
    scene.add(selectLight);
    var ground = new THREE.Mesh(new THREE.PlaneGeometry(46, 46), new THREE.ShadowMaterial({ opacity: 0.26 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -7.4;
    ground.receiveShadow = true;
    scene.add(ground);
  }

  /* =======================================================================
     8. GEOMETRY BUILDERS
     ======================================================================= */

  /* 01 — chassis */
  function buildChassis() {
    var g = new THREE.Group();
    g.add(M(roundedBoxGeo(BW, BH, BD, BODY_R, 3, 8), shellMat));
    /* lens recess + trim */
    g.add(M(new THREE.CylinderGeometry(1.62, 1.62, 0.16, 48), MAT.lensRing, LENS_X, LENS_Y, FRONT_Z + 0.03, Math.PI / 2, 0, 0));
    g.add(M(new THREE.TorusGeometry(1.565, 0.022, 8, 64), MAT.steel, LENS_X, LENS_Y, FRONT_Z + 0.075));
    /* screen bezels (set back so screen glass sits in front, fully visible) */
    g.add(M(roundedBoxGeo(2.62, 2.62, 0.12, 0.28, 2, 5), MAT.lensRing, FSCR_X, FSCR_Y, FRONT_Z - 0.02));
    g.add(M(roundedBoxGeo(5.16, 2.96, 0.12, 0.28, 2, 5), MAT.lensRing, 0, 0, REAR_Z + 0.03));
    /* grips */
    var gripMat = new THREE.MeshStandardMaterial({ color: 0x111418, metalness: 0.05, roughness: 0.9, map: gripTex(), envMapIntensity: 0.4 });
    g.add(M(roundedBoxGeo(0.1, BH - 0.7, BD - 0.9, 0.05, 1, 4), gripMat, -BW / 2 - 0.012, 0, 0));
    g.add(M(roundedBoxGeo(0.1, BH - 0.7, BD - 0.9, 0.05, 1, 4), gripMat, BW / 2 + 0.012, 0, 0));
    /* top plate + bottom interface */
    g.add(M(new THREE.BoxGeometry(4.0, 0.08, 1.5), plateMat, 0.6, BH / 2 + 0.01, 0.35));
    g.add(M(new THREE.BoxGeometry(4.6, 0.1, 2.6), MAT.darkSteel, 0, -BH / 2 - 0.01, 0));
    /* battery bay (recessed cavity look, right side) */
    g.add(M(new THREE.BoxGeometry(1.3, BH - 0.9, BD - 0.7), MAT.rubber, BW / 2 - 0.70, 0, 0));
    /* USB-C (left) */
    g.add(M(new THREE.BoxGeometry(0.08, 0.5, 1.0), MAT.darkSteel, -BW / 2 - 0.03, -0.4, 0));
    g.add(M(new THREE.BoxGeometry(0.06, 0.3, 0.78), MAT.rubber, -BW / 2 - 0.05, -0.4, 0));
    /* mics */
    var micGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.06, 12);
    g.add(M(micGeo, MAT.rubber, -2.6, BH / 2 - 0.3, FRONT_Z + 0.012, Math.PI / 2, 0, 0));
    g.add(M(micGeo, MAT.rubber, 2.9, BH / 2 - 0.3, FRONT_Z + 0.012, Math.PI / 2, 0, 0));
    g.add(M(micGeo, MAT.rubber, 0, BH / 2 - 0.25, REAR_Z - 0.012, Math.PI / 2, 0, 0));
    /* branding decal */
    var decalMat = new THREE.MeshBasicMaterial({ map: bodyDecalTex(), transparent: true, opacity: 0.92, depthWrite: false });
    var decal = M(new THREE.PlaneGeometry(2.6, 0.65), decalMat, 1.2, -1.72, FRONT_Z + 0.008);
    decal.castShadow = false; decal.receiveShadow = false;
    g.add(decal);
    /* status LED */
    var led = M(new THREE.BoxGeometry(0.16, 0.16, 0.06), MAT.led, 2.9, 1.5, FRONT_Z + 0.02);
    led.castShadow = false;
    g.add(led);
    /* internal ribs (visible through faded shell) */
    g.add(M(new THREE.BoxGeometry(0.12, BH - 1.0, 0.5), MAT.bodyLight, -2.9, 0, 0));
    g.add(M(new THREE.BoxGeometry(0.12, BH - 1.0, 0.5), MAT.bodyLight, 0.4, 0, -0.6));
    g.add(M(new THREE.BoxGeometry(BW - 1.4, 0.12, 0.5), MAT.bodyLight, 0, 1.5, -0.6));
    g.add(M(new THREE.BoxGeometry(BW - 1.4, 0.12, 0.5), MAT.bodyLight, 0, -1.5, -0.6));
    return g;
  }

  /* 02 — lens */
  function buildLens() {
    var g = new THREE.Group();
    var ringMat = new THREE.MeshStandardMaterial({ color: 0x15181c, metalness: 0.88, roughness: 0.25, map: lensRingTex(), envMapIntensity: 1.4 });
    g.add(M(new THREE.CylinderGeometry(1.5, 1.46, 0.5, 64), ringMat, 0, 0, 0.1, Math.PI / 2, 0, 0));
    g.add(M(new THREE.TorusGeometry(1.47, 0.055, 8, 64), MAT.darkSteel, 0, 0, 0.3));
    g.add(M(new THREE.CylinderGeometry(1.34, 1.34, 0.34, 48), MAT.lensRing, 0, 0, 0.02, Math.PI / 2, 0, 0));
    g.add(M(new THREE.CylinderGeometry(1.18, 1.22, 0.2, 48), MAT.lensInner, 0, 0, 0.2, Math.PI / 2, 0, 0));
    g.add(M(new THREE.TorusGeometry(1.05, 0.045, 8, 48), MAT.accentDim, 0, 0, 0.29));
    /* front glass dome */
    var Rs = 2.7, rimR = 1.14, thMax = Math.asin(rimR / Rs);
    var domeGeo = new THREE.SphereGeometry(Rs, 56, 22, 0, Math.PI * 2, 0, thMax);
    domeGeo.rotateX(Math.PI / 2);
    domeGeo.translate(0, 0, -Rs * Math.cos(thMax));
    g.add(M(domeGeo, MAT.lensGlass, 0, 0, 0.3));
    /* inner element */
    var Ri = 1.9, rimI = 0.78, thI = Math.asin(rimI / Ri);
    var innerGeo = new THREE.SphereGeometry(Ri, 40, 16, 0, Math.PI * 2, 0, thI);
    innerGeo.rotateX(Math.PI / 2);
    innerGeo.translate(0, 0, -Ri * Math.cos(thI));
    var innerMat = new THREE.MeshPhysicalMaterial({ color: 0x0a1830, metalness: 0, roughness: 0.05, envMapIntensity: 2.4, clearcoat: 1, transparent: true, opacity: 0.85 });
    g.add(M(innerGeo, innerMat, 0, 0, 0.16));
    /* rear barrels */
    g.add(M(new THREE.CylinderGeometry(1.1, 1.25, 0.7, 40), MAT.lensRing, 0, 0, -0.42, Math.PI / 2, 0, 0));
    g.add(M(new THREE.CylinderGeometry(0.95, 0.95, 0.3, 32), MAT.darkSteel, 0, 0, -0.85, Math.PI / 2, 0, 0));
    /* protective cover ring */
    g.add(M(new THREE.TorusGeometry(1.42, 0.085, 10, 56), MAT.bodyMid, 0, 0, 0.42));
    return g;
  }

  /* 03 — sensor */
  function buildSensor() {
    var g = new THREE.Group();
    g.add(M(roundedBoxGeo(1.95, 1.95, 0.55, 0.12, 2, 4), MAT.darkSteel));
    var dieMat = new THREE.MeshPhysicalMaterial({ color: 0x14324a, metalness: 0.5, roughness: 0.12, envMapIntensity: 2.2, clearcoat: 0.8 });
    g.add(M(new THREE.BoxGeometry(1.15, 1.15, 0.08), dieMat, 0, 0, 0.3));
    for (var i = 0; i < 12; i++) {
      var a = (i / 12) * Math.PI * 2;
      var w = M(new THREE.BoxGeometry(0.03, 0.03, 0.3), MAT.gold, Math.cos(a) * 0.72, Math.sin(a) * 0.72, 0.26);
      w.rotation.z = a;
      g.add(w);
    }
    var irMat = new THREE.MeshPhysicalMaterial({ color: 0x1a2a44, metalness: 0, roughness: 0.04, envMapIntensity: 2.6, clearcoat: 1, transparent: true, opacity: 0.5 });
    g.add(M(new THREE.BoxGeometry(1.3, 1.3, 0.05), irMat, 0, 0, 0.35));
    g.add(M(new THREE.BoxGeometry(1.4, 0.3, 0.16), MAT.chip, 0, -0.75, -0.2));
    g.add(M(new THREE.BoxGeometry(1.2, 0.16, 0.06), MAT.gold, 0, -0.75, -0.3));
    g.add(M(new THREE.BoxGeometry(0.3, 0.18, 0.5), MAT.steel, -1.05, 0.7, -0.05));
    g.add(M(new THREE.BoxGeometry(0.3, 0.18, 0.5), MAT.steel, 1.05, 0.7, -0.05));
    g.add(M(new THREE.TorusGeometry(0.92, 0.055, 8, 40), MAT.copper, 0, 0, -0.18));
    return g;
  }

  /* 04 — front screen */
  function buildFrontScreen() {
    var g = new THREE.Group();
    g.add(M(roundedBoxGeo(2.5, 2.5, 0.3, 0.24, 2, 5), MAT.lensRing));
    var uiTex = screenTex(true);
    var panelMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, map: uiTex, emissive: 0xffffff, emissiveMap: uiTex,
      emissiveIntensity: 0.9, roughness: 0.35, metalness: 0
    });
    var panel = M(new THREE.PlaneGeometry(2.18, 2.18), panelMat, 0, 0, 0.16);
    panel.castShadow = false;
    panel.userData.uiPanel = true;
    g.add(panel);
    g.add(M(roundedBoxGeo(2.42, 2.42, 0.08, 0.22, 2, 5), MAT.screenGlass, 0, 0, 0.19));
    g.add(M(new THREE.BoxGeometry(1.1, 0.5, 0.06), MAT.accentDim, 0, -1.05, -0.12));
    g.add(M(new THREE.BoxGeometry(0.9, 0.3, 0.04), MAT.gold, 0, -1.05, -0.17));
    return g;
  }

  /* 05 — rear screen */
  function buildRearScreen() {
    var g = new THREE.Group();
    g.add(M(roundedBoxGeo(5.0, 2.82, 0.3, 0.26, 2, 5), MAT.lensRing));
    var uiTex = screenTex(false);
    var panelMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, map: uiTex, emissive: 0xffffff, emissiveMap: uiTex,
      emissiveIntensity: 0.9, roughness: 0.35, metalness: 0
    });
    var panel = M(new THREE.PlaneGeometry(4.56, 2.5), panelMat, 0, 0, -0.16);
    panel.rotation.y = Math.PI;
    panel.castShadow = false;
    panel.userData.uiPanel = true;
    g.add(panel);
    g.add(M(roundedBoxGeo(4.9, 2.74, 0.08, 0.24, 2, 5), MAT.screenGlass, 0, 0, -0.19));
    g.add(M(new THREE.BoxGeometry(1.6, 0.5, 0.06), MAT.accentDim, 0, 1.18, 0.12));
    g.add(M(new THREE.BoxGeometry(1.3, 0.3, 0.04), MAT.gold, 0, 1.18, 0.17));
    return g;
  }

  /* 06 — PCB */
  function buildPCB() {
    var g = new THREE.Group();
    var boardMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: pcbTex(), roughness: 0.6, metalness: 0.2, envMapIntensity: 0.7 });
    g.add(M(roundedBoxGeo(4.8, 3.3, 0.14, 0.1, 1, 4), boardMat));
    /* SoC + shield */
    g.add(M(new THREE.BoxGeometry(1.5, 1.5, 0.3), MAT.chip, -0.6, 0.3, 0.18));
    g.add(M(new THREE.BoxGeometry(1.3, 1.3, 0.06), MAT.chipTop, -0.6, 0.3, 0.36));
    g.add(M(new THREE.BoxGeometry(1.58, 0.06, 0.34), MAT.steel, -0.6, 1.06, 0.18));
    g.add(M(new THREE.BoxGeometry(1.58, 0.06, 0.34), MAT.steel, -0.6, -0.46, 0.18));
    g.add(M(new THREE.BoxGeometry(0.9, 0.9, 0.22), MAT.chip, 1.4, 0.6, 0.16));
    g.add(M(new THREE.BoxGeometry(1.1, 0.8, 0.18), MAT.chipTop, 1.3, -0.7, 0.14));
    /* microSD slot */
    g.add(M(new THREE.BoxGeometry(1.3, 0.2, 0.5), MAT.darkSteel, -1.6, -1.42, 0.1));
    g.add(M(new THREE.BoxGeometry(1.1, 0.08, 0.4), MAT.rubber, -1.6, -1.42, 0.36));
    /* USB-C */
    g.add(M(new THREE.BoxGeometry(0.9, 0.34, 0.4), MAT.steel, 1.95, -1.35, 0.1));
    g.add(M(new THREE.BoxGeometry(0.7, 0.18, 0.3), MAT.rubber, 1.95, -1.35, 0.3));
    /* MEMS mics */
    var micCan = new THREE.CylinderGeometry(0.16, 0.16, 0.14, 16);
    g.add(M(micCan, MAT.steel, -2.1, 1.15, 0.14, Math.PI / 2, 0, 0));
    g.add(M(micCan, MAT.steel, 2.1, 1.15, 0.14, Math.PI / 2, 0, 0));
    g.add(M(micCan, MAT.steel, 0.2, -1.45, 0.14, Math.PI / 2, 0, 0));
    /* passives */
    var capGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.28, 12);
    var pos = [[-2.2, 0.2], [-2.2, -0.4], [2.2, 0.1], [0.6, 1.25], [1.8, 1.25]];
    for (var i = 0; i < pos.length; i++) g.add(M(capGeo, MAT.chipTop, pos[i][0], pos[i][1], 0.19, Math.PI / 2, 0, 0));
    var padGeo = new THREE.BoxGeometry(0.14, 0.14, 0.04);
    for (var p2 = 0; p2 < 8; p2++) g.add(M(padGeo, MAT.gold, -2.2 + p2 * 0.3, -1.58, 0.09));
    g.add(M(new THREE.BoxGeometry(1.8, 0.24, 0.24), MAT.white, 0.4, 1.52, 0.12));
    return g;
  }

  /* 07 — battery (cell + integrated door) */
  function buildBattery() {
    var g = new THREE.Group();
    var faceMat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: batteryTex(), roughness: 0.5, metalness: 0.15, envMapIntensity: 0.8 });
    g.add(M(roundedBoxGeo(1.05, 3.42, 2.55, 0.1, 2, 4), MAT.batteryBody));
    var label = M(new THREE.PlaneGeometry(2.38, 3.16), faceMat, 0.63, 0, 0);
    label.rotation.y = Math.PI / 2;
    label.castShadow = false;
    g.add(label);
    g.add(M(new THREE.BoxGeometry(0.08, 1.0, 1.6), MAT.darkSteel, -0.55, -0.9, 0));
    for (var i = 0; i < 4; i++) g.add(M(new THREE.BoxGeometry(0.1, 0.16, 0.44), MAT.gold, -0.6, -0.9, -0.56 + i * 0.38));
    g.add(M(new THREE.BoxGeometry(0.16, 0.5, 0.7), MAT.accent, 0.5, 1.4, 0));
    g.add(M(roundedBoxGeo(1.0, 3.24, 2.4, 0.08, 1, 4), MAT.rubber, -0.12, 0, 0));
    return g;
  }

  /* 08 — magnetic mount */
  function buildMount() {
    var g = new THREE.Group();
    g.add(M(roundedBoxGeo(4.8, 0.5, 2.8, 0.16, 2, 5), MAT.darkSteel));
    var magGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.16, 24);
    g.add(M(magGeo, MAT.magnet, -1.3, 0.26, 0));
    g.add(M(magGeo, MAT.magnet, 1.3, 0.26, 0));
    var magGeo2 = new THREE.CylinderGeometry(0.3, 0.3, 0.16, 20);
    g.add(M(magGeo2, MAT.magnet, 0, 0.26, 0.9));
    g.add(M(magGeo2, MAT.magnet, 0, 0.26, -0.9));
    g.add(M(new THREE.CylinderGeometry(0.12, 0.12, 0.4, 12), MAT.steel, -2.1, 0.1, 0.8, Math.PI / 2, 0, 0));
    g.add(M(new THREE.CylinderGeometry(0.12, 0.12, 0.4, 12), MAT.steel, 2.1, 0.1, 0.8, Math.PI / 2, 0, 0));
    g.add(M(new THREE.BoxGeometry(1.4, 0.18, 0.5), MAT.accent, 0, -0.28, -1.1));
    g.add(M(new THREE.BoxGeometry(4.2, 0.06, 0.3), MAT.rubber, 0, 0.27, 1.0));
    g.add(M(new THREE.BoxGeometry(4.2, 0.06, 0.3), MAT.rubber, 0, 0.27, -0.4));
    return g;
  }

  /* 09 — buttons */
  function buildButtons() {
    var g = new THREE.Group();
    /* shutter */
    g.add(M(new THREE.CylinderGeometry(0.62, 0.66, 0.22, 32), MAT.darkSteel, -0.9, 0, 0.55));
    g.add(M(new THREE.CylinderGeometry(0.55, 0.55, 0.14, 32), MAT.bodyMid, -0.9, 0.13, 0.55));
    g.add(M(new THREE.TorusGeometry(0.58, 0.045, 8, 40), MAT.accent, -0.9, 0.2, 0.55, Math.PI / 2, 0, 0));
    /* power */
    g.add(M(new THREE.CylinderGeometry(0.34, 0.36, 0.18, 24), MAT.darkSteel, 0.7, 0, 0.55));
    g.add(M(new THREE.CylinderGeometry(0.28, 0.28, 0.1, 24), MAT.bodyMid, 0.7, 0.1, 0.55));
    g.add(M(new THREE.TorusGeometry(0.3, 0.03, 6, 28), MAT.steel, 0.7, 0.15, 0.55, Math.PI / 2, 0, 0));
    /* QS */
    g.add(M(new THREE.CylinderGeometry(0.3, 0.32, 0.16, 24), MAT.darkSteel, 1.7, 0, 0.55));
    g.add(M(new THREE.CylinderGeometry(0.24, 0.24, 0.09, 24), MAT.bodyMid, 1.7, 0.09, 0.55));
    /* seals */
    g.add(M(new THREE.CylinderGeometry(0.5, 0.5, 0.06, 24), MAT.rubber, -0.9, -0.13, 0.55));
    g.add(M(new THREE.CylinderGeometry(0.3, 0.3, 0.06, 20), MAT.rubber, 0.7, -0.11, 0.55));
    g.add(M(new THREE.CylinderGeometry(0.26, 0.26, 0.06, 20), MAT.rubber, 1.7, -0.1, 0.55));
    /* bracket */
    g.add(M(new THREE.BoxGeometry(3.6, 0.1, 1.0), MAT.bodyLight, 0.3, -0.16, 0.55));
    return g;
  }

  var BUILDERS = {
    chassis: buildChassis, lens: buildLens, sensor: buildSensor,
    frontScreen: buildFrontScreen, rearScreen: buildRearScreen,
    pcb: buildPCB, battery: buildBattery, mount: buildMount, buttons: buildButtons
  };

  /* =======================================================================
     9. GLOW SHELL
     ======================================================================= */
  function createGlow(group, colorHex) {
    var glow = group.clone();
    var mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(colorHex), side: THREE.BackSide, transparent: true,
      opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false
    });
    glow.traverse(function (o) {
      if (o.isMesh) { o.material = mat; o.castShadow = false; o.receiveShadow = false; o.userData.isGlow = true; }
    });
    /* clone() copies the source transform — reset it, the shell must sit
       exactly on top of the part (it is parented to the part group) */
    glow.position.set(0, 0, 0);
    glow.rotation.set(0, 0, 0);
    glow.scale.setScalar(1.035);
    glow.visible = false;
    glow.userData.isGlow = true;
    group.add(glow);
    return { group: glow, material: mat, current: 0 };
  }

  /* =======================================================================
     10. ORBIT CONTROLS
     ======================================================================= */
  function OrbitController(cam, el) {
    this.camera = cam; this.dom = el;
    this.target = new THREE.Vector3();
    this.targetGoal = new THREE.Vector3();
    this.sph = new THREE.Spherical(CAM_HOME.radius, CAM_HOME.phi, CAM_HOME.theta);
    this.sphGoal = new THREE.Spherical(CAM_HOME.radius, CAM_HOME.phi, CAM_HOME.theta);
    this.damping = 0.085;
    this.rotSpeed = 0.0052;
    this.minR = 6.5; this.maxR = 30;
    this.minPhi = 0.18; this.maxPhi = Math.PI - 0.18;
    this.autoRotate = false; this.autoSpeed = 0.0016;
    this.dragging = false;
    this._ptrs = new Map();
    this._moved = 0; this._pinch = 0;
    this._downTime = 0; this._downPos = { x: 0, y: 0 };
    this.onTap = null; this.onHoverMove = null; this.onHoverEnd = null;
    var self = this;

    el.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button > 1) return;
      try { el.setPointerCapture(e.pointerId); } catch (err) {}
      self._ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      self.dragging = true; self._moved = 0;
      self._downTime = performance.now();
      self._downPos = { x: e.clientX, y: e.clientY };
      el.classList.add('is-dragging');
      if (self._ptrs.size === 2) {
        var pts = Array.from(self._ptrs.values());
        self._pinch = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      }
    });
    el.addEventListener('pointermove', function (e) {
      pointerInside = true; pointerX = e.clientX; pointerY = e.clientY; hoverDirty = true;
      if (self._ptrs.has(e.pointerId)) {
        var prev = self._ptrs.get(e.pointerId);
        var dx = e.clientX - prev.x, dy = e.clientY - prev.y;
        self._ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
        self._moved += Math.abs(dx) + Math.abs(dy);
        if (self._ptrs.size === 1) {
          self.sphGoal.theta -= dx * self.rotSpeed;
          self.sphGoal.phi = clamp(self.sphGoal.phi - dy * self.rotSpeed, self.minPhi, self.maxPhi);
        } else if (self._ptrs.size === 2) {
          var pts = Array.from(self._ptrs.values());
          var dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
          if (self._pinch > 0 && dist > 0) {
            self.sphGoal.radius = clamp(self.sphGoal.radius * (self._pinch / dist), self.minR, self.maxR);
          }
          self._pinch = dist;
        }
      }
    });
    function endPointer(e) {
      if (!self._ptrs.has(e.pointerId)) return;
      self._ptrs.delete(e.pointerId);
      if (self._ptrs.size < 2) self._pinch = 0;
      if (self._ptrs.size === 0) {
        self.dragging = false;
        el.classList.remove('is-dragging');
        var dt = performance.now() - self._downTime;
        var dist = Math.hypot(e.clientX - self._downPos.x, e.clientY - self._downPos.y);
        if (dist < 7 && dt < 450 && self.onTap) self.onTap(e.clientX, e.clientY);
      }
    }
    el.addEventListener('pointerup', endPointer);
    el.addEventListener('pointercancel', endPointer);
    el.addEventListener('pointerleave', function (e) {
      pointerInside = false;
      if (self.onHoverEnd) self.onHoverEnd();
      if (self._ptrs.has(e.pointerId)) endPointer(e);
    });
    el.addEventListener('wheel', function (e) {
      e.preventDefault();
      var d = e.deltaY > 0 ? 1.09 : 0.92;
      self.sphGoal.radius = clamp(self.sphGoal.radius * d, self.minR, self.maxR);
    }, { passive: false });
  }
  OrbitController.prototype.update = function () {
    if (this.autoRotate && !this.dragging) this.sphGoal.theta += this.autoSpeed;
    this.sph.radius = lerp(this.sph.radius, this.sphGoal.radius, this.damping);
    this.sph.phi = lerp(this.sph.phi, this.sphGoal.phi, this.damping);
    this.sph.theta = lerp(this.sph.theta, this.sphGoal.theta, this.damping);
    this.target.lerp(this.targetGoal, this.damping);
    this.camera.position.setFromSpherical(this.sph).add(this.target);
    this.camera.lookAt(this.target);
  };
  OrbitController.prototype.reset = function () {
    this.sphGoal.set(CAM_HOME.radius, CAM_HOME.phi, CAM_HOME.theta);
    this.targetGoal.set(0, 0, 0);
  };

  /* =======================================================================
     11. INIT
     ======================================================================= */
  function initRenderer() {
    renderer = new THREE.WebGLRenderer({
      canvas: dom.scene, antialias: true, alpha: true, powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 120);
    modelGroup = new THREE.Group();
    scene.add(modelGroup);

    controls = new OrbitController(camera, dom.scene);
    controls.autoRotate = false;
    /* intro convergence */
    controls.sph.theta = controls.sphGoal.theta - (reducedMotion ? 0 : 0.75);
    controls.sph.radius = controls.sphGoal.radius + (reducedMotion ? 0 : 6.5);
  }

  function assemblePart(p) {
    var g = BUILDERS[p.id]();
    var base = BASE_POS[p.id];
    g.position.set(base[0], base[1], base[2]);
    g.userData.partId = p.id;
    g.userData.basePos = new THREE.Vector3(base[0], base[1], base[2]);
    g.userData.explodeOffset = new THREE.Vector3(p.explode[0], p.explode[1], p.explode[2]);
    g.userData.labelAnchor = new THREE.Vector3(p.anchor[0], p.anchor[1], p.anchor[2]);
    g.traverse(function (o) { if (o.isMesh) { o.userData.partId = p.id; pickMeshes.push(o); } });
    glowData[p.id] = createGlow(g, p.color);
    modelGroup.add(g);
    partGroups[p.id] = g;
  }

  /* =======================================================================
     12. CALLOUTS (HTML cards + SVG leaders)
     ======================================================================= */
  function buildCallouts() {
    var NS = 'http://www.w3.org/2000/svg';
    PARTS.forEach(function (p) {
      var grp = document.createElementNS(NS, 'g');
      grp.setAttribute('class', 'leader-group');
      grp.style.color = p.color;
      grp.style.opacity = '0';
      var path = document.createElementNS(NS, 'path');
      path.setAttribute('class', 'leader-path');
      path.setAttribute('stroke', p.color);
      var dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('class', 'leader-dot');
      dot.setAttribute('r', '3');
      dot.setAttribute('fill', p.color);
      grp.appendChild(path); grp.appendChild(dot);
      dom.leaderSvg.appendChild(grp);

      var el = document.createElement('div');
      el.className = 'callout';
      el.style.setProperty('--accent', p.color);
      el.style.opacity = '0';
      el.style.pointerEvents = 'none';
      el.innerHTML =
        '<span class="callout-index">' + p.idx + '</span>' +
        '<span class="callout-copy"><b>' + p.name + '</b><small>' + p.en + ' · <em>' + p.coSpec + '</em></small></span>' +
        '<span class="callout-ping"></span>';
      el.addEventListener('click', function (ev) { ev.stopPropagation(); selectPart(p.id, false); });
      dom.callouts.appendChild(el);
      calloutEls[p.id] = { card: el, group: grp, path: path, dot: dot };
    });
  }

  function hideCallout(ce) {
    ce.card.style.opacity = '0';
    ce.card.style.pointerEvents = 'none';
    ce.group.style.opacity = '0';
  }

  function updateCallouts() {
    var show = labelsVisible && bootDone && explodeProgress > 0.1;
    dom.labelsLayer.classList.toggle('off', !labelsVisible);
    var W = window.innerWidth, H = window.innerHeight;
    for (var i = 0; i < PARTS.length; i++) {
      var p = PARTS[i], ce = calloutEls[p.id];
      if (!ce) continue;
      if (!show) { hideCallout(ce); continue; }
      var group = partGroups[p.id];
      _v3a.copy(group.userData.labelAnchor);
      group.localToWorld(_v3a);
      _v3a.project(camera);
      if (_v3a.z > 1) { hideCallout(ce); continue; }
      var sx = (_v3a.x * 0.5 + 0.5) * W;
      var sy = (-_v3a.y * 0.5 + 0.5) * H;
      if (sx < -40 || sx > W + 40 || sy < -40 || sy > H + 40) { hideCallout(ce); continue; }

      if (!ce.cw) { ce.cw = ce.card.offsetWidth || 188; ce.chh = ce.card.offsetHeight || 46; }
      var cw = ce.cw, chh = ce.chh;
      var dir = p.label.dir, gap = 30;
      var cx = dir > 0 ? sx + gap : sx - gap - cw;
      var cy = sy + p.label.oy - chh / 2;
      /* keep cards inside the stage area between the two panels */
      var bandL = W > 980 ? 336 : 12;
      var bandR = W > 980 ? W - 396 : W - 12;
      cx = clamp(cx, bandL, Math.max(bandL, bandR - cw));
      cy = clamp(cy, 100, H - chh - 116);

      ce.card.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
      ce.card.style.opacity = '1';
      ce.card.style.pointerEvents = 'auto';

      var edgeX = dir > 0 ? cx : cx + cw;
      var edgeY = cy + chh / 2;
      var kx = edgeX - 20 * dir;
      ce.path.setAttribute('d',
        'M ' + sx.toFixed(1) + ' ' + sy.toFixed(1) +
        ' L ' + kx.toFixed(1) + ' ' + sy.toFixed(1) +
        ' L ' + edgeX.toFixed(1) + ' ' + edgeY.toFixed(1));
      ce.dot.setAttribute('cx', sx.toFixed(1));
      ce.dot.setAttribute('cy', sy.toFixed(1));
      ce.group.style.opacity = '1';

      var act = (selectedId === p.id || hoveredId === p.id);
      ce.card.classList.toggle('active', act);
      ce.group.classList.toggle('active', act);
    }
  }

  /* =======================================================================
     13. UI
     ======================================================================= */
  var progressFill, progressValue, yawSpan, featuresP, noteP, toastTimer;

  function buildPartsList() {
    var frag = document.createDocumentFragment();
    PARTS.forEach(function (p) {
      var btn = document.createElement('button');
      btn.className = 'part-row';
      btn.type = 'button';
      btn.dataset.part = p.id;
      btn.style.setProperty('--row-accent', p.color);
      btn.innerHTML =
        '<span class="row-idx">' + p.idx + '</span>' +
        '<span class="row-copy"><span class="row-name">' + p.name + '</span>' +
        '<span class="row-en">' + p.en + '</span></span>' +
        '<span class="row-state"></span>';
      btn.addEventListener('click', function () {
        selectPart(p.id, true);
        closeSheets();
      });
      frag.appendChild(btn);
      rowEls[p.id] = btn;
    });
    dom.partsList.appendChild(frag);
  }

  function specCellHTML(s) {
    return '<div class="spec-cell"><span>' + s[0] + '</span><strong>' + s[1] +
      (s[2] ? '<em> ' + s[2] + '</em>' : '') + '</strong></div>';
  }

  function renderInspector(p) {
    var sc = dom.inspectorScroll;
    sc.classList.remove('swap');
    void sc.offsetWidth;
    sc.classList.add('swap');
    if (!p) {
      dom.detailNum.textContent = '—';
      dom.detailCategory.textContent = 'STANDBY / 待选择';
      dom.detailTitle.textContent = '未选择模块';
      dom.detailEn.textContent = 'SELECT A MODULE TO INSPECT';
      dom.detailSpecs.innerHTML = '';
      dom.detailDesc.textContent = '点击 3D 模型部件、左侧清单条目或场景标注，查看该模块的结构说明、关键参数与装配关系。';
      dom.detailAssembly.textContent = 'A4——';
      featuresP.textContent = '';
      noteP.textContent = '';
      return;
    }
    dom.detailNum.textContent = p.idx;
    dom.detailCategory.textContent = p.cat;
    dom.detailTitle.textContent = p.name;
    dom.detailEn.textContent = p.en;
    dom.detailSpecs.innerHTML = p.specs.map(specCellHTML).join('');
    dom.detailDesc.textContent = p.desc;
    dom.detailAssembly.textContent = p.code;
    featuresP.textContent = '▸ ' + p.features.join('  ▸ ');
    noteP.textContent = '装配关系 // ' + p.note;
  }

  function syncRows() {
    PARTS.forEach(function (p) {
      var btn = rowEls[p.id];
      if (btn) btn.classList.toggle('active', selectedId === p.id);
    });
  }

  function syncDock() {
    var exploded = explodeTarget > 0.5;
    dom.explodeBtnText.textContent = exploded ? '组装复位' : '一键拆解';
    dom.labelsBtn.classList.toggle('active', labelsVisible);
    dom.rotateBtn.classList.toggle('active', autoRotate);
  }

  var lastPct = -1, lastIntegrity = -1;
  function updateReadouts() {
    var pct = Math.round(explodeProgress * 100);
    if (pct !== lastPct) {
      lastPct = pct;
      dom.explodeVal.innerHTML = String(pct).padStart(2, '0') + '<em>%</em>';
      if (document.activeElement !== dom.explodeRange) dom.explodeRange.value = pct;
      dom.explodeRange.style.setProperty('--fill', pct + '%');
    }
    var integrity = Math.round((1 - explodeProgress) * 100);
    if (integrity !== lastIntegrity) {
      lastIntegrity = integrity;
      if (progressFill) progressFill.style.width = integrity + '%';
      if (progressValue) progressValue.textContent = integrity + '%';
    }
  }

  function updateYaw() {
    if (!yawSpan) return;
    var deg = ((controls.sph.theta * 180 / Math.PI) % 360 + 360) % 360;
    yawSpan.textContent = 'YAW ' + deg.toFixed(1).padStart(5, '0') + '°';
  }

  function toast(msg) {
    dom.toast.textContent = msg;
    dom.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { dom.toast.classList.remove('show'); }, 1900);
  }

  function openSheet(panel) {
    closeSheets();
    panel.classList.add('open');
    dom.sheetBackdrop.classList.add('open');
  }
  function closeSheets() {
    dom.leftPanel.classList.remove('open');
    dom.rightPanel.classList.remove('open');
    dom.sheetBackdrop.classList.remove('open');
  }

  function updateChip(p) {
    if (!p) return;
    dom.mobilePartChip.querySelector('span').textContent = p.idx;
    dom.mobilePartChip.querySelector('b').textContent = p.name;
  }

  /* =======================================================================
     14. SELECTION / HOVER
     ======================================================================= */
  function selectPart(id, andExplode) {
    var p = PART_BY_ID[id];
    if (!p) return;
    var changed = selectedId !== id;
    selectedId = id;
    if (andExplode && explodeTarget < 0.99) {
      explodeTarget = 1;
      if (controls.sphGoal.radius < 19) controls.sphGoal.radius = 20;
    }
    if (explodeProgress > 0.35) {
      var g = partGroups[id];
      _v3b.copy(g.userData.basePos).addScaledVector(g.userData.explodeOffset, clamp(explodeProgress, 0, 1));
      controls.targetGoal.copy(_v3b.multiplyScalar(0.55));
    } else {
      controls.targetGoal.set(0, 0, 0);
    }
    selectLight.color.set(p.color);
    selectLight.visible = true;
    if (changed) renderInspector(p);
    updateChip(p);
    syncRows();
    syncDock();
  }

  function clearSelection() {
    if (selectedId === null) return;
    selectedId = null;
    selectLight.visible = false;
    renderInspector(null);
    syncRows();
    controls.targetGoal.set(0, 0, 0);
  }

  function setHover(id) {
    if (hoveredId === id) return;
    hoveredId = id;
    dom.scene.classList.toggle('is-hovering', !!id);
    if (id) {
      var p = PART_BY_ID[id];
      dom.cursorTip.querySelector('.cursor-tip-idx').textContent = p.idx;
      dom.cursorTip.querySelector('b').textContent = p.name;
      dom.cursorTip.classList.add('show');
    } else {
      dom.cursorTip.classList.remove('show');
    }
  }

  function pickAt(cx, cy) {
    var rect = dom.scene.getBoundingClientRect();
    pointerNDC.x = ((cx - rect.left) / rect.width) * 2 - 1;
    pointerNDC.y = -((cy - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointerNDC, camera);
    var hits = raycaster.intersectObjects(pickMeshes, false);
    for (var i = 0; i < hits.length; i++) {
      var o = hits[i].object;
      if (o.userData.isGlow || !o.userData.partId) continue;
      return o.userData.partId;
    }
    return null;
  }

  /* =======================================================================
     15. EXPLODE + GLOW UPDATES
     ======================================================================= */
  function updateExplode() {
    var diff = explodeTarget - explodeProgress;
    if (Math.abs(diff) > 0.0004) explodeProgress += diff * (reducedMotion ? 1 : 0.07);
    else explodeProgress = explodeTarget;

    for (var i = 0; i < PARTS.length; i++) {
      var p = PARTS[i], g = partGroups[p.id];
      var t = clamp((explodeProgress - p.delay) / p.dur, 0, 1);
      var e = easeOutCubic(t);
      g.position.copy(g.userData.basePos).addScaledVector(g.userData.explodeOffset, e);
      if (p.id === 'lens') g.rotation.y = e * 0.18;
      else if (p.id === 'battery') { g.rotation.y = e * -1.05; g.rotation.z = e * -0.05; }
      else if (p.id === 'pcb') g.rotation.x = e * 0.05;
      else if (p.id === 'mount') g.rotation.x = e * -0.1;
    }
    /* chassis shell fade */
    var fade = smoothstep(0.55, 0.95, explodeProgress);
    var o = lerp(1, 0.34, fade);
    if (Math.abs(shellMat.opacity - o) > 0.004) {
      shellMat.opacity = o;
      plateMat.opacity = lerp(1, 0.55, fade);
    }
    updateReadouts();
  }

  function updateGlow() {
    for (var i = 0; i < PARTS.length; i++) {
      var p = PARTS[i], gd = glowData[p.id];
      if (!gd) continue;
      var target = selectedId === p.id ? 1 : (hoveredId === p.id ? 0.55 : 0);
      gd.current += (target - gd.current) * 0.13;
      if (gd.current < 0.012) { gd.group.visible = false; gd.material.opacity = 0; }
      else { gd.group.visible = true; gd.material.opacity = gd.current * 0.42; }
    }
    if (selectLight.visible && selectedId) {
      partGroups[selectedId].getWorldPosition(_v3a);
      selectLight.position.lerp(_v3a, 0.2);
      selectLight.intensity = lerp(selectLight.intensity, 16, 0.1);
    } else {
      selectLight.intensity = lerp(selectLight.intensity, 0, 0.15);
      if (selectLight.intensity < 0.05) selectLight.visible = false;
    }
  }

  /* =======================================================================
     16. EVENTS
     ======================================================================= */
  function toggleExplode(force) {
    explodeTarget = force !== undefined ? force : (explodeTarget > 0.5 ? 0 : 1);
    if (explodeTarget > 0.5) {
      if (controls.sphGoal.radius < 19) controls.sphGoal.radius = 21;
      controls.targetGoal.set(1.2, 0, 0.4);
      toast('拆解序列启动 · 9 模块分层分离');
    } else {
      controls.sphGoal.radius = 13;
      controls.targetGoal.set(0, 0, 0);
      toast('整机复位 · ASSEMBLED');
    }
    syncDock();
  }

  function wireEvents() {
    controls.onTap = function (cx, cy) {
      var id = pickAt(cx, cy);
      if (id) selectPart(id, true);
      else clearSelection();
    };
    controls.onHoverEnd = function () { setHover(null); };

    dom.explodeBtn.addEventListener('click', function () { toggleExplode(); });
    dom.explodeRange.addEventListener('input', function () {
      explodeTarget = explodeProgress = this.value / 100;
      syncDock();
    });
    dom.resetBtn.addEventListener('click', function () {
      controls.reset();
      toggleExplode(0);
      clearSelection();
    });
    dom.labelsBtn.addEventListener('click', function () {
      labelsVisible = !labelsVisible;
      syncDock();
      toast(labelsVisible ? '标注已开启' : '标注已隐藏');
    });
    dom.rotateBtn.addEventListener('click', function () {
      autoRotate = !autoRotate;
      controls.autoRotate = autoRotate;
      syncDock();
    });
    dom.focusBtn.addEventListener('click', function () {
      if (!selectedId) { toast('请先选择一个模块'); return; }
      var g = partGroups[selectedId];
      g.getWorldPosition(_v3a);
      controls.targetGoal.copy(_v3a);
      controls.sphGoal.radius = 8.5;
      toast('已锁定 · ' + PART_BY_ID[selectedId].name);
    });
    dom.clearBtn.addEventListener('click', function () {
      clearSelection();
      toast('已取消选择');
    });
    dom.helpBtn.addEventListener('click', function () { openGuide(); });
    dom.guideStart.addEventListener('click', closeGuide);
    dom.guideClose.addEventListener('click', closeGuide);
    dom.guideModal.addEventListener('click', function (e) { if (e.target === dom.guideModal) closeGuide(); });
    dom.fullscreenBtn.addEventListener('click', function () {
      try {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
      } catch (err) {}
    });
    /* mobile sheets */
    dom.mobilePartsBtn.addEventListener('click', function () { openSheet(dom.leftPanel); });
    dom.mobileInfoBtn.addEventListener('click', function () { openSheet(dom.rightPanel); });
    dom.mobilePartChip.addEventListener('click', function () { openSheet(dom.rightPanel); });
    dom.sheetBackdrop.addEventListener('click', closeSheets);
    Array.prototype.forEach.call(document.querySelectorAll('[data-close-sheet]'), function (b) {
      b.addEventListener('click', closeSheets);
    });
    /* keyboard */
    window.addEventListener('keydown', function (e) {
      var tag = e.target && e.target.tagName;
      if (tag === 'INPUT' && e.target.type !== 'range') return;
      var k = e.key.toLowerCase();
      var modalOpen = dom.guideModal.classList.contains('open');
      if (modalOpen) {
        if (k === 'escape' || k === 'enter' || k === ' ') { e.preventDefault(); closeGuide(); }
        return;
      }
      if (tag === 'BUTTON' && (k === ' ' || k === 'enter')) return;
      if (k === ' ' || e.code === 'Space') { e.preventDefault(); toggleExplode(); }
      else if (k === 'r') { dom.resetBtn.click(); }
      else if (k === 'l') { dom.labelsBtn.click(); }
      else if (k === 'escape') { clearSelection(); closeSheets(); }
      else if (k >= '1' && k <= '9') {
        var idx = parseInt(k, 10) - 1;
        if (PARTS[idx]) selectPart(PARTS[idx].id, true);
      }
    });
    window.addEventListener('resize', onResize);
  }

  function openGuide() {
    dom.guideModal.classList.add('open');
    dom.guideModal.setAttribute('aria-hidden', 'false');
  }
  function closeGuide() {
    dom.guideModal.classList.remove('open');
    dom.guideModal.setAttribute('aria-hidden', 'true');
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /* =======================================================================
     17. BOOT
     ======================================================================= */
  function setProgress(pct) {
    dom.loaderBar.style.width = pct + '%';
    dom.loaderPct.textContent = String(Math.round(pct)).padStart(3, '0') + '%';
  }
  function stage(pct, fn) {
    return new Promise(function (res) {
      setProgress(pct);
      requestAnimationFrame(function () {
        try { fn(); } catch (err) { console.error('[boot ' + pct + '%]', err); }
        setTimeout(res, reducedMotion ? 0 : 50);
      });
    });
  }

  function boot() {
    var ids = ['scene', 'preloader', 'loaderBar', 'loaderPct', 'partsList',
      'leftPanel', 'rightPanel', 'inspectorScroll', 'detailNum', 'detailCategory',
      'detailTitle', 'detailEn', 'detailSpecs', 'detailDesc', 'detailAssembly',
      'focusBtn', 'clearBtn', 'labelsLayer', 'leaderSvg', 'callouts', 'cursorTip',
      'mobilePartChip', 'explodeBtn', 'explodeBtnText', 'explodeRange', 'explodeVal',
      'labelsBtn', 'rotateBtn', 'resetBtn', 'mobilePartsBtn', 'mobileInfoBtn',
      'toast', 'sheetBackdrop', 'guideModal', 'guideStart', 'guideClose',
      'helpBtn', 'fullscreenBtn'];
    ids.forEach(function (id) { dom[id] = $(id); });
    progressFill = document.querySelector('.progress-track i');
    progressValue = document.querySelector('.progress-value');
    var scaleSpans = document.querySelectorAll('.status-scale span');
    yawSpan = scaleSpans.length > 1 ? scaleSpans[1] : null;

    /* extra inspector paragraphs (features / note) reuse .part-en style */
    featuresP = document.createElement('p');
    featuresP.className = 'part-en';
    featuresP.style.marginTop = '14px';
    featuresP.style.letterSpacing = '0.06em';
    noteP = document.createElement('p');
    noteP.className = 'part-en';
    noteP.style.marginTop = '8px';
    noteP.style.color = 'var(--dim)';
    dom.detailDesc.after(featuresP);
    featuresP.after(noteP);

    bootAsync();
  }

  async function bootAsync() {
    await stage(6, initRenderer);
    await stage(14, function () { createEnvironment(); setupLights(); buildMaterials(); });
    await stage(26, function () { assemblePart(PART_BY_ID.chassis); });
    await stage(38, function () { assemblePart(PART_BY_ID.lens); });
    await stage(48, function () { assemblePart(PART_BY_ID.sensor); });
    await stage(56, function () { assemblePart(PART_BY_ID.frontScreen); });
    await stage(64, function () { assemblePart(PART_BY_ID.rearScreen); });
    await stage(72, function () { assemblePart(PART_BY_ID.pcb); });
    await stage(80, function () { assemblePart(PART_BY_ID.battery); });
    await stage(87, function () { assemblePart(PART_BY_ID.mount); });
    await stage(93, function () { assemblePart(PART_BY_ID.buttons); });
    await stage(97, function () {
      buildCallouts();
      buildPartsList();
      wireEvents();
      syncDock();
      updateReadouts();
      onResize();
      selectPart('lens', false);
    });
    await stage(100, function () {});

    bootDone = true;
    dom.preloader.classList.add('done');
    setTimeout(openGuide, 650);
    animate();
  }

  /* =======================================================================
     18. LOOP
     ======================================================================= */
  function animate() {
    requestAnimationFrame(animate);
    var dt = Math.min(clock.getDelta(), 0.05);
    var t = clock.elapsedTime;

    controls.update();
    updateExplode();
    updateGlow();

    /* hover pick (once per frame max) */
    if (hoverDirty && pointerInside && !controls.dragging && bootDone) {
      hoverDirty = false;
      setHover(pickAt(pointerX, pointerY));
      if (hoveredId) {
        dom.cursorTip.style.transform =
          'translate3d(' + (pointerX + 16) + 'px,' + (pointerY + 16) + 'px,0)';
      }
    }

    /* screen pulse + LED */
    var pulse = 1.05 + Math.sin(t * 1.7) * 0.1;
    setPanelEmissive('frontScreen', pulse);
    setPanelEmissive('rearScreen', pulse);
    MAT.led.color.setHSL(0.55, 0.9, 0.42 + Math.sin(t * 3) * 0.2);

    scene.updateMatrixWorld(true);
    camera.updateMatrixWorld();
    updateCallouts();
    renderer.render(scene, camera);

    yawTick++;
    if ((yawTick & 7) === 0) updateYaw();
  }

  function setPanelEmissive(id, v) {
    var g = partGroups[id];
    if (!g) return;
    g.traverse(function (o) {
      if (o.isMesh && o.userData.uiPanel && o.material && !o.userData.isGlow) {
        o.material.emissiveIntensity = v;
      }
    });
  }

  /* =======================================================================
     19. START
     ======================================================================= */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

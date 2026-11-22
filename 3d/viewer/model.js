/* 3D massing model of the house plans. Units: feet. World: x = plan x, z = plan y (road at +z), y = up. */
(function () {
  const H = { ground: -2, gfFloor: 0, gfWall: 10.25, ffFloor: 11, ffWall: 21.25, roofTop: 22, parapet: 24.5, door: 7, sill: 3, head: 7.5 };
  const RES = 0.25, X0 = -1, Y0 = -1, NX = 164, NY = 308;
  const C = {
    wall: 0xf1ede6, dark: 0x3c4046, floor: 0xe6dfd2, ffFloor: 0xe9e3d7, roof: 0xd8d3ca, glass: 0x9cc3d8, frame: 0x2f3236,
    lawn: 0x7da35a, paving: 0xcdc6b8, street: 0x5a5d61, bwall: 0xe4ded3, wood: 0xa78160, fabric: 0x8d939d, bed: 0xf4f2ec,
    counter: 0x6d6a66, car1: 0x3c5a80, car2: 0xbfc3c8, tree: 0x5f8a45, trunk: 0x6b4f37, stair: 0x8a6a4c, soffit: 0xb08a63,
  };

  const inRect = (x, y, r) => x > r[0] && x < r[2] && y > r[1] && y < r[3];
  function inPoly(x, y, poly) {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
    }
    return c;
  }
  function grid(fn) { const g = new Array(NX * NY); for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) g[j * NX + i] = fn(X0 + (i + 0.5) * RES, Y0 + (j + 0.5) * RES); return g; }
  // merge equal-valued cells into rectangles: [x1,y1,x2,y2,value]
  function boxes(g) {
    const out = [], open = new Map();
    for (let j = 0; j < NY; j++) {
      const runs = [];
      let i = 0;
      while (i < NX) { const v = g[j * NX + i]; if (!v) { i++; continue; } let k = i; while (k < NX && g[j * NX + k] === v) k++; runs.push([i, k, v]); i = k; }
      const next = new Map();
      for (const [a, b, v] of runs) {
        const key = a + ',' + b + ',' + v;
        if (open.has(key)) { const bx = open.get(key); bx[3] = j + 1; next.set(key, bx); open.delete(key); }
        else { const bx = [a, j, b, j + 1, v]; out.push(bx); next.set(key, bx); }
      }
      open.clear(); for (const [k, v] of next) open.set(k, v);
    }
    return out.map(([a, j, b, j2, v]) => [X0 + a * RES, Y0 + j * RES, X0 + b * RES, Y0 + j2 * RES, v]);
  }

  window.buildHouse = function (THREE, P, opts) {
    opts = opts || {};
    const root = new THREE.Group();
    const groups = { site: new THREE.Group(), gf: new THREE.Group(), ffSlab: new THREE.Group(), ff: new THREE.Group(), roof: new THREE.Group(), labelsGF: new THREE.Group(), labelsFF: new THREE.Group() };
    Object.values(groups).forEach(g => root.add(g));
    const mats = {};
    const mat = (color, o = {}) => {
      const key = color + JSON.stringify(o);
      if (!mats[key]) mats[key] = new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.85, metalness: 0.0, side: THREE.DoubleSide }, o));
      return mats[key];
    };
    const glassMat = mat(C.glass, { transparent: true, opacity: 0.32, roughness: 0.1, metalness: 0.2, depthWrite: false });
    function box(g, x1, z1, x2, z2, y1, y2, m, shadow = true) {
      if (x2 - x1 <= 0 || z2 - z1 <= 0 || y2 - y1 <= 0) return;
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(x2 - x1, y2 - y1, z2 - z1), m);
      mesh.position.set((x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2);
      mesh.castShadow = shadow && !m.transparent; mesh.receiveShadow = !m.transparent;
      g.add(mesh); return mesh;
    }

    const tower = (x, y) => ((x > 8.75 && x < 9.95) || (x > 17.6 && x < 18.8)) && y > 55.5 && y < 73.4;
    const towerFront = (x, y) => y > 72.75 && y < 73.35 && x > 9.2 && x < 18.3;

    function storey(F, base, top, g, isGF) {
      const free = [...F.rooms.map(r => r.r), ...F.open, ...(F.voids || [])];
      const types = grid((x, y) => {
        if (!inPoly(x, y, F.footprint)) return 0;
        for (const r of free) if (inRect(x, y, r)) return 0;
        if (towerFront(x, y)) return 'tglass';
        return tower(x, y) ? 'dwall' : 'wall';
      });
      const mark = (o, t) => {
        const r = o.w === 'h' ? [o.from, o.at - 0.05, o.from + o.len, o.at + (o.t || 0.5) + 0.05] : [o.at - 0.05, o.from, o.at + (o.t || 0.5) + 0.05, o.from + o.len];
        for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
          const x = X0 + (i + 0.5) * RES, y = Y0 + (j + 0.5) * RES, k = j * NX + i;
          if (types[k] && inRect(x, y, r)) types[k] = (types[k] === 'tglass' && t === 'door') ? 'tdoor' : (types[k] === 'tglass' ? 'tglass' : t);
        }
      };
      (F.windows || []).forEach(w => mark(w, 'window'));
      (F.doors || []).filter(d => !d.none).forEach(d => mark(d, d.slide ? 'gdoor' : 'door'));
      const h = top - base;
      for (const [x1, z1, x2, z2, t] of boxes(types)) {
        const wm = mat(t === 'dwall' ? C.dark : C.wall);
        if (t === 'wall' || t === 'dwall') box(g, x1, z1, x2, z2, base, top, wm);
        else if (t === 'door') box(g, x1, z1, x2, z2, base + H.door, top, wm);
        else if (t === 'window') { box(g, x1, z1, x2, z2, base, base + H.sill, wm); box(g, x1, z1, x2, z2, base + H.head, top, wm); box(g, x1, z1, x2, z2, base + H.sill, base + H.head, glassMat, false); }
        else if (t === 'gdoor') { box(g, x1, z1, x2, z2, base + 8, top, wm); box(g, x1, z1, x2, z2, base, base + 8, glassMat, false); }
        else if (t === 'tglass') box(g, x1, z1, x2, z2, base, top + (isGF ? H.ffFloor - H.gfWall : 0), glassMat, false);
        else if (t === 'tdoor') { box(g, x1, z1, x2, z2, base, base + 8.5, mat(0x5a4636), true); box(g, x1, z1, x2, z2, base + 8.5, top + (isGF ? H.ffFloor - H.gfWall : 0), glassMat, false); }
      }
      return types;
    }

    // ---------- site ----------
    const S = groups.site;
    box(S, -60, -50, 100, 140, H.ground - 0.6, H.ground - 0.05, mat(0xbdb6a8), false);
    box(S, -60, 82.5 + 8, 100, 120, H.ground - 0.04, H.ground - 0.02, mat(C.street), false);
    box(S, -60, 82.5, 100, 82.5 + 8, H.ground - 0.04, H.ground + 0.25, mat(0xd7d1c6), false);
    const plot = [[-7.5, -7.5], [45.5, -7.5], [44, 82.5], [-6, 82.5]];
    const pg = grid((x, y) => inPoly(x, y, plot) ? (inRect(x, y, [18.7, 72.1, 45, 83]) ? 'lawn' : 'pave') : 0);
    for (const [x1, z1, x2, z2, t] of boxes(pg)) box(S, x1, z1, x2, z2, H.ground - 0.05, H.ground + 0.02, mat(t === 'lawn' ? C.lawn : C.paving), false);
    // boundary wall (6 ft), front with gate openings
    const bw = mat(C.bwall);
    const seg = (a, b, gaps = []) => {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uz = (b[1] - a[1]) / L;
      let cuts = [[0, L]];
      for (const [g1, g2] of gaps) cuts = cuts.flatMap(([s, e]) => (g2 <= s || g1 >= e) ? [[s, e]] : [[s, g1], [g2, e]].filter(([p, q]) => q - p > 0.1));
      for (const [s, e] of cuts) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(e - s, 6, 0.75), bw);
        m.position.set(a[0] + ux * (s + e) / 2, H.ground + 3, a[1] + uz * (s + e) / 2);
        m.rotation.y = -Math.atan2(uz, ux); m.castShadow = m.receiveShadow = true; S.add(m);
      }
    };
    seg(plot[0], plot[1]); seg(plot[1], plot[2]); seg(plot[3], plot[0]);
    seg(plot[3], plot[2], [[3.8, 17.3], [18.5, 23.7]]);
    // patio paving, porch canopy, cars, trees
    box(S, 37, 22.4, 43.5, 41, H.ground, H.ground + 0.4, mat(0xd9d2c4), false);
    const canopy = mat(C.dark);
    box(S, -5.5, 61.7, 9.3, 72.5, H.gfWall, H.ffFloor, canopy); box(S, -5.5, 61.7, 9.3, 72.5, H.gfWall - 0.15, H.gfWall, mat(C.soffit), false);
    box(S, -5.3, 71.6, -4.3, 72.4, H.ground, H.gfWall, canopy); box(S, -5.3, 62.2, -4.3, 63, H.ground, H.gfWall, canopy);
    const car = (cx, col) => { box(S, cx - 3, 64.5, cx + 3, 79.5, H.ground + 0.7, H.ground + 3.2, mat(col, { roughness: 0.4, metalness: 0.3 })); box(S, cx - 2.6, 68, cx + 2.6, 76, H.ground + 3.2, H.ground + 4.8, mat(col, { roughness: 0.4, metalness: 0.3 })); };
    car(-2.2, C.car1); car(4.6, C.car2);
    const tree = (x, z, s) => { box(S, x - 0.4, z - 0.4, x + 0.4, z + 0.4, H.ground, H.ground + 6 * s, mat(C.trunk)); const m = new THREE.Mesh(new THREE.SphereGeometry(4.5 * s, 16, 12), mat(C.tree)); m.position.set(x, H.ground + 9 * s, z); m.castShadow = true; S.add(m); };
    tree(40.5, 78.5, 1); tree(52, 88, 1.3); tree(41, -3, 1); tree(-4, -3, 0.9);

    // ---------- ground floor ----------
    const G = groups.gf;
    const plinth = grid((x, y) => inPoly(x, y, P.GF.footprint) ? 1 : 0);
    for (const [x1, z1, x2, z2] of boxes(plinth)) box(G, x1, z1, x2, z2, H.ground, H.gfFloor, mat(C.floor));
    storey(P.GF, H.gfFloor, H.gfWall, G, true);

    // ---------- first floor slab (minus voids) ----------
    const FS = groups.ffSlab;
    const slab = grid((x, y) => {
      const inside = inPoly(x, y, P.GF.footprint) || inPoly(x, y, P.FF.footprint) || inRect(x, y, P.terrace);
      if (!inside) return 0;
      for (const v of P.FF.voids) if (inRect(x, y, v)) return 0;
      return inRect(x, y, P.terrace) && !inPoly(x, y, P.FF.footprint) ? 't' : 's';
    });
    for (const [x1, z1, x2, z2, t] of boxes(slab)) box(FS, x1, z1, x2, z2, H.gfWall, H.ffFloor, mat(t === 't' ? 0xcfc6b6 : C.ffFloor));
    // terrace glass parapet on open sides
    const [tx1, tz1, tx2, tz2] = P.terrace;
    box(FS, tx1, tz2 - 0.15, tx2 + 0.2, tz2 + 0.05, H.ffFloor, H.ffFloor + 3.5, glassMat, false);
    box(FS, tx2, tz1, tx2 + 0.2, tz2 + 0.05, H.ffFloor, H.ffFloor + 3.5, glassMat, false);
    box(FS, tx1, tz2 - 0.15, tx2 + 0.2, tz2 + 0.05, H.ffFloor + 3.5, H.ffFloor + 3.65, mat(C.frame));

    // ---------- first floor ----------
    const F = groups.ff;
    storey(P.FF, H.ffFloor, H.ffWall, F, false);
    for (const [x1, y1, x2, y2] of (P.FF.railings || [])) {
      const t = 0.12, xa = Math.min(x1, x2) - (x1 === x2 ? t : 0), xb = Math.max(x1, x2) + (x1 === x2 ? t : 0), za = Math.min(y1, y2) - (y1 === y2 ? t : 0), zb = Math.max(y1, y2) + (y1 === y2 ? t : 0);
      box(F, xa, za, xb, zb, H.ffFloor, H.ffFloor + 3.5, glassMat, false);
      box(F, xa, za, xb, zb, H.ffFloor + 3.5, H.ffFloor + 3.62, mat(C.frame));
    }

    // ---------- stair (floating treads) ----------
    const riser = (H.ffFloor - H.gfFloor) / 18; let level = 0;
    for (const p of P.stair) {
      if (p.landing) { level++; const [a, b, c, d] = p.landing; box(G, a, b, c, d, level * riser - 0.35, level * riser, mat(C.stair)); continue; }
      const [a, b, c, d] = p.r, n = p.treads;
      for (let i = 0; i < n; i++) {
        level++;
        const f = p.dir > 0 ? i : n - 1 - i;
        if (p.axis === 'x') { const w = (c - a) / n; box(G, a + f * w, b, a + (f + 1) * w, d, level * riser - 0.25, level * riser, mat(C.stair)); }
        else { const w = (d - b) / n; box(G, a, b + f * w, c, b + (f + 1) * w, level * riser - 0.25, level * riser, mat(C.stair)); }
      }
    }

    // ---------- roof ----------
    const R = groups.roof;
    const roof = grid((x, y) => inPoly(x, y, P.FF.footprint) ? 1 : 0);
    for (const [x1, z1, x2, z2] of boxes(roof)) box(R, x1, z1, x2, z2, H.ffWall, H.roofTop, mat(C.roof));
    const edge = grid((x, y) => {
      if (!inPoly(x, y, P.FF.footprint)) return 0;
      const n = [[RES * 2, 0], [-RES * 2, 0], [0, RES * 2], [0, -RES * 2]].some(([dx, dy]) => !inPoly(x + dx, y + dy, P.FF.footprint));
      if (!n) return 0; return tower(x, y) || towerFront(x, y) ? 'd' : 'w';
    });
    for (const [x1, z1, x2, z2, t] of boxes(edge)) box(R, x1, z1, x2, z2, H.roofTop, H.parapet + (t === 'd' ? 1.5 : 0), mat(t === 'd' ? C.dark : C.wall));

    // ---------- furniture (simple blocks for scale) ----------
    const furnish = (FL, g, base) => {
      for (const rm of FL.rooms) {
        const [a, b, c, d] = rm.r, cx = (a + c) / 2, n = rm.n;
        if (/BED/.test(n)) { box(g, cx - 3.25, b + 0.3, cx + 3.25, b + 7.3, base, base + 1.9, mat(C.bed)); box(g, cx - 3.4, b + 0.1, cx + 3.4, b + 0.5, base, base + 3.6, mat(C.wood)); box(g, cx - 3, b + 0.6, cx + 3, b + 2, base + 1.9, base + 2.3, mat(0xdfe6ee)); }
        else if (/KITCHEN/.test(n) && !/D\./.test(n)) { box(g, a + 0.05, b + 0.05, c - 0.05, b + 2.05, base, base + 3, mat(C.counter)); box(g, c - 2.05, b + 2, c - 0.05, d - 2, base, base + 3, mat(C.counter)); }
        else if (/D\.KITCHEN|KITCHENETTE/.test(n)) box(g, a + 0.05, b + 0.05, a + 2.05, d - 0.05, base, base + 3, mat(C.counter));
        else if (/DRAWING/.test(n)) { box(g, cx - 4, b + 0.4, cx + 4, b + 3.2, base, base + 2.6, mat(C.fabric)); box(g, a + 0.5, b + 4, a + 3.3, b + 7, base, base + 2.6, mat(C.fabric)); box(g, c - 3.3, b + 4, c - 0.5, b + 7, base, base + 2.6, mat(C.fabric)); box(g, cx - 2, b + 5, cx + 2, b + 7.5, base, base + 1.3, mat(C.wood)); }
        else if (/DRESS/.test(n)) box(g, a + 0.05, b + 0.05, a + 2, d - 0.05, base, base + 7, mat(C.wood));
      }
      for (const l of (FL.labels || [])) {
        const n = l.n, x = l.x, z = l.y;
        if (/LIVING ROOM/.test(n)) { box(g, x - 4.5, z - 5, x + 4.5, z - 2.2, base, base + 2.6, mat(C.fabric)); box(g, x - 2, z - 1, x + 2, z + 1.5, base, base + 1.3, mat(C.wood)); }
        else if (/^DINING/.test(n)) { box(g, x - 1.75, z - 3.5, x + 1.75, z + 3.5, base + 2.4, base + 2.6, mat(C.wood)); box(g, x - 0.3, z - 3, x + 0.3, z + 3, base, base + 2.4, mat(C.wood)); for (const s of [-1, 1]) for (const k of [-2.5, 0, 2.5]) box(g, x + s * 2.6 - 0.8, z + k - 0.8, x + s * 2.6 + 0.8, z + k + 0.8, base, base + 1.5, mat(C.fabric)); }
        else if (/SEATING|SITTING/.test(n)) box(g, x - 3, z - 1.2, x + 3, z + 1.6, base, base + 2.6, mat(C.fabric));
      }
    };
    furnish(P.GF, G, H.gfFloor); furnish(P.FF, F, H.ffFloor);

    // ---------- room labels (sprites) ----------
    const sprite = (text, x, y, z, g) => {
      const cv = document.createElement('canvas'); cv.width = 512; cv.height = 96; const c = cv.getContext('2d');
      c.fillStyle = 'rgba(255,255,255,0.85)'; c.fillRect(0, 0, 512, 96); c.fillStyle = '#1b1b1b'; c.font = 'bold 44px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, 256, 50);
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), depthTest: false }));
      s.scale.set(Math.max(7, text.length * 1.15), 2.3, 1); s.position.set(x, y, z); s.renderOrder = 10; g.add(s);
    };
    const lab = (FL, g, base) => {
      for (const rm of FL.rooms) { if (/^(BATH|DRESS)$/.test(rm.n)) continue; sprite(rm.n, (rm.r[0] + rm.r[2]) / 2, base + 4, (rm.r[1] + rm.r[3]) / 2, g); }
      for (const l of (FL.labels || [])) { if (/LOBBY|WALKWAY|BRIDGE|GALLERY|ENTRANCE$|PATIO|PORCH|LAWN|FLOATING|LOOKING/.test(l.n)) continue; sprite(l.n, l.x, base + 4, l.y, g); }
    };
    lab(P.GF, groups.labelsGF, H.gfFloor); lab(P.FF, groups.labelsFF, H.ffFloor);
    groups.labelsGF.visible = groups.labelsFF.visible = false;

    root.userData.groups = groups;
    return root;
  };
})();

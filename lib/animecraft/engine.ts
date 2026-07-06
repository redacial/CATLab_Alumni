/**
 * SakuraCraft — an anime-inspired voxel world.
 *
 * Self-contained Three.js engine: procedural pastel terrain, sakura trees,
 * a torii gate at spawn, falling petals, first-person physics, and block
 * breaking/placing. No textures — every block is flat vertex color with
 * baked face shading for a cel/anime look.
 */
import * as THREE from "three";

// ---------------------------------------------------------------------------
// World constants
// ---------------------------------------------------------------------------
const WX = 128; // world size (x)
const WZ = 128; // world size (z)
const WY = 48; // world height
const CHUNK = 16;
const WATER_LEVEL = 13;
const REACH = 7; // block interaction distance

// Block ids
const AIR = 0;
const GRASS = 1;
const DIRT = 2;
const STONE = 3;
const LOG = 4;
const LEAF_PINK = 5;
const LEAF_WHITE = 6;
const WATER = 7;
const SAND = 8;
const LANTERN = 9;
const TORII = 10;
const PLANKS = 11;

type RGB = [number, number, number];
// THREE.Color converts sRGB hex to linear working space, so vertex colors
// survive the renderer's linear->sRGB output pass looking as authored.
const rgb = (hex: number): RGB => {
  const c = new THREE.Color(hex);
  return [c.r, c.g, c.b];
};

// Pastel anime palette (top / side / bottom per block)
const PAL: Record<number, { top: RGB; side: RGB; bottom: RGB }> = {
  [GRASS]: { top: rgb(0x8ee6a0), side: rgb(0xb08a63), bottom: rgb(0x9c7351) },
  [DIRT]: { top: rgb(0xc19a70), side: rgb(0xb08a63), bottom: rgb(0x9c7351) },
  [STONE]: { top: rgb(0xc3cadd), side: rgb(0xb4bcd2), bottom: rgb(0xa6aec6) },
  [LOG]: { top: rgb(0xb08578), side: rgb(0x8a6355), bottom: rgb(0x8a6355) },
  [LEAF_PINK]: { top: rgb(0xffa7c9), side: rgb(0xff9ac0), bottom: rgb(0xf58cb4) },
  [LEAF_WHITE]: { top: rgb(0xffd9e9), side: rgb(0xffcfe3), bottom: rgb(0xf7c0d8) },
  [WATER]: { top: rgb(0x8fd8f5), side: rgb(0x7fcbee), bottom: rgb(0x7fcbee) },
  [SAND]: { top: rgb(0xf5e6bd), side: rgb(0xeeddb0), bottom: rgb(0xe3d0a0) },
  [LANTERN]: { top: rgb(0xffdf8e), side: rgb(0xffd27a), bottom: rgb(0xffc862) },
  [TORII]: { top: rgb(0xf2664f), side: rgb(0xe85d4a), bottom: rgb(0xd14e3d) },
  [PLANKS]: { top: rgb(0xe0a893), side: rgb(0xd9a08c), bottom: rgb(0xc98f7b) },
};

export type SlotInfo = { name: string; color: string; id: number };

export const HOTBAR: SlotInfo[] = [
  { id: GRASS, name: "Grass", color: "#8ee6a0" },
  { id: DIRT, name: "Dirt", color: "#b08a63" },
  { id: STONE, name: "Stone", color: "#b4bcd2" },
  { id: LOG, name: "Sakura Log", color: "#8a6355" },
  { id: LEAF_PINK, name: "Blossom", color: "#ffa7c9" },
  { id: LEAF_WHITE, name: "Pale Blossom", color: "#ffd9e9" },
  { id: PLANKS, name: "Planks", color: "#d9a08c" },
  { id: LANTERN, name: "Lantern", color: "#ffd27a" },
  { id: TORII, name: "Torii Red", color: "#e85d4a" },
];

export type GameApi = {
  dispose(): void;
  start(): void;
  hotbar: SlotInfo[];
  onLockChange: (cb: (locked: boolean) => void) => void;
  onSlotChange: (cb: (slot: number) => void) => void;
};

// ---------------------------------------------------------------------------
// Deterministic hash noise
// ---------------------------------------------------------------------------
function hash2(x: number, y: number, seed = 0): number {
  let h = (x * 374761393 + y * 668265263 + seed * 1442695041) | 0;
  h = (h ^ (h >> 13)) | 0;
  h = Math.imul(h, 1274126177);
  h = (h ^ (h >> 16)) >>> 0;
  return h / 4294967295;
}

function valueNoise(x: number, y: number, seed: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const s = (t: number) => t * t * (3 - 2 * t);
  const u = s(xf);
  const v = s(yf);
  const a = hash2(xi, yi, seed);
  const b = hash2(xi + 1, yi, seed);
  const c = hash2(xi, yi + 1, seed);
  const d = hash2(xi + 1, yi + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function fbm(x: number, y: number, seed: number, octaves = 4): number {
  let amp = 0.5;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += amp * valueNoise(x * freq, y * freq, seed + i * 101);
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum / norm;
}

// ---------------------------------------------------------------------------
// Face table (corner order matches indices [0,1,2, 2,1,3])
// ---------------------------------------------------------------------------
const FACES: { dir: [number, number, number]; corners: [number, number, number][] }[] = [
  { dir: [-1, 0, 0], corners: [[0, 1, 0], [0, 0, 0], [0, 1, 1], [0, 0, 1]] },
  { dir: [1, 0, 0], corners: [[1, 1, 1], [1, 0, 1], [1, 1, 0], [1, 0, 0]] },
  { dir: [0, -1, 0], corners: [[1, 0, 1], [0, 0, 1], [1, 0, 0], [0, 0, 0]] },
  { dir: [0, 1, 0], corners: [[0, 1, 1], [1, 1, 1], [0, 1, 0], [1, 1, 0]] },
  { dir: [0, 0, -1], corners: [[1, 0, 0], [0, 0, 0], [1, 1, 0], [0, 1, 0]] },
  { dir: [0, 0, 1], corners: [[0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]] },
];

// ---------------------------------------------------------------------------
// Game
// ---------------------------------------------------------------------------
export function createGame(container: HTMLElement): GameApi {
  // ---- world data -----------------------------------------------------
  const blocks = new Uint8Array(WX * WY * WZ);
  const idx = (x: number, y: number, z: number) => (x * WZ + z) * WY + y;

  function getBlock(x: number, y: number, z: number): number {
    if (y < 0) return STONE;
    if (y >= WY) return AIR;
    if (x < 0 || x >= WX || z < 0 || z >= WZ) return AIR;
    return blocks[idx(x, y, z)];
  }
  function setBlock(x: number, y: number, z: number, t: number) {
    if (x < 0 || x >= WX || y < 0 || y >= WY || z < 0 || z >= WZ) return;
    blocks[idx(x, y, z)] = t;
  }

  // ---- terrain generation ---------------------------------------------
  const heights = new Int16Array(WX * WZ);
  for (let x = 0; x < WX; x++) {
    for (let z = 0; z < WZ; z++) {
      const h = Math.floor(
        8 + fbm(x * 0.018, z * 0.018, 1000) * 17 + fbm(x * 0.06, z * 0.06, 2000) * 4
      );
      const hh = Math.max(3, Math.min(WY - 14, h));
      heights[x * WZ + z] = hh;
      for (let y = 0; y <= hh; y++) {
        let t = STONE;
        if (y === hh) t = hh <= WATER_LEVEL + 1 ? SAND : GRASS;
        else if (y >= hh - 3) t = hh <= WATER_LEVEL + 1 ? SAND : DIRT;
        setBlock(x, y, z, t);
      }
      for (let y = hh + 1; y <= WATER_LEVEL; y++) setBlock(x, y, z, WATER);
    }
  }

  function plantTree(x: number, z: number) {
    const h = heights[x * WZ + z];
    if (getBlock(x, h, z) !== GRASS) return;
    const th = 4 + Math.floor(hash2(x, z, 31) * 3);
    for (let y = h + 1; y <= h + th; y++) setBlock(x, y, z, LOG);
    const cy = h + th;
    const r = 3.1;
    for (let dx = -3; dx <= 3; dx++) {
      for (let dz = -3; dz <= 3; dz++) {
        for (let dy = -2; dy <= 3; dy++) {
          const d = dx * dx + dz * dz + dy * dy * 1.8;
          if (d > r * r) continue;
          const bx = x + dx, by = cy + dy, bz = z + dz;
          if (getBlock(bx, by, bz) !== AIR) continue;
          const pale = hash2(bx * 3 + by, bz * 5 + by, 77) < 0.16;
          setBlock(bx, by, bz, pale ? LEAF_WHITE : LEAF_PINK);
        }
      }
    }
  }

  for (let x = 4; x < WX - 4; x++) {
    for (let z = 4; z < WZ - 4; z++) {
      const h = heights[x * WZ + z];
      if (h <= WATER_LEVEL + 1) continue;
      if (hash2(x, z, 7) < 0.011) plantTree(x, z);
      else if (hash2(x, z, 13) < 0.0035 && getBlock(x, h, z) === GRASS) {
        // stone lantern post
        setBlock(x, h + 1, z, LOG);
        setBlock(x, h + 2, z, LANTERN);
      }
    }
  }

  // Torii gate near spawn
  const cx = WX >> 1;
  const cz = WZ >> 1;
  const gh = Math.max(heights[(cx - 3) * WZ + cz], heights[(cx + 3) * WZ + cz], WATER_LEVEL + 1);
  for (const px of [cx - 3, cx + 3]) {
    for (let y = heights[px * WZ + cz]; y <= gh; y++) setBlock(px, y, cz, STONE);
    for (let y = gh + 1; y <= gh + 5; y++) setBlock(px, y, cz, TORII);
  }
  for (let x = cx - 3; x <= cx + 3; x++) setBlock(x, gh + 4, cz, TORII);
  for (let x = cx - 4; x <= cx + 4; x++) {
    setBlock(x, gh + 6, cz, TORII);
    if (x >= cx - 3 && x <= cx + 3) setBlock(x, gh + 5, cz, AIR);
  }
  for (const px of [cx - 3, cx + 3]) for (let y = gh + 1; y <= gh + 5; y++) setBlock(px, y, cz, TORII);
  setBlock(cx, gh + 5, cz, LANTERN); // lantern hanging under the beam

  // ---- three.js setup ---------------------------------------------------
  const scene = new THREE.Scene();
  const FOG_COLOR = 0xffd9ec;
  scene.fog = new THREE.Fog(FOG_COLOR, 45, 160);

  const camera = new THREE.PerspectiveCamera(72, 1, 0.1, 900);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.display = "block";
  container.appendChild(renderer.domElement);

  function resize() {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  resize();
  window.addEventListener("resize", resize);

  // Gradient sky dome
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      top: { value: new THREE.Color(0x7ec3ff) },
      mid: { value: new THREE.Color(0xbfe3ff) },
      horizon: { value: new THREE.Color(FOG_COLOR) },
    },
    vertexShader: `
      varying vec3 vPos;
      void main() {
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 top; uniform vec3 mid; uniform vec3 horizon;
      varying vec3 vPos;
      void main() {
        float h = normalize(vPos).y;
        vec3 c = mix(horizon, mid, smoothstep(-0.05, 0.18, h));
        c = mix(c, top, smoothstep(0.18, 0.65, h));
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(600, 24, 12), skyMat);
  sky.frustumCulled = false;
  scene.add(sky);

  // Soft anime sun
  function discTexture(inner: string, outer: string): THREE.Texture {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(64, 64, 8, 64, 64, 64);
    grad.addColorStop(0, inner);
    grad.addColorStop(1, outer);
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }
  const sun = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: discTexture("rgba(255,244,214,1)", "rgba(255,214,170,0)"),
      transparent: true,
      depthWrite: false,
      fog: false,
    })
  );
  sun.scale.setScalar(140);
  scene.add(sun);
  const SUN_DIR = new THREE.Vector3(0.5, 0.55, -0.7).normalize();

  // Drifting pastel clouds
  const cloudMat = new THREE.MeshBasicMaterial({
    color: 0xfff6fb,
    transparent: true,
    opacity: 0.88,
  });
  const clouds: THREE.Mesh[] = [];
  for (let i = 0; i < 14; i++) {
    const w = 10 + hash2(i, 1, 5) * 18;
    const d = 6 + hash2(i, 2, 5) * 10;
    const cloud = new THREE.Mesh(new THREE.BoxGeometry(w, 1.6, d), cloudMat);
    cloud.position.set(hash2(i, 3, 5) * WX, 44 + hash2(i, 4, 5) * 10, hash2(i, 5, 5) * WZ);
    clouds.push(cloud);
    scene.add(cloud);
  }

  // ---- chunk meshing -----------------------------------------------------
  const CX = WX / CHUNK;
  const CZ = WZ / CHUNK;
  const solidMat = new THREE.MeshBasicMaterial({ vertexColors: true });
  const waterMat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.68,
    depthWrite: false,
  });
  const chunkMeshes: (THREE.Mesh | null)[] = new Array(CX * CZ * 2).fill(null);

  // shading multipliers applied in linear space (roughly sRGB 1 / .55 / .72 / .86)
  const SHADE: Record<string, number> = {
    "0,1,0": 1.0,
    "0,-1,0": 0.28,
    "1,0,0": 0.48,
    "-1,0,0": 0.48,
    "0,0,1": 0.7,
    "0,0,-1": 0.7,
  };

  function buildChunk(ci: number, cj: number) {
    for (let layer = 0; layer < 2; layer++) {
      const old = chunkMeshes[(ci * CZ + cj) * 2 + layer];
      if (old) {
        scene.remove(old);
        old.geometry.dispose();
      }
    }

    const pos: number[] = [];
    const col: number[] = [];
    const ind: number[] = [];
    const wpos: number[] = [];
    const wcol: number[] = [];
    const wind: number[] = [];

    const x0 = ci * CHUNK;
    const z0 = cj * CHUNK;
    for (let x = x0; x < x0 + CHUNK; x++) {
      for (let z = z0; z < z0 + CHUNK; z++) {
        for (let y = 0; y < WY; y++) {
          const t = blocks[idx(x, y, z)];
          if (t === AIR) continue;
          const isWater = t === WATER;
          const jitter = isWater ? 1 : 0.93 + hash2(x * 7 + y, z * 11 + y, 3) * 0.11;
          const pal = PAL[t];
          for (const face of FACES) {
            const [dx, dy, dz] = face.dir;
            const n = getBlock(x + dx, y + dy, z + dz);
            const visible = isWater ? n === AIR : n === AIR || n === WATER;
            if (!visible) continue;

            const shade = SHADE[`${dx},${dy},${dz}`];
            const base = dy > 0 ? pal.top : dy < 0 ? pal.bottom : pal.side;
            const P = isWater ? wpos : pos;
            const C = isWater ? wcol : col;
            const I = isWater ? wind : ind;
            const start = P.length / 3;
            for (const corner of face.corners) {
              let cy = y + corner[1];
              // recess water surface slightly below the block top
              if (isWater && corner[1] === 1 && getBlock(x, y + 1, z) === AIR) cy -= 0.12;
              P.push(x + corner[0], cy, z + corner[2]);
              // grass sides fade from green (top) into dirt (bottom)
              const c =
                t === GRASS && dy === 0 && corner[1] === 1 ? PAL[GRASS].top : base;
              C.push(c[0] * shade * jitter, c[1] * shade * jitter, c[2] * shade * jitter);
            }
            I.push(start, start + 1, start + 2, start + 2, start + 1, start + 3);
          }
        }
      }
    }

    const make = (p: number[], c: number[], i: number[], mat: THREE.Material) => {
      if (i.length === 0) return null;
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
      g.setAttribute("color", new THREE.Float32BufferAttribute(c, 3));
      g.setIndex(i);
      const m = new THREE.Mesh(g, mat);
      m.frustumCulled = true;
      scene.add(m);
      return m;
    };
    chunkMeshes[(ci * CZ + cj) * 2] = make(pos, col, ind, solidMat);
    chunkMeshes[(ci * CZ + cj) * 2 + 1] = make(wpos, wcol, wind, waterMat);
  }

  for (let i = 0; i < CX; i++) for (let j = 0; j < CZ; j++) buildChunk(i, j);

  function remeshAround(x: number, z: number) {
    const ci = Math.floor(x / CHUNK);
    const cj = Math.floor(z / CHUNK);
    const dirty = new Set<number>([ci * CZ + cj]);
    if (x % CHUNK === 0 && ci > 0) dirty.add((ci - 1) * CZ + cj);
    if (x % CHUNK === CHUNK - 1 && ci < CX - 1) dirty.add((ci + 1) * CZ + cj);
    if (z % CHUNK === 0 && cj > 0) dirty.add(ci * CZ + cj - 1);
    if (z % CHUNK === CHUNK - 1 && cj < CZ - 1) dirty.add(ci * CZ + cj + 1);
    dirty.forEach((key) => buildChunk(Math.floor(key / CZ), key % CZ));
  }

  // ---- falling sakura petals ---------------------------------------------
  const PETALS = 700;
  const petalGeo = new THREE.BufferGeometry();
  const petalPos = new Float32Array(PETALS * 3);
  const petalPhase = new Float32Array(PETALS);
  for (let i = 0; i < PETALS; i++) {
    petalPos[i * 3] = (Math.random() - 0.5) * 70;
    petalPos[i * 3 + 1] = (Math.random() - 0.5) * 50;
    petalPos[i * 3 + 2] = (Math.random() - 0.5) * 70;
    petalPhase[i] = Math.random() * Math.PI * 2;
  }
  petalGeo.setAttribute("position", new THREE.BufferAttribute(petalPos, 3));
  const petals = new THREE.Points(
    petalGeo,
    new THREE.PointsMaterial({
      map: discTexture("rgba(255,183,213,1)", "rgba(255,183,213,0)"),
      color: 0xffc2da,
      size: 0.35,
      transparent: true,
      depthWrite: false,
      sizeAttenuation: true,
    })
  );
  petals.frustumCulled = false;
  scene.add(petals);

  // ---- block highlight ----------------------------------------------------
  const highlight = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(1.004, 1.004, 1.004)),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 })
  );
  highlight.visible = false;
  scene.add(highlight);

  // ---- player -------------------------------------------------------------
  const HALF = 0.3;
  const HEIGHT = 1.8;
  const EYE = 1.62;
  const spawnH = Math.max(heights[cx * WZ + (cz + 8)], WATER_LEVEL) + 1;
  const player = {
    pos: new THREE.Vector3(cx + 0.5, spawnH + 2, cz + 8.5),
    vel: new THREE.Vector3(),
    yaw: 0,
    pitch: -0.05,
    onGround: false,
  };

  const isSolid = (x: number, y: number, z: number) => {
    if (x < 0 || x >= WX || z < 0 || z >= WZ) return true; // world border walls
    const t = getBlock(Math.floor(x), Math.floor(y), Math.floor(z));
    return t !== AIR && t !== WATER;
  };

  function collides(p: THREE.Vector3): boolean {
    for (let x = Math.floor(p.x - HALF); x <= Math.floor(p.x + HALF); x++) {
      for (let z = Math.floor(p.z - HALF); z <= Math.floor(p.z + HALF); z++) {
        for (let y = Math.floor(p.y); y <= Math.floor(p.y + HEIGHT); y++) {
          if (isSolid(x + 0.5, y + 0.5, z + 0.5)) {
            // AABB vs block AABB
            if (
              p.x - HALF < x + 1 && p.x + HALF > x &&
              p.y < y + 1 && p.y + HEIGHT > y &&
              p.z - HALF < z + 1 && p.z + HALF > z
            ) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  function playerIntersectsBlock(bx: number, by: number, bz: number): boolean {
    const p = player.pos;
    return (
      p.x - HALF < bx + 1 && p.x + HALF > bx &&
      p.y < by + 1 && p.y + HEIGHT > by &&
      p.z - HALF < bz + 1 && p.z + HALF > bz
    );
  }

  // ---- input ---------------------------------------------------------------
  const keys = new Set<string>();
  let slot = 0;
  let locked = false;
  let lockCb: ((l: boolean) => void) | null = null;
  let slotCb: ((s: number) => void) | null = null;

  function setSlot(s: number) {
    slot = ((s % HOTBAR.length) + HOTBAR.length) % HOTBAR.length;
    slotCb?.(slot);
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (!locked) return;
    keys.add(e.code);
    if (e.code.startsWith("Digit")) {
      const n = parseInt(e.code.slice(5), 10);
      if (n >= 1 && n <= HOTBAR.length) setSlot(n - 1);
    }
    if (["Space", "ArrowUp", "ArrowDown"].includes(e.code)) e.preventDefault();
  };
  const onKeyUp = (e: KeyboardEvent) => keys.delete(e.code);
  const onWheel = (e: WheelEvent) => {
    if (locked) setSlot(slot + (e.deltaY > 0 ? 1 : -1));
  };
  const onMouseMove = (e: MouseEvent) => {
    if (!locked) return;
    player.yaw -= e.movementX * 0.0024;
    player.pitch -= e.movementY * 0.0024;
    player.pitch = Math.max(-1.55, Math.min(1.55, player.pitch));
  };
  const onPointerLockChange = () => {
    locked = document.pointerLockElement === renderer.domElement;
    if (!locked) keys.clear();
    lockCb?.(locked);
  };
  const onContextMenu = (e: Event) => e.preventDefault();

  // Voxel raycast (Amanatides & Woo DDA)
  function raycast(): { hit: [number, number, number]; prev: [number, number, number] } | null {
    const dir = new THREE.Vector3(0, 0, -1)
      .applyEuler(new THREE.Euler(player.pitch, player.yaw, 0, "YXZ"))
      .normalize();
    const o = camera.position;
    let x = Math.floor(o.x), y = Math.floor(o.y), z = Math.floor(o.z);
    const stepX = Math.sign(dir.x), stepY = Math.sign(dir.y), stepZ = Math.sign(dir.z);
    const tDeltaX = dir.x !== 0 ? Math.abs(1 / dir.x) : Infinity;
    const tDeltaY = dir.y !== 0 ? Math.abs(1 / dir.y) : Infinity;
    const tDeltaZ = dir.z !== 0 ? Math.abs(1 / dir.z) : Infinity;
    let tMaxX = dir.x !== 0 ? ((stepX > 0 ? x + 1 - o.x : o.x - x) * tDeltaX) : Infinity;
    let tMaxY = dir.y !== 0 ? ((stepY > 0 ? y + 1 - o.y : o.y - y) * tDeltaY) : Infinity;
    let tMaxZ = dir.z !== 0 ? ((stepZ > 0 ? z + 1 - o.z : o.z - z) * tDeltaZ) : Infinity;
    let px = x, py = y, pz = z;
    let t = 0;
    while (t <= REACH) {
      const b = getBlock(x, y, z);
      if (b !== AIR && b !== WATER) return { hit: [x, y, z], prev: [px, py, pz] };
      px = x; py = y; pz = z;
      if (tMaxX < tMaxY && tMaxX < tMaxZ) { x += stepX; t = tMaxX; tMaxX += tDeltaX; }
      else if (tMaxY < tMaxZ) { y += stepY; t = tMaxY; tMaxY += tDeltaY; }
      else { z += stepZ; t = tMaxZ; tMaxZ += tDeltaZ; }
    }
    return null;
  }

  const onMouseDown = (e: MouseEvent) => {
    if (!locked) return;
    const r = raycast();
    if (!r) return;
    if (e.button === 0) {
      const [x, y, z] = r.hit;
      setBlock(x, y, z, AIR);
      remeshAround(x, z);
    } else if (e.button === 2) {
      const [x, y, z] = r.prev;
      if (getBlock(x, y, z) !== AIR && getBlock(x, y, z) !== WATER) return;
      if (playerIntersectsBlock(x, y, z)) return;
      setBlock(x, y, z, HOTBAR[slot].id);
      remeshAround(x, z);
    }
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("pointerlockchange", onPointerLockChange);
  renderer.domElement.addEventListener("mousedown", onMouseDown);
  renderer.domElement.addEventListener("wheel", onWheel, { passive: true });
  renderer.domElement.addEventListener("contextmenu", onContextMenu);

  // ---- main loop ------------------------------------------------------------
  const clock = new THREE.Clock();
  let raf = 0;
  let elapsed = 0;
  let disposed = false;

  function step(dt: number) {
    const inWater =
      getBlock(Math.floor(player.pos.x), Math.floor(player.pos.y + 0.4), Math.floor(player.pos.z)) === WATER;

    // horizontal movement in yaw space
    const speed = keys.has("ShiftLeft") || keys.has("ShiftRight") ? 8.5 : 5.4;
    let mx = 0, mz = 0;
    if (keys.has("KeyW") || keys.has("ArrowUp")) mz -= 1;
    if (keys.has("KeyS") || keys.has("ArrowDown")) mz += 1;
    if (keys.has("KeyA") || keys.has("ArrowLeft")) mx -= 1;
    if (keys.has("KeyD") || keys.has("ArrowRight")) mx += 1;
    const len = Math.hypot(mx, mz) || 1;
    const sin = Math.sin(player.yaw), cos = Math.cos(player.yaw);
    const vx = ((mx * cos - mz * sin) / len) * speed;
    const vz = ((mz * cos + mx * sin) / len) * speed;
    player.vel.x = vx * (inWater ? 0.6 : 1);
    player.vel.z = vz * (inWater ? 0.6 : 1);

    if (inWater) {
      player.vel.y += (keys.has("Space") ? 14 : -9) * dt;
      player.vel.y = Math.max(-4, Math.min(4.5, player.vel.y));
    } else {
      if (keys.has("Space") && player.onGround) player.vel.y = 8.4;
      player.vel.y -= 24 * dt;
      player.vel.y = Math.max(-40, player.vel.y);
    }

    // resolve per-axis
    player.onGround = false;
    const p = player.pos;
    p.x += player.vel.x * dt;
    if (collides(p)) { p.x -= player.vel.x * dt; player.vel.x = 0; }
    p.y += player.vel.y * dt;
    if (collides(p)) {
      if (player.vel.y < 0) player.onGround = true;
      p.y -= player.vel.y * dt;
      p.y = player.vel.y < 0 ? Math.round(p.y * 1000) / 1000 : p.y;
      player.vel.y = 0;
    }
    p.z += player.vel.z * dt;
    if (collides(p)) { p.z -= player.vel.z * dt; player.vel.z = 0; }

    // safety: fell out of world
    if (p.y < -20) {
      p.set(cx + 0.5, spawnH + 2, cz + 8.5);
      player.vel.set(0, 0, 0);
    }
  }

  function animate() {
    if (disposed) return;
    raf = requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    elapsed += dt;

    if (locked) step(dt);
    camera.position.set(player.pos.x, player.pos.y + EYE, player.pos.z);
    camera.rotation.set(player.pitch, player.yaw, 0, "YXZ");

    // sky follows camera
    sky.position.copy(camera.position);
    sun.position.copy(camera.position).addScaledVector(SUN_DIR, 500);

    // petals drift + wrap around camera
    const pp = petalGeo.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < PETALS; i++) {
      let x = pp.getX(i) + Math.sin(elapsed * 1.3 + petalPhase[i]) * dt * 0.8 + dt * 0.5;
      let y = pp.getY(i) - dt * (0.9 + 0.5 * Math.sin(petalPhase[i]));
      let z = pp.getZ(i) + Math.cos(elapsed * 0.9 + petalPhase[i]) * dt * 0.6;
      // keep petals inside a 70x50x70 box centered on the camera
      const wrap = (v: number, c: number, half: number) =>
        v < c - half ? v + half * 2 : v > c + half ? v - half * 2 : v;
      x = wrap(x, camera.position.x, 35);
      y = wrap(y, camera.position.y, 25);
      z = wrap(z, camera.position.z, 35);
      pp.setXYZ(i, x, y, z);
    }
    pp.needsUpdate = true;

    // clouds drift
    for (const cloud of clouds) {
      cloud.position.x += dt * 1.1;
      if (cloud.position.x > WX + 30) cloud.position.x = -30;
    }

    // block highlight
    const r = locked ? raycast() : null;
    if (r) {
      highlight.visible = true;
      highlight.position.set(r.hit[0] + 0.5, r.hit[1] + 0.5, r.hit[2] + 0.5);
    } else {
      highlight.visible = false;
    }

    renderer.render(scene, camera);
  }
  animate();

  // ---- api -------------------------------------------------------------------
  return {
    hotbar: HOTBAR,
    start() {
      renderer.domElement.requestPointerLock();
    },
    onLockChange(cb) {
      lockCb = cb;
    },
    onSlotChange(cb) {
      slotCb = cb;
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      if (document.pointerLockElement === renderer.domElement) document.exitPointerLock();
      window.removeEventListener("resize", resize);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      renderer.domElement.removeEventListener("wheel", onWheel);
      renderer.domElement.removeEventListener("contextmenu", onContextMenu);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
      });
      solidMat.dispose();
      waterMat.dispose();
      skyMat.dispose();
      cloudMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

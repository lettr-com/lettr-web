import * as THREE from "three";

/*
 * Real-time "mail field" for the homepage hero.
 *
 * Mirrors the Spline scene the art director built (paper envelopes in three
 * sizes, a key light from the upper left, a fill from the right, a paper sky
 * over a soft horizon band) but renders it live, so the drift is endless and
 * there is no loop point to hide. Alongside envelopes it floats sealed
 * letters, a quill, a paper plane and a code tile. Tones are deliberately
 * gray: DitherHero ordered-dithers the frame into the brand palette after.
 *
 * World units follow the Spline file (1 m ≈ 50 units).
 */

export interface EnvelopeScene {
  canvas: HTMLCanvasElement;
  render(t: number): void;
  resize(width: number, height: number): void;
  dispose(): void;
}

type Kind = "envelope" | "code";

interface Spec {
  kind: Kind;
  w: number;
  h: number;
  x: number;
  z: number;
  speed: number; // units per second, upward
  phase: number; // 0..1 start along the lane
  swayK: number;
  rollK: number;
  roll: number; // resting roll in degrees
  off: number;
}

const SPECS: Spec[] = [
  {
    kind: "envelope",
    w: 500,
    h: 346,
    x: -880,
    z: 25,
    speed: 96,
    phase: 0.42,
    swayK: 0.31,
    rollK: 0.23,
    roll: 0,
    off: 0.0,
  },
  {
    kind: "envelope",
    w: 480,
    h: 332,
    x: 170,
    z: 10,
    speed: 104,
    phase: 0.55,
    swayK: 0.27,
    rollK: 0.19,
    roll: 0,
    off: 0.9,
  },
  {
    kind: "code",
    w: 330,
    h: 330,
    x: 900,
    z: 30,
    speed: 92,
    phase: 0.86,
    swayK: 0.35,
    rollK: 0.21,
    roll: 6,
    off: 1.8,
  },
  {
    kind: "envelope",
    w: 340,
    h: 235,
    x: -430,
    z: 5,
    speed: 118,
    phase: 0.84,
    swayK: 0.29,
    rollK: 0.26,
    roll: 0,
    off: 2.7,
  },
  {
    kind: "code",
    w: 320,
    h: 320,
    x: -150,
    z: 20,
    speed: 112,
    phase: 0.28,
    swayK: 0.33,
    rollK: 0.24,
    roll: -6,
    off: 3.6,
  },
  {
    kind: "envelope",
    w: 250,
    h: 173,
    x: 560,
    z: 15,
    speed: 132,
    phase: 0.3,
    swayK: 0.37,
    rollK: 0.28,
    roll: 0,
    off: 4.5,
  },
  {
    kind: "envelope",
    w: 380,
    h: 263,
    x: -690,
    z: 18,
    speed: 108,
    phase: 0.1,
    swayK: 0.3,
    rollK: 0.2,
    roll: 0,
    off: 6.3,
  },
  {
    kind: "code",
    w: 260,
    h: 260,
    x: 380,
    z: 8,
    speed: 124,
    phase: 0.72,
    swayK: 0.28,
    rollK: 0.25,
    roll: 8,
    off: 7.2,
  },
  {
    kind: "envelope",
    w: 240,
    h: 166,
    x: -20,
    z: 32,
    speed: 128,
    phase: 0.95,
    swayK: 0.32,
    rollK: 0.2,
    roll: 0,
    off: 9.0,
  },
];

const LANE_BOTTOM = -900;
const LANE_RANGE = 1800;

interface Mats {
  face: THREE.Material;
  fold: THREE.Material;
  ink: THREE.Material;
  glyph: THREE.Material;
}

function extruded(shape: THREE.Shape, depth: number, mat: THREE.Material): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false }), mat);
  m.castShadow = true;
  return m;
}

function box(w: number, h: number, d: number, mat: THREE.Material): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.castShadow = true;
  return m;
}

function makeEnvelope(s: Spec, mats: Mats): THREE.Group {
  const g = new THREE.Group();
  g.add(box(s.w, s.h, 4, mats.face));
  const half = (s.w - 6) / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-half, s.h / 2 - 3);
  shape.lineTo(half, s.h / 2 - 3);
  shape.lineTo(0, -s.h * 0.12);
  shape.closePath();
  const flap = extruded(shape, 1.5, mats.fold);
  flap.position.z = 2.2;
  g.add(flap);
  return g;
}

function makeCode(s: Spec, mats: Mats): THREE.Group {
  // Inverted tile: paper square (radius 0) carrying a </> glyph in a mid gray
  // that the dither maps to crimson rather than ink.
  // Chevrons are two arms meeting at an apex, spaced so the three marks
  // stay separate once the frame is dithered at 3px cells.
  const g = new THREE.Group();
  g.add(box(s.w, s.h, 6, mats.face));
  const stroke = s.w * 0.065;
  const arm = s.w * 0.25;
  const lift = 4.5;
  const q = Math.SQRT1_2;
  const chevron = (dir: 1 | -1, apexX: number) => {
    for (const sign of [1, -1]) {
      const b = box(stroke, arm, 3, mats.glyph);
      b.position.set(apexX + dir * arm * 0.5 * q, sign * arm * 0.5 * q, lift);
      b.rotation.z = -dir * sign * (Math.PI / 4);
      g.add(b);
    }
  };
  chevron(1, -s.w * 0.4);
  chevron(-1, s.w * 0.4);
  const slash = box(stroke, s.h * 0.46, 3, mats.glyph);
  slash.position.set(0, 0, lift);
  slash.rotation.z = THREE.MathUtils.degToRad(18);
  g.add(slash);
  return g;
}

function makeSkyTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 4;
  c.height = 512;
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, "#ffffff");
  grad.addColorStop(0.5, "#f8f8f8");
  grad.addColorStop(0.68, "#ececec");
  grad.addColorStop(0.78, "#d6d6d6");
  grad.addColorStop(0.88, "#bdbdbd");
  grad.addColorStop(1, "#9c9c9c");
  g.fillStyle = grad;
  g.fillRect(0, 0, 4, 512);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

export function createEnvelopeScene(width: number, height: number): EnvelopeScene {
  const canvas = document.createElement("canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#ffffff");

  const camera = new THREE.PerspectiveCamera(30, width / height, 100, 8000);
  camera.position.set(150, 240, 1750);
  camera.lookAt(120, -60, 0);

  const sky = new THREE.Mesh(
    new THREE.PlaneGeometry(9000, 2400),
    new THREE.MeshBasicMaterial({ map: makeSkyTexture() }),
  );
  sky.position.set(0, 80, -900);
  scene.add(sky);

  const catcher = new THREE.Mesh(
    new THREE.PlaneGeometry(6000, 3000),
    new THREE.ShadowMaterial({ color: "#000000", opacity: 0.4 }),
  );
  catcher.position.set(0, 0, -30);
  catcher.receiveShadow = true;
  scene.add(catcher);

  const mats: Mats = {
    face: new THREE.MeshLambertMaterial({ color: "#dedede" }),
    fold: new THREE.MeshLambertMaterial({ color: "#606060" }),
    ink: new THREE.MeshLambertMaterial({ color: "#2a2a2a" }),
    glyph: new THREE.MeshLambertMaterial({ color: "#8a8a8a" }),
  };

  const key = new THREE.DirectionalLight("#ffffff", 2.2);
  key.position.set(-800, 700, 1100);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -1700;
  key.shadow.camera.right = 1700;
  key.shadow.camera.top = 1200;
  key.shadow.camera.bottom = -1200;
  key.shadow.camera.near = 200;
  key.shadow.camera.far = 4000;
  key.shadow.radius = 3;
  scene.add(key);
  scene.add(key.target);

  const fill = new THREE.DirectionalLight("#ffffff", 0.6);
  fill.position.set(900, 100, 900);
  scene.add(fill);
  scene.add(new THREE.AmbientLight("#ffffff", 0.9));

  const builders: Record<Kind, (s: Spec, m: Mats) => THREE.Group> = {
    envelope: makeEnvelope,
    code: makeCode,
  };

  const objects = SPECS.map((s) => {
    const g = builders[s.kind](s, mats);
    g.position.set(s.x, 0, s.z);
    scene.add(g);
    return g;
  });

  function resize(w: number, h: number) {
    renderer.setSize(Math.max(2, Math.round(w)), Math.max(2, Math.round(h)), false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function render(t: number) {
    for (let i = 0; i < objects.length; i++) {
      const s = SPECS[i];
      const g = objects[i];
      // endless lane: constant rise, wrapped while fully outside the frame
      const f = (s.phase + (t * s.speed) / LANE_RANGE) % 1;
      g.position.y = LANE_BOTTOM + f * LANE_RANGE + Math.sin(t * 0.9 + s.off) * 10;
      g.position.x = s.x + Math.sin(t * s.swayK * 2 + s.off * 1.3) * 12;
      g.rotation.z = THREE.MathUtils.degToRad(s.roll + Math.sin(t * s.rollK * 2 + s.off) * 9);
      g.rotation.y = THREE.MathUtils.degToRad(-5 + Math.sin(t * 0.5 + s.off * 0.7) * 4);
    }
    sky.position.y = 80 + Math.sin(t * 0.11) * 30;
    key.position.x = -800 + Math.sin(t * 0.07) * 220;
    key.position.y = 700 + Math.cos(t * 0.09) * 90;
    renderer.render(scene, camera);
  }

  function dispose() {
    renderer.dispose();
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh) o.geometry.dispose();
    });
    for (const m of Object.values(mats)) m.dispose();
  }

  resize(width, height);
  return { canvas, render, resize, dispose };
}

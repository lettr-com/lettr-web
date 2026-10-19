/*
 * The /laravel hero: an isometric field of instanced tiles in raw WebGL2, one
 * draw call. Hover lifts the tiles under the cursor, a click sends a square wave
 * along the grid (the iso camera shows it as a diamond, like the Lettr mark) that
 * extrudes the tiles and turns them 45 degrees on the way up.
 *
 * The loop pauses when the hero is off screen or the tab is hidden. With
 * reduced motion it draws a single frozen wave and never animates.
 */

type Mat4 = Float32Array;
type Vec3 = [number, number, number];

interface Ripple {
  /** Screen position in CSS px. */
  x: number;
  y: number;
  /** Field time the ripple started. */
  t0: number;
  strength: number;
  /** Ground position, resolved lazily against the current camera. */
  ground?: [number, number];
}

export interface TileFieldOptions {
  /** Draw one still frame and skip the loop and pointer handling. */
  reduced: boolean;
  /** Called once the first frame is on the canvas. */
  onReady?: () => void;
}

export interface TileField {
  destroy(): void;
}

// The field is a soft texture, so 1.5x looks the same as 2x for ~44% fewer pixels to shade.
const MAX_DPR = 1.5;
const MAX_RIPPLES = 6;
const RIPPLE_LIFE = 5;
const COLS = 92;
const ROWS = 84;
const MOBILE_BREAKPOINT = 760;

const vertexShader = `#version 300 es
precision highp float;
layout(location=0) in vec3 aPos;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec3 aTile;
uniform mat4 uVP;
uniform float uTime;
uniform vec4 uRipples[${MAX_RIPPLES}];
uniform int uRippleCount;
uniform vec3 uPointer;
out vec3 vNormal;
out vec3 vLocal;
out vec3 vWorld;
out float vGlow;
out float vShade;

float hash(float n) { return fract(sin(n) * 43758.5453); }

// Distance along the grid's rows and columns, so waves spread as squares.
float spread(vec2 a, vec2 b) {
	vec2 d = abs(a - b);
	return max(d.x, d.y);
}

void main() {
	vec2 c = aTile.xy;
	float seed = aTile.z;
	float ring = 0.0;
	for (int i = 0; i < ${MAX_RIPPLES}; i++) {
		if (i >= uRippleCount) break;
		vec4 r = uRipples[i];
		float age = uTime - r.z;
		float x = spread(c, r.xy) - age * 8.5;
		float env = exp(-age * 0.55) * r.w;
		ring += (exp(-x * x / 2.2) + 0.35 * exp(-(x + 4.5) * (x + 4.5) / 3.0)) * env;
	}
	float lens = 0.0;
	if (uPointer.z > 0.01) {
		float d = distance(c, uPointer.xy);
		lens = exp(-d * d / 9.0) * uPointer.z;
	}
	float idle = sin(c.x * 0.33 + uTime * 0.5) * sin(c.y * 0.41 - uTime * 0.37);
	float lift = ring * 1.25 + lens * 0.55 + idle * 0.06;
	float turn = clamp(ring * 1.3 + lens * 0.9, 0.0, 1.0);
	float rot = turn * turn * (3.0 - 2.0 * turn) * 0.78539816;

	vec3 p = aPos;
	p.y = mix(-1.5, 0.14 + max(lift, -0.1), aPos.y);
	p.xz *= mix(0.84, 0.7, turn);
	float cs = cos(rot), sn = sin(rot);
	mat2 R = mat2(cs, -sn, sn, cs);
	p.xz = R * p.xz;
	vec3 n = aNormal;
	n.xz = R * n.xz;

	vWorld = vec3(c.x + p.x, p.y, c.y + p.z);
	vNormal = n;
	vLocal = aPos;
	vGlow = clamp(ring * 1.6 + lens * 0.7, 0.0, 1.0);
	float pulse = pow(0.5 + 0.5 * sin(uTime * (0.25 + hash(seed) * 0.35) + seed * 61.0), 14.0);
	vShade = hash(seed * 7.31) * hash(seed * 3.7) * 0.3 + pulse * 0.7;
	gl_Position = uVP * vec4(vWorld, 1.0);
}`;

const fragmentShader = `#version 300 es
precision highp float;
in vec3 vNormal;
in vec3 vLocal;
in vec3 vWorld;
in float vGlow;
in float vShade;
uniform vec3 uEye;
uniform vec2 uRes;
uniform float uMobile;
out vec4 outColor;

void main() {
	vec3 n = normalize(vNormal);
	vec3 deep = vec3(0.078, 0.004, 0.039);
	vec3 tile = mix(vec3(0.085, 0.012, 0.04), vec3(0.42, 0.1, 0.2), vShade);
	vec3 pink = vec3(0.925, 0.063, 0.294);
	vec3 blush = vec3(0.976, 0.78, 0.83);
	vec3 col = mix(tile, pink, vGlow * 0.9);
	col = mix(col, blush, smoothstep(0.75, 1.0, vGlow) * 0.45);
	if (n.y > 0.5) {
		vec2 e = abs(vLocal.xz);
		float edge = smoothstep(0.43, 0.49, max(e.x, e.y));
		col += edge * (0.05 + vGlow * 0.25);
	} else {
		float lam = 0.25 + 0.45 * max(0.0, dot(n, normalize(vec3(-0.5, 0.4, 0.8))));
		col *= lam;
	}
	col = mix(col, deep, smoothstep(28.0, 62.0, distance(vWorld, uEye)));
	vec2 uv = gl_FragCoord.xy / uRes;
	// Calm the field behind the copy: the left half on desktop, the bottom on mobile.
	float m = uMobile > 0.5
		? mix(0.3, 1.0, smoothstep(0.35, 0.75, uv.y))
		: mix(0.28, 1.0, smoothstep(0.3, 0.6, uv.x));
	outColor = vec4(mix(deep, col, m), 1.0);
}`;

export function createTileField(
  canvas: HTMLCanvasElement,
  host: HTMLElement,
  { reduced, onReady }: TileFieldOptions,
): TileField | null {
  const gl = canvas.getContext("webgl2", { antialias: true, powerPreference: "low-power" });
  if (!gl) return null;

  let program: WebGLProgram;
  try {
    program = createProgram(gl, vertexShader, fragmentShader);
  } catch {
    return null;
  }

  const u = (name: string) => gl.getUniformLocation(program, name);
  const loc = {
    vp: u("uVP"),
    time: u("uTime"),
    ripples: u("uRipples"),
    count: u("uRippleCount"),
    pointer: u("uPointer"),
    eye: u("uEye"),
    res: u("uRes"),
    mobile: u("uMobile"),
  };

  // Seeded, so the static frame is the same on every load.
  let seed = 1337;
  const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const tiles = new Float32Array(COLS * ROWS * 3);
  for (let j = 0, k = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++, k += 3) {
      tiles[k] = i - COLS / 2;
      tiles[k + 1] = j - ROWS + 26;
      tiles[k + 2] = random() * 100;
    }
  }

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const cubeBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, cubeGeometry(), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
  const tileBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tileBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, tiles, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2, 3, gl.FLOAT, false, 12, 0);
  gl.vertexAttribDivisor(2, 1);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.clearColor(0.078, 0.004, 0.039, 1);

  let width = 0;
  let height = 0;
  let mobile = false;
  let vp: Mat4 = new Float32Array(16);
  let invVP: Mat4 = new Float32Array(16);
  let eye: Vec3 = [0, 0, 0];
  let time = 0;
  let ripples: Ripple[] = [];
  let pointerStrength = 0;
  const pointer = { x: -9999, y: -9999, sx: -9999, sy: -9999, active: false };
  let lastInteraction = performance.now();
  const rippleData = new Float32Array(MAX_RIPPLES * 4);

  function addRipple(x: number, y: number, strength: number) {
    ripples.push({ x, y, t0: time, strength });
    if (ripples.length > MAX_RIPPLES) ripples.shift();
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    gl!.viewport(0, 0, canvas.width, canvas.height);
    mobile = width < MOBILE_BREAKPOINT;
    // True isometric: raised tiles read as line cubes.
    const target: Vec3 = mobile ? [0, 0, -12] : [2, 0, -12];
    eye = [target[0] + 20, 22, target[2] + 20];
    const half = mobile ? 19 : 15;
    const aspect = width / height;
    const proj = mat4.ortho(-half * aspect, half * aspect, -half, half, 0.1, 120);
    vp = mat4.multiply(proj, mat4.lookAt(eye, target, [0, 1, 0]));
    invVP = mat4.invert(vp);
    for (const r of ripples) r.ground = undefined;
  }

  function draw(dt: number) {
    const k = 1 - Math.pow(0.0008, dt);
    pointer.sx += (pointer.x - pointer.sx) * k;
    pointer.sy += (pointer.y - pointer.sy) * k;
    pointerStrength += ((pointer.active ? 1 : 0) - pointerStrength) * Math.min(1, dt * 4);
    ripples = ripples.filter((r) => time - r.t0 < RIPPLE_LIFE);

    const g = gl!;
    g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT);
    g.useProgram(program);
    g.bindVertexArray(vao);

    const [gx, gz] = screenToGround(invVP, pointer.sx, pointer.sy, width, height);
    rippleData.fill(0);
    ripples.forEach((r, i) => {
      r.ground ??= screenToGround(invVP, r.x, r.y, width, height);
      rippleData.set([r.ground[0], r.ground[1], r.t0, r.strength], i * 4);
    });

    g.uniformMatrix4fv(loc.vp, false, vp);
    g.uniform1f(loc.time, time);
    g.uniform4fv(loc.ripples, rippleData);
    g.uniform1i(loc.count, ripples.length);
    g.uniform3f(loc.pointer, gx, gz, pointerStrength);
    g.uniform3fv(loc.eye, eye);
    g.uniform2f(loc.res, canvas.width, canvas.height);
    g.uniform1f(loc.mobile, mobile ? 1 : 0);
    g.drawArraysInstanced(g.TRIANGLES, 0, 30, COLS * ROWS);
  }

  function drawStill() {
    // A frozen wave where the copy is not.
    time = 7;
    ripples = [
      {
        x: width * (mobile ? 0.5 : 0.7),
        y: height * (mobile ? 0.3 : 0.5),
        t0: 6.25,
        strength: 1,
      },
    ];
    draw(0);
  }

  let raf = 0;
  let visible = true;
  let last = performance.now();
  let ready = false;

  function markReady() {
    if (ready) return;
    ready = true;
    onReady?.();
  }

  function loop(now: number) {
    const dt = Math.min((now - last) / 1000, 1 / 20);
    last = now;
    time += dt;
    // An occasional ripple while idle, so the interaction is discoverable.
    if (now - lastInteraction > 5200) {
      const x = mobile
        ? width * (0.2 + Math.random() * 0.6)
        : width * (0.58 + Math.random() * 0.32);
      const y = mobile
        ? height * (0.2 + Math.random() * 0.3)
        : height * (0.3 + Math.random() * 0.5);
      addRipple(x, y, 0.7);
      lastInteraction = now;
    }
    draw(dt);
    markReady();
    raf = requestAnimationFrame(loop);
  }

  function start() {
    if (raf || reduced || !visible || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(loop);
  }

  function stop() {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  const relative = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    return [event.clientX - rect.left, event.clientY - rect.top] as const;
  };

  function onPointerMove(event: PointerEvent) {
    if (event.pointerType === "touch") return;
    [pointer.x, pointer.y] = relative(event);
    if (!pointer.active) {
      pointer.sx = pointer.x;
      pointer.sy = pointer.y;
    }
    pointer.active = true;
    lastInteraction = performance.now();
  }

  function onPointerLeave() {
    pointer.active = false;
  }

  function onPointerDown(event: PointerEvent) {
    if ((event.target as Element | null)?.closest("a, button, input, [data-no-ripple]")) return;
    const [x, y] = relative(event);
    addRipple(x, y, 1);
    lastInteraction = performance.now();
  }

  function onVisibilityChange() {
    if (document.hidden) stop();
    else start();
  }

  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (reduced) drawStill();
  });
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  });

  resize();
  if (reduced) {
    drawStill();
    markReady();
  } else {
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerleave", onPointerLeave);
    host.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("visibilitychange", onVisibilityChange);
    intersectionObserver.observe(canvas);
    // Open on a wave, so the field is alive before anyone touches it.
    addRipple(width * (mobile ? 0.5 : 0.7), height * (mobile ? 0.3 : 0.5), 0.8);
    start();
  }
  resizeObserver.observe(canvas);

  return {
    destroy() {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      host.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      gl.deleteBuffer(cubeBuffer);
      gl.deleteBuffer(tileBuffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    },
  };
}

function createProgram(gl: WebGL2RenderingContext, vs: string, fs: string): WebGLProgram {
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("Could not create shader");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) ?? "Shader compile failed");
    }
    return shader;
  };
  const program = gl.createProgram();
  if (!program) throw new Error("Could not create program");
  gl.attachShader(program, compile(gl.VERTEX_SHADER, vs));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? "Program link failed");
  }
  return program;
}

/** Unit cube with x/z in [-0.5, 0.5] and y in [0, 1]; five faces, no bottom. */
function cubeGeometry(): Float32Array {
  const faces: [Vec3, Vec3[]][] = [
    [
      [0, 1, 0],
      [
        [-1, 1, 1],
        [1, 1, 1],
        [1, 1, -1],
        [-1, 1, -1],
      ],
    ],
    [
      [0, 0, 1],
      [
        [-1, 0, 1],
        [1, 0, 1],
        [1, 1, 1],
        [-1, 1, 1],
      ],
    ],
    [
      [0, 0, -1],
      [
        [1, 0, -1],
        [-1, 0, -1],
        [-1, 1, -1],
        [1, 1, -1],
      ],
    ],
    [
      [1, 0, 0],
      [
        [1, 0, 1],
        [1, 0, -1],
        [1, 1, -1],
        [1, 1, 1],
      ],
    ],
    [
      [-1, 0, 0],
      [
        [-1, 0, -1],
        [-1, 0, 1],
        [-1, 1, 1],
        [-1, 1, -1],
      ],
    ],
  ];
  const data: number[] = [];
  for (const [normal, quad] of faces) {
    for (const index of [0, 1, 2, 0, 2, 3]) {
      const [x, y, z] = quad[index];
      data.push(x * 0.5, y, z * 0.5, ...normal);
    }
  }
  return new Float32Array(data);
}

const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const normalize = (a: Vec3): Vec3 => {
  const l = Math.hypot(...a) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

const mat4 = {
  ortho(l: number, r: number, b: number, t: number, n: number, f: number): Mat4 {
    const lr = 1 / (l - r);
    const bt = 1 / (b - t);
    const nf = 1 / (n - f);
    return new Float32Array([
      -2 * lr,
      0,
      0,
      0,
      0,
      -2 * bt,
      0,
      0,
      0,
      0,
      2 * nf,
      0,
      (l + r) * lr,
      (t + b) * bt,
      (f + n) * nf,
      1,
    ]);
  },
  lookAt(eye: Vec3, center: Vec3, up: Vec3): Mat4 {
    const z = normalize(sub(eye, center));
    const x = normalize(cross(up, z));
    const y = cross(z, x);
    return new Float32Array([
      x[0],
      y[0],
      z[0],
      0,
      x[1],
      y[1],
      z[1],
      0,
      x[2],
      y[2],
      z[2],
      0,
      -dot(x, eye),
      -dot(y, eye),
      -dot(z, eye),
      1,
    ]);
  },
  multiply(a: Mat4, b: Mat4): Mat4 {
    const out = new Float32Array(16);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let s = 0;
        for (let k = 0; k < 4; k++) s += a[k * 4 + j] * b[i * 4 + k];
        out[i * 4 + j] = s;
      }
    }
    return out;
  },
  invert(m: Mat4): Mat4 {
    const [a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33] = m;
    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;
    const det = 1 / (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);
    return new Float32Array([
      (a11 * b11 - a12 * b10 + a13 * b09) * det,
      (a02 * b10 - a01 * b11 - a03 * b09) * det,
      (a31 * b05 - a32 * b04 + a33 * b03) * det,
      (a22 * b04 - a21 * b05 - a23 * b03) * det,
      (a12 * b08 - a10 * b11 - a13 * b07) * det,
      (a00 * b11 - a02 * b08 + a03 * b07) * det,
      (a32 * b02 - a30 * b05 - a33 * b01) * det,
      (a20 * b05 - a22 * b02 + a23 * b01) * det,
      (a10 * b10 - a11 * b08 + a13 * b06) * det,
      (a01 * b08 - a00 * b10 - a03 * b06) * det,
      (a30 * b04 - a31 * b02 + a33 * b00) * det,
      (a21 * b02 - a20 * b04 - a23 * b00) * det,
      (a11 * b07 - a10 * b09 - a12 * b06) * det,
      (a00 * b09 - a01 * b07 + a02 * b06) * det,
      (a31 * b01 - a30 * b03 - a32 * b00) * det,
      (a20 * b03 - a21 * b01 + a22 * b00) * det,
    ]);
  },
};

/** A screen point in CSS px, projected onto the y = 0 ground plane. */
function screenToGround(
  invVP: Mat4,
  x: number,
  y: number,
  width: number,
  height: number,
): [number, number] {
  if (!width || !height) return [0, 0];
  const nx = (x / width) * 2 - 1;
  const ny = 1 - (y / height) * 2;
  const unproject = (z: number): Vec3 => {
    const v = [nx, ny, z, 1];
    const o = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) for (let k = 0; k < 4; k++) o[i] += invVP[k * 4 + i] * v[k];
    return [o[0] / o[3], o[1] / o[3], o[2] / o[3]];
  };
  const a = unproject(-1);
  const b = unproject(1);
  const t = a[1] / (a[1] - b[1]);
  return [a[0] + (b[0] - a[0]) * t, a[2] + (b[2] - a[2]) * t];
}

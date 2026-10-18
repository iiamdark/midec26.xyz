// Minimal WebGL helpers: fullscreen fragment shaders and a wireframe globe.

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
  return s;
}

function program(gl: WebGLRenderingContext, vs: string, fs: string) {
  const p = gl.createProgram()!;
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  gl.useProgram(p);
  return p;
}

function resize(canvas: HTMLCanvasElement, gl: WebGLRenderingContext) {
  const dpr = Math.min(window.devicePixelRatio, 1.75);
  const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
}

// Runs fn every frame while the canvas is on screen.
function loop(canvas: HTMLCanvasElement, fn: (t: number) => void) {
  let visible = false, raf = 0;
  const start = performance.now();
  const tick = () => { fn((performance.now() - start) / 1000); if (visible) raf = requestAnimationFrame(tick); };
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    cancelAnimationFrame(raf);
    if (visible) raf = requestAnimationFrame(tick);
  }).observe(canvas);
}

export type Uniforms = Record<string, () => number | number[]>;

export function shaderCanvas(canvas: HTMLCanvasElement, frag: string, uniforms: Uniforms = {}) {
  const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
  if (!gl) return;
  const prog = program(gl, VERT, 'precision highp float;\nuniform vec2 uRes; uniform float uTime;\n' + frag);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uRes = gl.getUniformLocation(prog, 'uRes'), uTime = gl.getUniformLocation(prog, 'uTime');
  const custom = Object.entries(uniforms).map(([k, f]) => [gl.getUniformLocation(prog, k), f] as const);
  loop(canvas, (t) => {
    resize(canvas, gl);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, t);
    for (const [l, f] of custom) {
      const v = f();
      if (typeof v === 'number') gl.uniform1f(l, v);
      else if (v.length === 2) gl.uniform2f(l, v[0], v[1]);
      else gl.uniform3f(l, v[0], v[1], v[2]);
    }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  });
}

const NOISE = `
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0., a = .5; mat2 r = mat2(.8,.6,-.6,.8); for(int i=0;i<6;i++){ v += a*noise(p); p = r*p*2.02; a *= .5; } return v; }
`;

// Cinematic monochrome smoke with a mouse-driven light and film grain.
export const HERO_FRAG = NOISE + `
uniform vec2 uMouse; uniform float uScroll;
void main(){
  vec2 uv = gl_FragCoord.xy / uRes; vec2 p = (gl_FragCoord.xy - .5*uRes) / uRes.y;
  float t = uTime * .06;
  vec2 q = vec2(fbm(p*1.6 + t), fbm(p*1.6 - t + 4.));
  float f = fbm(p*1.4 + 2.2*q + vec2(0., uScroll*1.5));
  vec2 m = (uMouse - .5) * vec2(uRes.x/uRes.y, 1.);
  float light = .55 / (1. + 6.*length(p - m));
  float c = pow(f, 2.2) * (.45 + light) + .35*pow(q.x*q.y, 3.);
  // thin horizontal scan lines like a blueprint
  c += .025 * step(.995, fract(uv.y * 60. + t));
  c *= smoothstep(1.25, .2, length(p * vec2(.8, 1.))); // vignette
  c *= 1. - uScroll * .6;
  c += (hash(gl_FragCoord.xy + fract(uTime)) - .5) * .06; // grain
  gl_FragColor = vec4(vec3(c), 1.);
}`;

// Flowing contour lines tinted with a card/panel colour.
export const FLOW_FRAG = NOISE + `
uniform vec3 uColor; uniform float uSeed; uniform float uHover;
void main(){
  vec2 p = gl_FragCoord.xy / uRes.y;
  float t = uTime * (.05 + uHover * .15);
  float f = fbm(p * 2.2 + uSeed * 7.3 + vec2(t, -t * .7));
  float lines = abs(fract(f * 12.) - .5);
  float l = smoothstep(.06, .0, lines) * (.25 + uHover * .35);
  vec3 col = uColor * (.85 + .3 * f) + l;
  gl_FragColor = vec4(col, 1.);
}`;

// Rotating wireframe globe drawn with GL_LINES.
export function globe(canvas: HTMLCanvasElement, getSpin: () => number) {
  const gl = canvas.getContext('webgl', { antialias: true, alpha: true });
  if (!gl) return;
  const prog = program(gl,
    `attribute vec3 p; uniform float uRot; uniform float uTilt; uniform float uAspect; varying float vZ;
     void main(){
       float c = cos(uRot), s = sin(uRot); vec3 q = vec3(c*p.x + s*p.z, p.y, -s*p.x + c*p.z);
       float ct = cos(uTilt), st = sin(uTilt); q = vec3(q.x, ct*q.y - st*q.z, st*q.y + ct*q.z);
       vZ = q.z; float persp = 1. / (2.6 - q.z);
       gl_Position = vec4(q.x * persp * 2.1 / uAspect, q.y * persp * 2.1, 0., 1.);
     }`,
    `precision mediump float; varying float vZ; void main(){ gl_FragColor = vec4(1., 1., 1., mix(.08, .7, (vZ + 1.) * .5)); }`);
  const v: number[] = [];
  const seg = 96;
  const pt = (lat: number, lon: number) => [Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)];
  for (let i = 1; i < 12; i++) { // parallels
    const lat = -Math.PI / 2 + (i * Math.PI) / 12;
    for (let j = 0; j < seg; j++) v.push(...pt(lat, (j / seg) * Math.PI * 2), ...pt(lat, ((j + 1) / seg) * Math.PI * 2));
  }
  for (let i = 0; i < 18; i++) { // meridians
    const lon = (i / 18) * Math.PI * 2;
    for (let j = 0; j < seg; j++) v.push(...pt(-Math.PI / 2 + (j / seg) * Math.PI, lon), ...pt(-Math.PI / 2 + ((j + 1) / seg) * Math.PI, lon));
  }
  // orbit ring
  for (let j = 0; j < seg; j++) {
    const a = (j / seg) * Math.PI * 2, b = ((j + 1) / seg) * Math.PI * 2;
    v.push(Math.cos(a) * 1.35, Math.sin(a) * .25, Math.sin(a) * 1.35, Math.cos(b) * 1.35, Math.sin(b) * .25, Math.sin(b) * 1.35);
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  const uRot = gl.getUniformLocation(prog, 'uRot'), uTilt = gl.getUniformLocation(prog, 'uTilt'), uAspect = gl.getUniformLocation(prog, 'uAspect');
  loop(canvas, (t) => {
    resize(canvas, gl);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uRot, t * .15 + getSpin());
    gl.uniform1f(uTilt, .35);
    gl.uniform1f(uAspect, canvas.width / canvas.height);
    gl.drawArrays(gl.LINES, 0, v.length / 3);
  });
}

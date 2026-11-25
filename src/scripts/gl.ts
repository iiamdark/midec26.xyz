import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export function sculpture(canvas: HTMLCanvasElement, reduced: boolean) {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch {
    return () => {};
  }

  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, .1, 40);
  const deck = new THREE.Group();
  const record = new THREE.Group();
  const arm = new THREE.Group();
  scene.add(deck);
  deck.add(record, arm);

  const material = (color: number, metalness = .2, roughness = .45) =>
    new THREE.MeshStandardMaterial({ color, metalness, roughness });
  const casing = material(0x54121e, .34);
  const plate = material(0x260e16, .32);
  const black = material(0x141012, .23, .32);
  const groove = material(0x302027, .68, .28);
  const chrome = material(0xbac0cd, .75, .23);
  const red = material(0xf12647, .12);
  const white = material(0xe4cfca, .1);
  const add = (parent: THREE.Group, geometry: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number) => {
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  };
  const box = (parent: THREE.Group, w: number, h: number, d: number, mat: THREE.Material, x: number, y: number, z: number) =>
    add(parent, new RoundedBoxGeometry(w, h, d, 3, Math.min(w, h, d) * .23), mat, x, y, z);
  const cylinder = (parent: THREE.Group, r: number, h: number, mat: THREE.Material, x: number, y: number, z: number) =>
    add(parent, new THREE.CylinderGeometry(r, r, h, 72), mat, x, y, z);

  box(deck, 3.75, .36, 3.1, casing, 0, 0, 0);
  box(deck, 3.68, .07, 3.03, plate, 0, .194, 0);
  for (const x of [-1.43, 1.43]) {
    for (const z of [-1.1, 1.1]) cylinder(deck, .18, .11, black, x, -.225, z);
  }

  record.position.set(-.29, .23, -.03);
  cylinder(record, 1.32, .11, chrome, 0, .056, 0);
  cylinder(record, 1.28, .075, black, 0, .14, 0);
  for (let i = 0; i < 22; i++) {
    const ring = add(record, new THREE.TorusGeometry(.41 + i * .039, .005, 4, 96), groove, 0, .179, 0);
    ring.rotation.x = -Math.PI / 2;
  }
  cylinder(record, .39, .015, red, 0, .181, 0);
  cylinder(record, .035, .09, chrome, 0, .22, 0);
  box(record, .365, .012, .022, white, 0, .194, .14);
  box(record, .205, .012, .016, white, 0, .194, .19);

  arm.position.set(1.38, .24, -1.02);
  cylinder(deck, .22, .1, chrome, 1.38, .25, -1.02);
  cylinder(arm, .13, .23, black, 0, .16, 0);
  const armPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, .27, 0), new THREE.Vector3(0, .27, .55),
    new THREE.Vector3(-.12, .23, 1.05), new THREE.Vector3(-.34, .14, 1.48),
  ]);
  add(arm, new THREE.TubeGeometry(armPath, 24, .036, 10, false), chrome, 0, 0, 0);
  box(arm, .15, .11, .22, red, -.34, .134, 1.5).rotation.y = -.55;
  box(deck, .25, .08, .25, red, 1.31, .245, 1.07);
  box(deck, .06, .08, .57, chrome, -1.54, .234, 1.09);

  scene.add(new THREE.HemisphereLight(0xfff0ef, 0x592237, 2.3));
  const key = new THREE.DirectionalLight(0xffdfd9, 3.6);
  key.position.set(-3, 6, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xff294e, 5);
  rim.position.set(3, 2, -4);
  scene.add(rim);

  const host = canvas.closest<HTMLElement>('.planet-hero')!;
  const play = host.querySelector<HTMLElement>('.planet-play');
  let pointerX = 0;
  let pointerY = 0;
  let visible = false;
  let frame = 0;
  let previous = 0;
  let cue = false;

  function render(now: number) {
    frame = 0;
    const delta = Math.min((now - previous) / 1000, .05);
    previous = now;
    const aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);
    renderer.getSize(size);
    if (camera.aspect !== aspect || size.x !== canvas.clientWidth || size.y !== canvas.clientHeight) {
      renderer.setSize(Math.max(1, canvas.clientWidth), Math.max(1, canvas.clientHeight), false);
      camera.aspect = aspect;
      camera.fov = aspect < 1 ? Math.min(60, 37 / Math.max(.55, aspect)) : 32;
      camera.updateProjectionMatrix();
    }
    const mobile = aspect < 1.05;
    camera.position.set(mobile ? 3.45 : 3.2, 5.25, mobile ? 7.1 : 6.4);
    camera.lookAt(0, 0, 0);
    deck.rotation.x = THREE.MathUtils.lerp(deck.rotation.x, pointerY, .1);
    deck.rotation.y = THREE.MathUtils.lerp(deck.rotation.y, -.17 + pointerX, .1);
    arm.rotation.y = THREE.MathUtils.lerp(arm.rotation.y, cue ? -.40 : .16, .12);
    if (!reduced) record.rotation.y += delta * (cue ? 2.2 : .72);
    renderer.render(scene, camera);
    canvas.parentElement?.classList.add('gl-ready');
    if (!reduced) schedule();
  }
  const size = new THREE.Vector2();
  const schedule = () => {
    if (visible && !frame && !document.hidden) frame = requestAnimationFrame(render);
  };
  const pause = () => { cancelAnimationFrame(frame); frame = 0; };
  const visibility = () => document.hidden ? pause() : schedule();
  const move = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    const bounds = host.getBoundingClientRect();
    pointerX = ((event.clientX - bounds.left) / bounds.width - .5) * .55;
    pointerY = ((event.clientY - bounds.top) / bounds.height - .5) * .29;
  };
  const reset = () => { pointerX = 0; pointerY = 0; };
  const cueOn = () => { cue = true; };
  const cueOff = () => { cue = false; };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) schedule();
    else pause();
  });
  const resize = new ResizeObserver(schedule);
  observer.observe(canvas);
  resize.observe(canvas);
  document.addEventListener('visibilitychange', visibility);
  if (!reduced) {
    host.addEventListener('pointermove', move, { passive: true });
    host.addEventListener('pointerleave', reset);
    play?.addEventListener('focus', cueOn);
    play?.addEventListener('blur', cueOff);
    play?.addEventListener('pointerenter', cueOn);
    play?.addEventListener('pointerleave', cueOff);
  }

  return () => {
    pause();
    observer.disconnect();
    resize.disconnect();
    document.removeEventListener('visibilitychange', visibility);
    host.removeEventListener('pointermove', move);
    host.removeEventListener('pointerleave', reset);
    play?.removeEventListener('focus', cueOn);
    play?.removeEventListener('blur', cueOff);
    play?.removeEventListener('pointerenter', cueOn);
    play?.removeEventListener('pointerleave', cueOff);
    scene.traverse(object => { if (object instanceof THREE.Mesh) object.geometry.dispose(); });
    [casing, plate, black, groove, chrome, red, white].forEach(mat => mat.dispose());
    renderer.dispose();
  };
}

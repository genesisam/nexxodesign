// @ts-nocheck — escena three.js en JS plano (portada de nexxo-project-gallery/web-preview).
/**
 * Galería 3D de proyectos. `mount(root, opts)` crea el canvas dentro de `root`,
 * engancha la interfaz HTML que ya existe en el DOM (ids #panel, #list, …) y
 * devuelve { destroy, setPaused }.
 * opts.onOpenProject(slug): "Ver proyecto" → la página navega al caso.
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export async function mount(root, opts = {}) {


  const $ = (id) => document.getElementById(id);
  const ac = new AbortController();
  const addEventListener = (t, f) => window.addEventListener(t, f, { signal: ac.signal });
  const docOn = (t, f) => document.addEventListener(t, f, { signal: ac.signal });
  let paused = false;
  const setProgress = k => { const b = $('lbar'); if (b) b.style.transform = `scaleX(${Math.max(0.05, k)})`; };
  const params = new URLSearchParams(location.search);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── datos ─────────────────────────────────────────────────────────────── */
  const [manifest, projData] = await Promise.all([
    fetch('/galeria/assets/gallery_manifest.json').then(r => r.json()),
    fetch('/galeria/projects.json').then(r => r.json()),
  ]);
  const FR = manifest.frames;                       // orden de la pared
  /* salas: la pared tiene FR.length cuadros; con más proyectos se agrupan en salas
     (1–5, 6–10, …) y la misma pared cambia de imágenes con un fundido de luces. */
  const PER_ROOM = FR.length;
  const ALL = projData.projects.slice();
  const rooms = [];
  for (let k = 0; k < ALL.length; k += PER_ROOM) rooms.push(ALL.slice(k, k + PER_ROOM));
  let room = 0;
  /* sala incompleta: cuadros repartidos simétricamente en la pared de 5 */
  const SLOT_MAP = { 1: [2], 2: [1, 3], 3: [0, 2, 4], 4: [0, 1, 3, 4] };
  let roomSlots = [0, 1, 2, 3, 4];
  const slotOf = k => roomSlots[k];
  const MAT_DEFAULT = '#EEE9DF';                    // paspartú marfil si el proyecto no trae brand_color
  const FRAME_DEFAULT = '#141316';                  // marco negro por defecto (frame_color en projects.json lo cambia)

  /* ── render ────────────────────────────────────────────────────────────── */
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 768 ? 1.5 : 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.toneMapping = THREE.AgXToneMapping;
  renderer.toneMappingExposure = 1.05;
  root.prepend(renderer.domElement);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(manifest.background);
  const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.05, 80);

  const draco = new DRACOLoader().setDecoderPath('/3d/draco/');
  const gltf = await new GLTFLoader().setDRACOLoader(draco).loadAsync('/galeria/assets/nexxo_project_gallery.glb', e => setProgress(e.total ? e.loaded / e.total : 0));
  scene.add(gltf.scene);

  /* ── nodos ─────────────────────────────────────────────────────────────── */
  const colliders = [];
  gltf.scene.traverse(o => {
    if (o.isMesh && (o.userData.nx_collider || o.name.startsWith('COLLIDER_'))) {
      o.material = new THREE.MeshBasicMaterial({ visible: false });
      colliders.push(o);
    }
  });
  const frames = FR.map((f, i) => {
    const root = gltf.scene.getObjectByName(f.id);
    // piezas del marco (borde, studs y cartela) = malla fusionada con el material grafito → material propio para teñirla
    const border = [];
    // paspartú (fondo marfil dentro del marco) → se tiñe con brand_color de cada proyecto
    const mat = [];
    root.traverse(o => {
      if (!o.isMesh) return;
      if (/graphite/i.test(o.name)) { o.material = o.material.clone(); border.push(o); }
      else if (/ivory/i.test(o.name)) { o.material = o.material.clone(); mat.push(o); }
    });
    const image = gltf.scene.getObjectByName(f.image_node);
    image.material = new THREE.MeshStandardMaterial({ emissive: 0xffffff, emissiveIntensity: 0.28, roughness: 0.55 });
    return { ...f, i, root, border, mat, image, z0: root.position.z, lift: 0, project: null };
  });

  /* imágenes reales: textura dinámica (cacheada por proyecto) + escala "contain" dentro del paspartú */
  const tl = new THREE.TextureLoader();
  const texCache = new Map();
  function loadTex(p) {
    if (!texCache.has(p.image)) texCache.set(p.image, new Promise(res => tl.load('/galeria/' + p.image, tex => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.flipY = false;                                                        // convención glTF (UV origen arriba)
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      res(tex);
    }, undefined, () => res(null))));
    return texCache.get(p.image);
  }
  async function applyRoom(r) {
    room = r;
    const list = rooms[r] || [];
    roomSlots = SLOT_MAP[list.length] || list.map((_, k) => k);
    frames.forEach(f => { f.project = null; f.k = -1; });
    list.forEach((p, k) => { const f = frames[roomSlots[k]]; f.project = p; f.k = k; });
    await Promise.all(frames.map(async f => {
      const p = f.project;
      f.root.visible = !!p;                                     // sala incompleta: el hueco queda como muro
      if (!p) return;
      f.border.forEach(m => m.material.color.set(p.frame_color || FRAME_DEFAULT));
      f.mat.forEach(m => m.material.color.set(p.brand_color || MAT_DEFAULT));
      const tex = await loadTex(p);
      if (!tex) return;
      const a = tex.image.width / tex.image.height;
      let w = f.max_w, h = w / a;
      if (h > f.max_h) { h = f.max_h; w = h * a; }
      f.image.scale.set(w, h, 1);
      f.image.material.map = f.image.material.emissiveMap = tex;
      f.image.material.needsUpdate = true;
    }));
    rooms[r + 1]?.forEach(loadTex);                             // precarga la sala siguiente
  }
  await applyRoom(0);
  setProgress(1);
  $('loader').classList.add('done');

  /* ── luces (posiciones del manifiesto) ─────────────────────────────────── */
  const hemi = new THREE.HemisphereLight(0xffe2c2, 0x2a2420, 0.9); scene.add(hemi);
  const spots = {};
  const others = [];
  for (const L of manifest.lights) {
    const pos = new THREE.Vector3(...L.position), dir = new THREE.Vector3(...L.direction);
    if (L.type === 'SPOT') {
      const s = new THREE.SpotLight(new THREE.Color(...L.color), 0, 9, THREE.MathUtils.degToRad(L.angle_deg) / 2, 0.55, 1.4);
      s.position.copy(pos); s.target.position.copy(pos.clone().add(dir.multiplyScalar(3)));
      scene.add(s, s.target); s.userData.base = 38;
      spots[L.frame] = s;
    } else if (L.name === 'LGT_WINDOW') {
      const p = new THREE.PointLight(0xb8a6ff, 0, 9, 1.6); p.position.copy(pos); p.userData.base = 6; scene.add(p); others.push(p);
    } else if (L.name === 'LGT_FILL') {
      const d = new THREE.DirectionalLight(0xffd2a6, 0); d.position.copy(pos); d.target.position.copy(pos.clone().add(dir));
      d.userData.base = 1.1; scene.add(d, d.target); others.push(d);
    }
  }
  hemi.userData.base = 0.9;

  /* ── personaje ─────────────────────────────────────────────────────────── */
  const mixer = new THREE.AnimationMixer(gltf.scene);
  const idle = gltf.animations.find(a => a.name === 'CHARACTER_IDLE');
  if (idle && !reduced) mixer.clipAction(idle).play();

  /* ── cámara ────────────────────────────────────────────────────────────── */
  let mobile = innerWidth < innerHeight || innerWidth < 768;
  root.classList.toggle('mobile', mobile);
  const lensToVFov = (lens, aspect) => aspect >= 1
    ? THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(Math.atan(18 / lens)) / aspect))
    : THREE.MathUtils.radToDeg(2 * Math.atan(18 / lens));
  const pose = (p) => ({ eye: new THREE.Vector3(...p.eye), target: new THREE.Vector3(...p.target), lens: p.lens_mm });
  /* plano general desktop: parte de la cámara de Blender y retrocede hasta que los 5 marcos
     (con margen para el parallax) entran en pantalla, sea cual sea la proporción de la ventana */
  const _fitCam = new THREE.PerspectiveCamera();
  function fitAll(p) {
    const pts = [];
    frames.forEach(f => {
      const c = new THREE.Vector3(...f.center), hw = f.outer_w / 2 + 0.25, hh = f.outer_h / 2 + 0.35;
      for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) pts.push(c.clone().add(new THREE.Vector3(sx * hw, sy * hh, 0)));
    });
    _fitCam.aspect = innerWidth / innerHeight; _fitCam.fov = lensToVFov(p.lens, _fitCam.aspect); _fitCam.updateProjectionMatrix();
    const dir = p.eye.clone().sub(p.target).normalize(), eye = p.eye.clone();
    for (let k = 0; k < 60; k++) {
      _fitCam.position.copy(eye); _fitCam.lookAt(p.target); _fitCam.updateMatrixWorld();
      if (pts.every(v => { const q = v.clone().project(_fitCam); return Math.abs(q.x) < 0.9 && q.y < 0.86 && q.y > -0.7; })) break;
      eye.addScaledVector(dir, 0.12);
    }
    return { eye, target: p.target, lens: p.lens };
  }
  const homePose = () => mobile ? pose(manifest.cameras.CAM_GALLERY_MOBILE) : fitAll(pose(manifest.cameras.CAM_GALLERY_DESKTOP));
  function focusPose(f) {
    const p = pose(mobile ? f.focus_mobile : f.focus_desktop);
    if (mobile) { p.target.y -= 0.3; p.eye.y -= 0.15; }                         // cuadro arriba, panel abajo
    if (!mobile) { const k = new THREE.Vector3(-0.7, 0, 0); p.eye.add(k); p.target.add(k); p.eye.z += 1.0; }   // cuadro a la derecha, texto a la izquierda
    return p;
  }
  const browsePose = (f) => pose(f.browse_mobile);
  let cur = homePose();
  function apply(p) {
    cur = p;
    camera.fov = lensToVFov(p.lens, innerWidth / innerHeight); camera.updateProjectionMatrix();
    place();
  }
  /* movimiento interno: parallax con el puntero + arrastre limitado (como el estudio).
     Se suma encima de la pose base girando el ojo alrededor del objetivo. */
  const look = { yaw: 0, pitch: 0 };                     // valor suavizado aplicado
  const par = { x: 0, y: 0 };                            // puntero normalizado −1..1
  const drag = { yaw: 0, pitch: 0, active: false, x: 0, y: 0 };
  const PAR_YAW = 0.06, PAR_PITCH = 0.03;                // rad de parallax
  const DRAG_YAW = 0.16, DRAG_PITCH = 0.07;              // límites del arrastre
  const _off = new THREE.Vector3(), _right = new THREE.Vector3(), _Y = new THREE.Vector3(0, 1, 0);
  function place() {
    _off.copy(cur.eye).sub(cur.target);
    _off.applyAxisAngle(_Y, look.yaw);
    _right.crossVectors(_Y, _off).normalize();
    _off.applyAxisAngle(_right, look.pitch);
    camera.position.copy(cur.target).add(_off);
    camera.lookAt(cur.target);
  }
  function updateLook(dt, t) {
    const k = state === 'focus' ? 0.35 : state === 'moving' ? 0.15 : 1;     // más quieto al leer un proyecto
    let yaw = -par.x * PAR_YAW * k + drag.yaw, pitch = par.y * PAR_PITCH * k + drag.pitch;
    if (mobile) { yaw = Math.sin(t * 0.35) * 0.025 * k; pitch = Math.sin(t * 0.27) * 0.012 * k; }   // respiración suave en móvil
    if (reduced) { yaw = 0; pitch = 0; }
    if (!drag.active) { drag.yaw *= Math.exp(-dt * 1.6); drag.pitch *= Math.exp(-dt * 1.6); }   // vuelve solo al soltar
    const s = 1 - Math.exp(-dt * 4);
    look.yaw += (yaw - look.yaw) * s; look.pitch += (pitch - look.pitch) * s;
    place();
  }
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;   // power3.inOut
  let tween = null;
  function goTo(p, dur) {
    if (reduced) { apply(p); return Promise.resolve(); }
    return new Promise(done => { tween = { a: { eye: cur.eye.clone(), target: cur.target.clone(), lens: cur.lens }, b: p, t: 0, dur, done }; });
  }

  /* ── estado ────────────────────────────────────────────────────────────── */
  let state = 'intro', hovered = null, index = 0, lightK = 0;
  const spotGain = {}; frames.forEach(f => spotGain[f.id] = 0);

  function setLights(k, dimExcept = null) {
    lightK = k;
    hemi.intensity = hemi.userData.base * k * (dimExcept ? 0.55 : 1);
    others.forEach(o => o.intensity = o.userData.base * k * (dimExcept ? 0.5 : 1));
  }

  /* lista y navegación HTML (accesible), se rehace al cambiar de sala */
  const pad = n => String(n).padStart(2, '0');
  const globalNo = i => room * PER_ROOM + frames[i].k + 1;
  const roomSize = () => rooms[room].length;
  function buildList() {
    const L = $('list'); L.innerHTML = '';
    if (rooms.length > 1) {
      const prev = document.createElement('button');
      prev.textContent = '←'; prev.setAttribute('aria-label', 'Sala anterior'); prev.onclick = () => goRoom(room - 1);
      L.appendChild(prev);
    }
    frames.forEach((f, i) => {
      if (!f.project) return;
      const b = document.createElement('button');
      b.dataset.i = i;
      b.innerHTML = `<span class="n">${pad(globalNo(i))}</span>${f.project.title}`;
      b.onclick = () => select(i);
      b.onmouseenter = () => hover(f); b.onmouseleave = () => hover(null);
      b.onfocus = () => hover(f); b.onblur = () => hover(null);
      L.appendChild(b);
    });
    if (rooms.length > 1) {
      const next = document.createElement('button');
      next.innerHTML = `Sala ${room + 1}/${rooms.length} →`; next.setAttribute('aria-label', 'Sala siguiente'); next.onclick = () => goRoom(room + 1);
      L.appendChild(next);
    }
    $('dots').innerHTML = ALL.map(() => '<i></i>').join('');
  }
  function syncMobileNav() {
    const f = frames[index];
    $('mnum').textContent = `${pad(globalNo(index))} / ${pad(ALL.length)} · tocar para abrir`;
    $('mtitle').textContent = f.project.title;
    [...$('dots').children].forEach((d, k) => d.classList.toggle('on', k === globalNo(index) - 1));
  }
  buildList();

  function hover(f) {
    if (state !== 'home') f = null;
    hovered = f;
    [...$('list').children].forEach(b => b.classList.toggle('on', !!f && b.dataset.i == f.i));
    renderer.domElement.style.cursor = f ? 'pointer' : '';
  }

  /* cambio de sala: focos se apagan, la pared cambia de imágenes y se vuelven a encender */
  let roomFade = 1, roomFadeTarget = 1;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function goRoom(r, at = 0) {
    r = (r + rooms.length) % rooms.length;
    if (r === room && rooms.length > 1) return;
    roomFadeTarget = 0; await wait(reduced ? 0 : 380);
    await applyRoom(r);
    index = slotOf(Math.min(at, roomSize() - 1));
    buildList(); syncMobileNav();
    roomFadeTarget = 1;
  }

  async function select(i) {
    if (state === 'intro') skipIntro();
    if (state === 'moving') return;
    index = i;
    const f = frames[index];
    hover(null);
    state = 'moving';
    $('list').classList.add('hide'); $('mnav').classList.add('hide'); $('dots').classList.add('hide');
    $('vignette').style.opacity = 1;
    fillPanel(f);
    await goTo(focusPose(f), 1.15);
    state = 'focus';
    $('panel').classList.add('on');
    $('plink').focus({ preventScroll: true });
  }
  function fillPanel(f) {
    const p = f.project;
    $('pnum').textContent = `${pad(globalNo(f.i))} — ${p.year}`;
    $('ptitle').textContent = p.title;
    $('pcat').textContent = p.category;
    $('psum').textContent = p.summary;
    $('psrv').innerHTML = p.services.map(s => `<li>${s}</li>`).join('');
    $('plink').href = `/proyectos/${p.slug}`;
    $('plink').dataset.slug = p.slug;
  }
  async function back() {
    if (state !== 'focus') return;
    state = 'moving';
    $('panel').classList.remove('on');
    $('vignette').style.opacity = 0;
    await goTo(mobile ? browsePose(frames[index]) : homePose(), 1.0);
    state = mobile ? 'browse' : 'home';
    $('list').classList.remove('hide'); $('mnav').classList.remove('hide'); $('dots').classList.remove('hide');
    syncMobileNav();
  }
  /* siguiente/anterior recorre TODOS los proyectos; al pasar el borde de la sala cambia de sala */
  function nextSlot(d) {
    const g = (room * PER_ROOM + frames[index].k + d + ALL.length) % ALL.length;
    return { r: Math.floor(g / PER_ROOM), k: g % PER_ROOM };
  }
  async function step(d) {
    const n = nextSlot(d);
    if (state === 'focus') {
      $('panel').classList.remove('on'); state = 'home';
      if (n.r !== room) await goRoom(n.r, n.k);
      return select(slotOf(n.k));
    }
    if (state === 'browse') {
      state = 'moving';
      if (n.r !== room) await goRoom(n.r, n.k);
      index = slotOf(n.k); syncMobileNav();
      await goTo(browsePose(frames[index]), 0.7); state = 'browse';
    }
  }

  /* ── intro: luces tenues → focos en cascada → dolly corto ─────────────── */
  let introT = 0;
  const INTRO = manifest.transitions.GALLERY_INTRO.seconds;
  function startIntro() {
    const start = mobile ? browsePose(frames[2]) : homePose();
    index = 2;
    const back = start.eye.clone().sub(start.target).normalize().multiplyScalar(1.6);
    apply({ eye: start.eye.clone().add(back), target: start.target.clone(), lens: start.lens });
    tween = { a: { eye: cur.eye.clone(), target: cur.target.clone(), lens: cur.lens }, b: start, t: 0, dur: INTRO, done: null };
    introT = 0; state = 'intro';
    $('list').classList.add('hide');
  }
  function skipIntro() {
    if (state !== 'intro') return;
    introT = INTRO; tween = null;
    apply(mobile ? browsePose(frames[index]) : homePose());
    endIntro();
  }
  function endIntro() {
    state = mobile ? 'browse' : 'home';
    setLights(1);
    $('skip').classList.add('hide');
    $('list').classList.remove('hide');
    syncMobileNav();
  }
  $('skip').onclick = skipIntro;
  if (reduced || params.get('intro') === '0') { apply(mobile ? browsePose(frames[2]) : homePose()); index = 2; introT = INTRO; endIntro(); }
  else startIntro();

  /* ── entrada ───────────────────────────────────────────────────────────── */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  function pick(x, y) {
    ndc.set(x / innerWidth * 2 - 1, -(y / innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(colliders, false)[0];
    const f = hit ? frames.find(f => f.collider === hit.object.name || f.id === hit.object.userData.nx_interactive) : null;
    return f && f.project ? f : null;
  }
  addEventListener('pointermove', e => {
    if (mobile) return;
    par.x = e.clientX / innerWidth * 2 - 1; par.y = e.clientY / innerHeight * 2 - 1;
    if (drag.active) {
      drag.yaw = THREE.MathUtils.clamp(drag.yaw - (e.clientX - drag.x) * 0.0006, -DRAG_YAW, DRAG_YAW);
      drag.pitch = THREE.MathUtils.clamp(drag.pitch + (e.clientY - drag.y) * 0.0004, -DRAG_PITCH, DRAG_PITCH);
      drag.x = e.clientX; drag.y = e.clientY;
    }
  });
  addEventListener('pointerup', () => { drag.active = false; renderer.domElement.style.cursor = ''; });
  docOn('pointerleave', () => { par.x = 0; par.y = 0; });
  renderer.domElement.addEventListener('pointermove', e => {
    if (mobile) return;
    if (drag.active) return;
    const f = state === 'home' ? pick(e.clientX, e.clientY) : null;
    if (f !== hovered) hover(f);
    const tip = $('tip');
    if (f) { tip.textContent = `0${f.i + 1} · ${f.project.title}`; tip.style.left = e.clientX + 'px'; tip.style.top = e.clientY + 'px'; tip.style.opacity = 1; }
    else tip.style.opacity = 0;
  });
  let down = null;
  renderer.domElement.addEventListener('pointerdown', e => {
    down = { x: e.clientX, y: e.clientY, t: performance.now() };
    if (!mobile && (state === 'home' || state === 'focus')) { drag.active = true; drag.x = e.clientX; drag.y = e.clientY; renderer.domElement.style.cursor = 'grabbing'; }
  });
  renderer.domElement.addEventListener('pointerup', e => {
    if (!down) return;
    const dx = e.clientX - down.x, dy = e.clientY - down.y; down = null;
    if (state === 'intro') { skipIntro(); return; }
    if (mobile && state === 'browse' && Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { step(dx < 0 ? 1 : -1); return; }
    if (Math.hypot(dx, dy) > 8) return;
    const f = pick(e.clientX, e.clientY);
    if (f && (state === 'home' || state === 'browse')) select(f.i);
  });
  $('pback').onclick = back;
  $('plink').onclick = e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;   // abrir en pestaña nueva sigue funcionando
    e.preventDefault();
    opts.onOpenProject?.($('plink').dataset.slug);
  };
  $('pprev').onclick = () => step(-1);
  $('pnext').onclick = () => step(1);
  $('mprev').onclick = () => step(-1);
  $('mnext').onclick = () => step(1);
  $('mopen').onclick = () => select(index);
  addEventListener('keydown', e => {
    if (paused) return;
    if (e.key === 'Escape') { if (state === 'intro') skipIntro(); else back(); }
    else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const d = e.key === 'ArrowRight' ? 1 : -1;
      if (state === 'home') { const k = ((hovered ? hovered.k : frames[index].k - d) + d + roomSize()) % roomSize(); index = slotOf(k); hover(frames[index]); }
      else step(d);
    } else if (e.key === 'Enter' && state === 'home' && hovered) select(hovered.i);
  });
  addEventListener('resize', () => {
    renderer.setSize(innerWidth, innerHeight);
    const m = innerWidth < innerHeight || innerWidth < 768;
    if (m !== mobile) { mobile = m; root.classList.toggle('mobile', mobile); if (state === 'home' || state === 'browse') { state = mobile ? 'browse' : 'home'; apply(mobile ? browsePose(frames[index]) : homePose()); } }
    apply(cur);
  });

  /* ── bucle ─────────────────────────────────────────────────────────────── */
  const clock = new THREE.Clock();
  const frameCb = () => loop(Math.min(clock.getDelta(), 0.05));
  renderer.setAnimationLoop(frameCb);
  function loop(dt) {
    mixer.update(dt);
    if (state === 'intro') {
      introT += dt;
      setLights(0.18 + 0.82 * Math.min(1, introT / (INTRO * 0.7)));
      if (introT >= INTRO) endIntro();
    }
    if (tween) {
      tween.t = Math.min(1, tween.t + dt / tween.dur);
      const k = ease(tween.t);
      apply({ eye: tween.a.eye.clone().lerp(tween.b.eye, k), target: tween.a.target.clone().lerp(tween.b.target, k),
              lens: THREE.MathUtils.lerp(tween.a.lens, tween.b.lens, k) });
      if (tween.t >= 1) { const d = tween.done; tween = null; d && d(); }
    }
    roomFade += (roomFadeTarget - roomFade) * Math.min(1, dt * 9);
    // focos: cascada en la intro, realce en hover, atenuación del resto al enfocar
    const H = manifest.transitions.FRAME_HOVER;
    frames.forEach((f, i) => {
      const s = spots[f.id];
      const on = state === 'intro' ? THREE.MathUtils.clamp((introT - 0.5 - i * 0.28) / 0.5, 0, 1) : 1;
      const focus = (state === 'focus' || state === 'moving') && !$('panel').classList.contains('x');
      const isSel = (state === 'focus' || state === 'moving') && index === i;
      const gain = hovered === f ? H.spot_gain : (focus && !isSel ? manifest.transitions.FRAME_SELECT.dim_others : 1);
      spotGain[f.id] += (gain - spotGain[f.id]) * Math.min(1, dt * 8);
      if (s) s.intensity = s.userData.base * on * spotGain[f.id] * roomFade * (f.project ? 1 : 0);
      f.lift += ((hovered === f ? H.lift_m : 0) - f.lift) * Math.min(1, dt * 10);
      f.root.position.z = f.z0 + f.lift;
    });
    updateLook(dt, clock.elapsedTime);
    if (state === 'moving' || state === 'focus') setLights(1, true);
    else if (state !== 'intro') setLights(1);
    renderer.render(scene, camera);
  }
  const api = {
    destroy() {
      ac.abort();
      renderer.setAnimationLoop(null);
      mixer.stopAllAction();
      gltf.scene.traverse(o => { o.geometry?.dispose(); [].concat(o.material || []).forEach(m => { m.map?.dispose(); m.dispose?.(); }); });
      draco.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      if (window.__gallery === api.debug) delete window.__gallery;
    },
    /** El pop up del caso está abierto encima: sin teclado ni render. */
    setPaused(p) { paused = p; renderer.setAnimationLoop(p ? null : frameCb); if (!p) clock.getDelta(); },
  };
  api.debug = window.__gallery = { frames, select, back, step, get state() { return state; }, renderer, scene, camera,
    tick(seconds = 1, fps = 30) { for (let i = 0; i < seconds * fps; i++) loop(1 / fps); },   // pruebas sin rAF
    snapshot() { renderer.render(scene, camera); return renderer.domElement.toDataURL('image/jpeg', 0.8); } };
  return api;
}

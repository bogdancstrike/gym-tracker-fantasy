// Three.js animated boss introduction cinematic — multi-phase reveal per dungeon.
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Phase hook: 0=dark, 1=emerge, 2=silhouette, 3=flash, 4=reveal
// ---------------------------------------------------------------------------
function usePhase() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const timings = [0, 400, 1100, 1800, 2000];
    const timers = timings.slice(1).map((t, i) =>
      setTimeout(() => setPhase(i + 1), t)
    );
    return () => timers.forEach(clearTimeout);
  }, []);
  return phase;
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------
export function BossCinematicScene({ bossId, height = 220 }) {
  const phase = usePhase();
  const mountRef = useRef(null);
  const phaseRef = useRef(0);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = mount.clientWidth || 340;
    const h = height;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = false;
    mount.appendChild(renderer.domElement);

    // Scene + camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 30);
    camera.position.set(0, 1.8, 5.5);
    camera.lookAt(0, 1.5, 0);

    // Build boss-specific scene, get back an animate callback
    const cleanup = BOSS_BUILDERS[bossId]
      ? BOSS_BUILDERS[bossId](scene, phaseRef)
      : BOSS_BUILDERS.d1(scene, phaseRef);

    let frameId;
    const tick = () => {
      frameId = requestAnimationFrame(tick);
      cleanup.tick(performance.now() / 1000);
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(frameId);
      cleanup.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [bossId, height]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      position: 'relative', width: '100%', height,
      borderRadius: 14, overflow: 'hidden', background: '#000',
    }}>
      {/* Three.js canvas mount */}
      <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />

      {/* Dark overlay — fades out after phase 1 */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,1)',
        opacity: phase >= 1 ? 0 : 1,
        transition: 'opacity 600ms ease-out',
        pointerEvents: 'none',
      }} />

      {/* Flash overlay — appears at phase 3, fades fast */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(255,255,255,0.85)',
        opacity: phase === 3 ? 1 : 0,
        transition: phase === 3 ? 'opacity 40ms' : 'opacity 300ms ease-out',
        pointerEvents: 'none',
      }} />

      {/* Atmospheric vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function disposeMesh(obj) {
  if (!obj) return;
  if (obj.geometry) obj.geometry.dispose();
  if (obj.material) {
    if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
    else obj.material.dispose();
  }
}

function disposeGroup(group) {
  group.traverse(obj => {
    if (obj.isMesh) disposeMesh(obj);
  });
}

// ---------------------------------------------------------------------------
// BOSS d1: Iron Spire — The Forge Titan
// ---------------------------------------------------------------------------
function buildForgeTitan(scene, phaseRef) {
  scene.fog = new THREE.Fog(0x0a0200, 3, 12);
  scene.background = new THREE.Color(0x0a0200);

  const toDispose = [];
  const geo = (g) => { toDispose.push(g); return g; };
  const mat = (m) => { toDispose.push(m); return m; };

  const ironMat   = mat(new THREE.MeshStandardMaterial({ color: 0x1a1208, roughness: 0.85, metalness: 0.7 }));
  const accentMat = mat(new THREE.MeshStandardMaterial({ color: 0xff5500, roughness: 0.6, metalness: 0.5,
    emissive: new THREE.Color(0xff3300), emissiveIntensity: 0.6 }));
  const darkMat   = mat(new THREE.MeshStandardMaterial({ color: 0x1a0800, roughness: 0.95 }));
  const lavaMat   = mat(new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: new THREE.Color(0xff2200), emissiveIntensity: 1.2 }));
  const eyeMat    = mat(new THREE.MeshStandardMaterial({ color: 0xff8833, emissive: new THREE.Color(0xff6600), emissiveIntensity: 2.0 }));
  const coreMat   = mat(new THREE.MeshStandardMaterial({ color: 0xff6600, emissive: new THREE.Color(0xff4400), emissiveIntensity: 1.5 }));
  const chestMat  = mat(new THREE.MeshPhysicalMaterial({ color: 0x3a1a00, roughness: 0.4, metalness: 0.2,
    transparent: true, opacity: 0.4 }));

  // Ground platform
  const floorMesh = new THREE.Mesh(geo(new THREE.CylinderGeometry(3, 3, 0.15, 20)), darkMat);
  floorMesh.position.y = -0.08;
  scene.add(floorMesh);

  // Lava cracks
  const crackGroup = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const crack = new THREE.Mesh(geo(new THREE.BoxGeometry(0.04, 0.02, 1.2)), lavaMat);
    crack.position.set(0, 0.01, 0.5);
    crack.rotation.y = (i / 6) * Math.PI * 2;
    crackGroup.add(crack);
  }
  scene.add(crackGroup);

  // Boss group
  const bossGroup = new THREE.Group();
  bossGroup.position.y = -3;

  // Pelvis
  bossGroup.add(makeMesh(geo(new THREE.CylinderGeometry(0.7, 0.9, 0.6, 10)), ironMat, 0, 0.6, 0));
  // Torso
  bossGroup.add(makeMesh(geo(new THREE.CylinderGeometry(0.65, 0.72, 1.1, 10)), ironMat, 0, 1.45, 0));
  // Chest core (lava)
  bossGroup.add(makeMesh(geo(new THREE.SphereGeometry(0.32, 20, 20)), coreMat, 0, 1.55, 0));
  // Chest shell
  bossGroup.add(makeMesh(geo(new THREE.SphereGeometry(0.56, 16, 16)), chestMat, 0, 1.55, 0));
  // Shoulders
  bossGroup.add(makeMesh(geo(new THREE.BoxGeometry(0.45, 0.32, 0.32)), accentMat, -0.9, 2.1, 0));
  bossGroup.add(makeMesh(geo(new THREE.BoxGeometry(0.45, 0.32, 0.32)), accentMat,  0.9, 2.1, 0));
  // Upper arms
  const lArmU = makeMesh(geo(new THREE.CylinderGeometry(0.2, 0.24, 0.85, 10)), ironMat, -0.95, 1.65, 0);
  lArmU.rotation.z = 0.3;
  const rArmU = makeMesh(geo(new THREE.CylinderGeometry(0.2, 0.24, 0.85, 10)), ironMat, 0.95, 1.65, 0);
  rArmU.rotation.z = -0.3;
  bossGroup.add(lArmU, rArmU);
  // Forearms
  const lArmF = makeMesh(geo(new THREE.CylinderGeometry(0.16, 0.2, 0.8, 10)), ironMat, -1.1, 0.95, 0);
  lArmF.rotation.z = 0.15;
  const rArmF = makeMesh(geo(new THREE.CylinderGeometry(0.16, 0.2, 0.8, 10)), ironMat, 1.1, 0.95, 0);
  rArmF.rotation.z = -0.15;
  bossGroup.add(lArmF, rArmF);
  // Gauntlets
  const gauntletMat = mat(new THREE.MeshStandardMaterial({ color: 0x331100, emissive: new THREE.Color(0xff4400), emissiveIntensity: 0.8 }));
  bossGroup.add(makeMesh(geo(new THREE.BoxGeometry(0.32, 0.28, 0.22)), gauntletMat, -1.15, 0.56, 0));
  bossGroup.add(makeMesh(geo(new THREE.BoxGeometry(0.32, 0.28, 0.22)), gauntletMat,  1.15, 0.56, 0));
  // Head
  bossGroup.add(makeMesh(geo(new THREE.BoxGeometry(0.55, 0.48, 0.44)), ironMat, 0, 2.65, 0));
  // Helmet crest
  bossGroup.add(makeMesh(geo(new THREE.BoxGeometry(0.12, 0.3, 0.3)), accentMat, 0, 2.95, 0));
  // Eyes
  bossGroup.add(makeMesh(geo(new THREE.SphereGeometry(0.065, 12, 12)), eyeMat, -0.12, 2.65, 0.22));
  bossGroup.add(makeMesh(geo(new THREE.SphereGeometry(0.065, 12, 12)), eyeMat,  0.12, 2.65, 0.22));

  scene.add(bossGroup);

  // Lighting
  const ambient = new THREE.AmbientLight(0x220800, 0.3);
  scene.add(ambient);
  const coreLight = new THREE.PointLight(0xff4400, 3, 5);
  coreLight.position.set(0, 1.55, 0);
  scene.add(coreLight);
  const groundLight = new THREE.PointLight(0xff2200, 2, 8);
  groundLight.position.set(0, -0.5, 0);
  scene.add(groundLight);
  const keyLight = new THREE.DirectionalLight(0xff6600, 1.8);
  keyLight.position.set(2, 4, 2);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0x4400aa, 0.5);
  rimLight.position.set(-3, 2, -2);
  scene.add(rimLight);

  // Ember particles
  const emberCount = 60;
  const emberPositions = new Float32Array(emberCount * 3);
  const emberSpeeds = new Float32Array(emberCount);
  for (let i = 0; i < emberCount; i++) {
    emberPositions[i * 3]     = (Math.random() - 0.5) * 4;
    emberPositions[i * 3 + 1] = Math.random() * 3;
    emberPositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    emberSpeeds[i] = 0.3 + Math.random() * 0.7;
  }
  const emberGeo = geo(new THREE.BufferGeometry());
  emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));
  const emberMat = mat(new THREE.PointsMaterial({ color: 0xff6600, size: 0.06, sizeAttenuation: true }));
  const embers = new THREE.Points(emberGeo, emberMat);
  scene.add(embers);

  function tick(t) {
    const p = phaseRef.current;

    // Boss emerge
    const targetY = p >= 2 ? 0 : -3;
    bossGroup.position.y += (targetY - bossGroup.position.y) * 0.08;

    // Core pulse at reveal
    if (p >= 4) {
      coreLight.intensity = 3 + Math.sin(t * 2.5) * 1.2;
      coreMat.emissiveIntensity = 1.5 + Math.sin(t * 2.5) * 0.5;
    }

    // Ember particles rise
    const pos = emberGeo.attributes.position.array;
    for (let i = 0; i < emberCount; i++) {
      pos[i * 3 + 1] += emberSpeeds[i] * 0.012;
      if (pos[i * 3 + 1] > 3.5) {
        pos[i * 3 + 1] = 0;
        pos[i * 3]     = (Math.random() - 0.5) * 4;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
      }
    }
    emberGeo.attributes.position.needsUpdate = true;

    // Subtle sway
    if (p >= 4) {
      bossGroup.rotation.y = Math.sin(t * 0.4) * 0.06;
    }
  }

  function dispose() {
    disposeGroup(bossGroup);
    disposeGroup(crackGroup);
    disposeMesh(floorMesh);
    disposeMesh(embers);
    toDispose.forEach(d => d.dispose());
  }

  return { tick, dispose };
}

// ---------------------------------------------------------------------------
// BOSS d2: Echo Chamber — Ssythax the Serpent
// ---------------------------------------------------------------------------
function buildSerpent(scene, phaseRef) {
  scene.fog = new THREE.Fog(0x000a08, 2, 10);
  scene.background = new THREE.Color(0x000c0a);

  const toDispose = [];
  const geo = (g) => { toDispose.push(g); return g; };
  const mat = (m) => { toDispose.push(m); return m; };

  // Ground
  const floorMat = mat(new THREE.MeshStandardMaterial({ color: 0x001a12, roughness: 0.9, metalness: 0.3 }));
  const floor = new THREE.Mesh(geo(new THREE.CylinderGeometry(3.5, 3.5, 0.1, 24)), floorMat);
  floor.position.y = -0.1;
  scene.add(floor);

  // Ripple rings
  const rippleMats = [];
  const rippleRings = [1.0, 1.6, 2.2, 2.8].map((r, i) => {
    const rMat = mat(new THREE.MeshStandardMaterial({
      color: 0x00ffcc, emissive: new THREE.Color(0x00ccaa), emissiveIntensity: 0.8,
      transparent: true, opacity: 0.35, side: THREE.DoubleSide,
    }));
    rippleMats.push(rMat);
    const ring = new THREE.Mesh(geo(new THREE.TorusGeometry(r, 0.025, 8, 40)), rMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.01;
    scene.add(ring);
    return { mesh: ring, mat: rMat, phaseOffset: i * 1.2 };
  });

  // Boss group
  const bossGroup = new THREE.Group();
  bossGroup.position.y = -4;

  // Serpent body via TubeGeometry
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.8, 0.2, 0),
    new THREE.Vector3(0.4, 0.5, 0.8),
    new THREE.Vector3(-0.6, 0.9, 0.6),
    new THREE.Vector3(-0.8, 1.4, -0.2),
    new THREE.Vector3(-0.2, 1.9, -0.8),
    new THREE.Vector3(0.5, 2.5, -0.3),
    new THREE.Vector3(0, 3.2, 0.2),
  ]);
  const snakeMat = mat(new THREE.MeshStandardMaterial({
    color: 0x003322, roughness: 0.5, metalness: 0.6,
    emissive: new THREE.Color(0x001a11), emissiveIntensity: 0.3,
  }));
  const snakeBody = new THREE.Mesh(geo(new THREE.TubeGeometry(curve, 60, 0.22, 10, false)), snakeMat);
  bossGroup.add(snakeBody);

  // Head at end of curve
  const headPos = curve.getPoint(1);
  const headMat = mat(new THREE.MeshStandardMaterial({ color: 0x004433, roughness: 0.4, metalness: 0.5 }));
  const head = new THREE.Mesh(geo(new THREE.SphereGeometry(0.45, 20, 20)), headMat);
  head.scale.set(1, 0.75, 0.9);
  head.position.copy(headPos);
  bossGroup.add(head);

  // Hood (cobra flare)
  const hoodMat = mat(new THREE.MeshStandardMaterial({ color: 0x002a1a, roughness: 0.6, side: THREE.DoubleSide }));
  const hood = new THREE.Mesh(geo(new THREE.TorusGeometry(0.55, 0.12, 8, 16, Math.PI)), hoodMat);
  hood.position.copy(headPos);
  hood.position.z += 0.15;
  hood.rotation.y = Math.PI / 2;
  bossGroup.add(hood);

  // Eyes
  const eyeMat = mat(new THREE.MeshStandardMaterial({ color: 0xff5500, emissive: new THREE.Color(0xff4400), emissiveIntensity: 3 }));
  const eyeL = new THREE.Mesh(geo(new THREE.SphereGeometry(0.065, 12, 12)), eyeMat);
  eyeL.position.copy(headPos);
  eyeL.position.x -= 0.22;
  eyeL.position.z += 0.2;
  const eyeR = eyeL.clone();
  eyeR.position.x += 0.44;
  bossGroup.add(eyeL, eyeR);

  // Eye lights (start dim, snap at reveal)
  const eyeLightL = new THREE.PointLight(0xff4400, 0, 1);
  eyeLightL.position.copy(eyeL.position);
  bossGroup.add(eyeLightL);
  const eyeLightR = new THREE.PointLight(0xff4400, 0, 1);
  eyeLightR.position.copy(eyeR.position);
  bossGroup.add(eyeLightR);

  // Tongue
  const tongueMat = mat(new THREE.MeshStandardMaterial({ color: 0xff2222, emissive: new THREE.Color(0xff0000), emissiveIntensity: 1 }));
  const tongueL = new THREE.Mesh(geo(new THREE.BoxGeometry(0.03, 0.12, 0.01)), tongueMat);
  tongueL.position.copy(headPos);
  tongueL.position.z += 0.45;
  tongueL.position.x -= 0.05;
  tongueL.rotation.z = 0.3;
  const tongueR = tongueL.clone();
  tongueR.position.x += 0.1;
  tongueR.rotation.z = -0.3;
  bossGroup.add(tongueL, tongueR);

  scene.add(bossGroup);

  // Lighting
  scene.add(new THREE.AmbientLight(0x001a12, 0.4));
  const bodyGlow = new THREE.PointLight(0x00ffaa, 1.5, 6);
  bodyGlow.position.set(-0.2, 2, 0);
  scene.add(bodyGlow);
  const keyLight = new THREE.DirectionalLight(0x00ccaa, 1.4);
  keyLight.position.set(-2, 3, 2);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0x4422aa, 0.6);
  rimLight.position.set(3, 1, -2);
  scene.add(rimLight);

  function tick(t) {
    const p = phaseRef.current;

    // Emerge
    const targetY = p >= 2 ? 0 : -4;
    bossGroup.position.y += (targetY - bossGroup.position.y) * 0.07;

    // Eye lights snap on at reveal
    const eyeIntensity = p >= 4 ? 0.8 : 0;
    eyeLightL.intensity += (eyeIntensity - eyeLightL.intensity) * 0.15;
    eyeLightR.intensity += (eyeIntensity - eyeLightR.intensity) * 0.15;

    // Ripple rings
    rippleRings.forEach((r, i) => {
      const s = 1 + Math.sin(t * 1.5 + r.phaseOffset) * 0.08;
      r.mesh.scale.setScalar(s);
      r.mat.opacity = 0.3 + Math.sin(t * 1.5 + r.phaseOffset) * 0.2;
    });

    // Subtle body sway
    if (p >= 4) {
      bossGroup.rotation.y = Math.sin(t * 0.3) * 0.08;
    }
  }

  function dispose() {
    disposeGroup(bossGroup);
    disposeMesh(floor);
    rippleRings.forEach(r => disposeMesh(r.mesh));
    toDispose.forEach(d => d.dispose());
  }

  return { tick, dispose };
}

// ---------------------------------------------------------------------------
// BOSS d3: Obsidian Throne — The Shadow Monarch
// ---------------------------------------------------------------------------
function buildShadowMonarch(scene, phaseRef) {
  scene.fog = new THREE.Fog(0x04000a, 2, 11);
  scene.background = new THREE.Color(0x05000d);

  const toDispose = [];
  const geo = (g) => { toDispose.push(g); return g; };
  const mat = (m) => { toDispose.push(m); return m; };

  const stoneMat  = mat(new THREE.MeshStandardMaterial({ color: 0x0a0015, roughness: 0.2, metalness: 0.8 }));
  const throneMat = mat(new THREE.MeshStandardMaterial({ color: 0x110022, roughness: 0.5, metalness: 0.6 }));
  const monarchMat = mat(new THREE.MeshStandardMaterial({ color: 0x1a0030, roughness: 0.7, metalness: 0.4 }));
  const robeMat   = mat(new THREE.MeshStandardMaterial({ color: 0x0a0018, roughness: 0.9, transparent: true, opacity: 0.85, side: THREE.DoubleSide }));
  const crownMat  = mat(new THREE.MeshStandardMaterial({ color: 0x9955ff, emissive: new THREE.Color(0x7733dd), emissiveIntensity: 1.2 }));
  const ornamentMat = mat(new THREE.MeshStandardMaterial({ color: 0xcc88ff, emissive: new THREE.Color(0x9955ff), emissiveIntensity: 1.5 }));
  const tendrilMat = mat(new THREE.MeshStandardMaterial({ color: 0x6600aa, emissive: new THREE.Color(0x4400aa), emissiveIntensity: 1, transparent: true, opacity: 0.7 }));
  const runeMat   = mat(new THREE.MeshStandardMaterial({ color: 0x9955ff, emissive: new THREE.Color(0x7733dd), emissiveIntensity: 1.8 }));

  // Ground
  const floor = new THREE.Mesh(geo(new THREE.CylinderGeometry(3, 3, 0.12, 8)), stoneMat);
  floor.position.y = -0.06;
  scene.add(floor);

  // Rune circles
  const runeOuter = new THREE.Mesh(geo(new THREE.TorusGeometry(1.2, 0.025, 8, 40)), runeMat);
  runeOuter.rotation.x = Math.PI / 2;
  runeOuter.position.y = 0.01;
  scene.add(runeOuter);
  const runeInner = new THREE.Mesh(geo(new THREE.TorusGeometry(0.7, 0.02, 8, 32)), runeMat);
  runeInner.rotation.x = Math.PI / 2;
  runeInner.position.y = 0.01;
  scene.add(runeInner);

  // Boss group
  const bossGroup = new THREE.Group();
  bossGroup.position.y = -2;

  // THRONE
  // Back
  bossGroup.add(makeMesh(geo(new THREE.BoxGeometry(1.4, 2.2, 0.18)), throneMat, 0, 1.6, -0.5));
  // Seat
  bossGroup.add(makeMesh(geo(new THREE.BoxGeometry(1.1, 0.14, 1.0)), throneMat, 0, 0.65, 0));
  // Arms
  bossGroup.add(makeMesh(geo(new THREE.BoxGeometry(0.14, 0.6, 0.9)), throneMat, -0.5, 1.0, 0));
  bossGroup.add(makeMesh(geo(new THREE.BoxGeometry(0.14, 0.6, 0.9)), throneMat,  0.5, 1.0, 0));
  // Legs (4 corners)
  [[-0.42, -0.42], [0.42, -0.42], [-0.42, 0.42], [0.42, 0.42]].forEach(([x, z]) => {
    bossGroup.add(makeMesh(geo(new THREE.CylinderGeometry(0.07, 0.1, 0.7, 6)), throneMat, x, 0.29, z));
  });
  // Throne ornament (top of back)
  const ornament = new THREE.Mesh(geo(new THREE.TorusGeometry(0.3, 0.04, 8, 16)), ornamentMat);
  ornament.position.set(0, 2.76, -0.5);
  bossGroup.add(ornament);

  // MONARCH (seated)
  bossGroup.add(makeMesh(geo(new THREE.CylinderGeometry(0.28, 0.35, 0.7, 10)), monarchMat, 0, 0.95, 0));
  bossGroup.add(makeMesh(geo(new THREE.CylinderGeometry(0.26, 0.28, 0.8, 10)), monarchMat, 0, 1.4, 0));
  // Head
  bossGroup.add(makeMesh(geo(new THREE.SphereGeometry(0.2, 20, 20)), monarchMat, 0, 1.92, 0));
  // Crown
  bossGroup.add(makeMesh(geo(new THREE.CylinderGeometry(0.22, 0.25, 0.14, 6, 1, true)), crownMat, 0, 2.06, 0));
  // Crown spikes
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const spike = makeMesh(geo(new THREE.ConeGeometry(0.04, 0.22, 6)), crownMat,
      Math.cos(angle) * 0.23, 2.22, Math.sin(angle) * 0.23);
    bossGroup.add(spike);
  }
  // Robes (open cone)
  bossGroup.add(makeMesh(geo(new THREE.ConeGeometry(0.55, 1.0, 10, 1, true)), robeMat, 0, 0.7, 0));
  // Arms on armrests
  const lArm = makeMesh(geo(new THREE.CylinderGeometry(0.08, 0.1, 0.8, 8)), monarchMat, -0.5, 1.1, 0.1);
  lArm.rotation.z = Math.PI / 2;
  const rArm = makeMesh(geo(new THREE.CylinderGeometry(0.08, 0.1, 0.8, 8)), monarchMat,  0.5, 1.1, 0.1);
  rArm.rotation.z = -Math.PI / 2;
  bossGroup.add(lArm, rArm);

  // Shadow tendrils (8 orbiting spheres)
  const tendrils = Array.from({ length: 8 }, (_, i) => {
    const radius = 1.2 + Math.random() * 0.6;
    const height = 0.5 + Math.random() * 1.8;
    const speed  = (0.008 + Math.random() * 0.012) * (Math.random() < 0.5 ? 1 : -1);
    const sz     = 0.05 + Math.random() * 0.04;
    const tMesh  = new THREE.Mesh(
      geo(new THREE.SphereGeometry(sz, 8, 8)),
      mat(new THREE.MeshStandardMaterial({ color: 0x6600aa, emissive: new THREE.Color(0x4400aa), emissiveIntensity: 1, transparent: true, opacity: 0.7 }))
    );
    const angle = (i / 8) * Math.PI * 2;
    tMesh.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
    bossGroup.add(tMesh);
    return { mesh: tMesh, radius, angle, speed, height };
  });

  scene.add(bossGroup);

  // Lighting
  scene.add(new THREE.AmbientLight(0x0a0015, 0.35));
  const monarchGlow = new THREE.PointLight(0x9955ff, 2.5, 5);
  monarchGlow.position.set(0, 1.4, 0);
  scene.add(monarchGlow);
  const throneBackGlow = new THREE.PointLight(0x6600aa, 1.5, 8);
  throneBackGlow.position.set(0, 3, -1);
  scene.add(throneBackGlow);
  const keyLight = new THREE.DirectionalLight(0xaa66ff, 1.2);
  keyLight.position.set(1, 4, 2);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0x330066, 0.8);
  rimLight.position.set(-2, 2, -3);
  scene.add(rimLight);

  function tick(t) {
    const p = phaseRef.current;

    // Emerge
    const targetY = p >= 2 ? 0 : -2;
    bossGroup.position.y += (targetY - bossGroup.position.y) * 0.07;

    // Crown pulse at reveal
    if (p >= 4) {
      crownMat.emissiveIntensity = 0.5 + Math.sin(t * 2.2) * 0.4;
      monarchGlow.intensity = 2.5 + Math.sin(t * 1.8) * 0.8;
    }

    // Tendrils orbit
    if (p >= 2) {
      tendrils.forEach((td, i) => {
        td.angle += td.speed;
        td.mesh.position.x = Math.cos(td.angle) * td.radius;
        td.mesh.position.z = Math.sin(td.angle) * td.radius;
        td.mesh.position.y = td.height + Math.sin(t * 1.5 + i) * 0.15;
        td.mesh.material.opacity = 0.5 + Math.sin(t * 2 + i * 0.8) * 0.3;
      });
    }

    // Rune spin
    runeOuter.rotation.z += 0.004;
    runeInner.rotation.z -= 0.006;

    // Ornament pulse
    ornamentMat.emissiveIntensity = 1.5 + Math.sin(t * 1.6) * 0.5;
  }

  function dispose() {
    disposeGroup(bossGroup);
    disposeMesh(floor);
    disposeMesh(runeOuter);
    disposeMesh(runeInner);
    toDispose.forEach(d => d.dispose());
  }

  return { tick, dispose };
}

// ---------------------------------------------------------------------------
// Shared helper
// ---------------------------------------------------------------------------
function makeMesh(geometry, material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  return mesh;
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------
const BOSS_BUILDERS = {
  d1: buildForgeTitan,
  d2: buildSerpent,
  d3: buildShadowMonarch,
};

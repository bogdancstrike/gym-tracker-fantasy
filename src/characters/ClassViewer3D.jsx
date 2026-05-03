// Stylized three.js class viewer — 9 classes, each with distinct geometry.
// Idle breathing + slow auto-rotation + particles + dramatic lighting.
// Mounted via useEffect; cleaned up on unmount.
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CLASS_SIGS = {
  mage:        { primary: 0x8b6cf0, accent: 0xbcd1ff, weapon: 'staff',      aura: 0x6c4dff, body: 0x2a1f4a },
  assassin:    { primary: 0x2dd4bf, accent: 0x67e8f9, weapon: 'daggers',    aura: 0x14b8a6, body: 0x0f3535 },
  paladin:     { primary: 0xfacc15, accent: 0xfde68a, weapon: 'sword',      aura: 0xfbbf24, body: 0x4a3a1a },
  berserker:   { primary: 0xef4444, accent: 0xfca5a5, weapon: 'axe',        aura: 0xdc2626, body: 0x451f1f },
  monarch:     { primary: 0xa855f7, accent: 0xd8b4fe, weapon: 'orb',        aura: 0x7c3aed, body: 0x1a0f2a },
  ranger:      { primary: 0x84cc16, accent: 0xbef264, weapon: 'bow',        aura: 0x65a30d, body: 0x1a2a0f },
  necromancer: { primary: 0x6b21a8, accent: 0xc4b5fd, weapon: 'scythe',     aura: 0x4c1d95, body: 0x180f1a },
  monk:        { primary: 0xf97316, accent: 0xfdba74, weapon: 'fists',      aura: 0xea580c, body: 0x3a1f0f },
  spellblade:  { primary: 0x06b6d4, accent: 0x67e8f9, weapon: 'rune-blade', aura: 0x0891b2, body: 0x0f2a3a },
};

export function ClassViewer3D({ classId = 'paladin', size = 220, showStage = true, autoRotate = true }) {
  const mountRef = useRef(null);
  const figRef   = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const sig = CLASS_SIGS[classId] || CLASS_SIGS.paladin;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.18);

    // Camera
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 1.15, 3.6);
    camera.lookAt(0, 1.3, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size, size);
    renderer.setClearColor(sig.body, 0.3);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // --- Atmosphere backdrop ---
    const skyGeo = new THREE.SphereGeometry(8, 16, 16);
    const skyMat = new THREE.MeshBasicMaterial({
      color: sig.body,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.9,
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);

    // --- Dramatic Lighting ---
    const ambient = new THREE.AmbientLight(0x112233, 0.2);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(sig.primary, 1.8);
    keyLight.position.set(2, 5, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(sig.accent, 1.4);
    rimLight.position.set(-3, 3, -4);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x334455, 0.4);
    fillLight.position.set(0, 2, 4);
    scene.add(fillLight);

    // Inner character glow (key "aura" effect)
    const innerLight = new THREE.PointLight(sig.aura, 2.5, 3.5);
    innerLight.position.set(0, 1.2, 0);
    scene.add(innerLight);

    // Back glow for silhouette
    const backLight = new THREE.PointLight(sig.accent, 1.2, 4);
    backLight.position.set(0, 2.5, -1.5);
    scene.add(backLight);

    // --- Stage / Rune Dais ---
    if (showStage) {
      const dais = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.4, 0.18, 32),
        new THREE.MeshStandardMaterial({ color: 0x1a2218, roughness: 0.7, metalness: 0.3 })
      );
      dais.position.y = -0.05;
      scene.add(dais);

      const ringGeo = new THREE.TorusGeometry(1.15, 0.025, 12, 64);
      const ringMat = new THREE.MeshStandardMaterial({
        color: sig.accent, emissive: sig.accent, emissiveIntensity: 0.6,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.05;
      scene.add(ring);

      // Inner ring — pulsing
      const innerRingMat = new THREE.MeshBasicMaterial({
        color: sig.primary, transparent: true, opacity: 0.4,
      });
      const innerRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.65, 0.02, 12, 64),
        innerRingMat
      );
      innerRing.rotation.x = Math.PI / 2;
      innerRing.position.y = 0.06;
      scene.add(innerRing);

      // Ground fog disc
      const fogDisc = new THREE.Mesh(
        new THREE.CylinderGeometry(1.4, 1.4, 0.02, 32),
        new THREE.MeshBasicMaterial({ color: sig.aura, transparent: true, opacity: 0.06 })
      );
      fogDisc.position.y = 0.01;
      scene.add(fogDisc);

      // Store for animation
      scene.userData.innerRing = innerRing;
    }

    // --- Figure root ---
    const fig = new THREE.Group();
    figRef.current = fig;
    scene.add(fig);

    // Materials
    const skinMat   = new THREE.MeshStandardMaterial({ color: 0xd4a574, roughness: 0.65, metalness: 0.05 });
    const bodyMat   = new THREE.MeshStandardMaterial({ color: sig.body,    roughness: 0.55, metalness: 0.35 });
    const robeMat   = new THREE.MeshStandardMaterial({ color: sig.body,    roughness: 0.9,  metalness: 0.02 });
    const accentMat = new THREE.MeshStandardMaterial({
      color: sig.primary, emissive: sig.primary, emissiveIntensity: 0.5, metalness: 0.8, roughness: 0.25,
    });
    const shoulMat  = new THREE.MeshStandardMaterial({
      color: sig.primary, emissive: sig.primary, emissiveIntensity: 0.35, metalness: 0.7, roughness: 0.3,
    });
    const auraMat   = new THREE.MeshBasicMaterial({
      color: sig.aura, transparent: true, opacity: 0.12, side: THREE.BackSide,
    });

    // --- Body parts with improved proportions ---
    // Lower body / robe — open-bottom cone
    const lowerBody = new THREE.Mesh(new THREE.ConeGeometry(0.58, 1.05, 14, 1, true), robeMat);
    lowerBody.position.y = 0.5;
    fig.add(lowerBody);

    // Torso
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.46, 0.65, 14), bodyMat);
    torso.position.y = 1.3;
    fig.add(torso);

    // Upper chest detail
    const chestDetail = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.33, 0.24, 14), bodyMat);
    chestDetail.position.y = 1.6;
    fig.add(chestDetail);

    // Shoulders
    const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), shoulMat);
    shoulderL.position.set(-0.44, 1.68, 0);
    fig.add(shoulderL);

    const shoulderR = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), shoulMat);
    shoulderR.position.set(0.44, 1.68, 0);
    fig.add(shoulderR);

    // Upper arms
    const upperArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.1, 0.55, 10), bodyMat);
    upperArmL.position.set(-0.52, 1.38, 0.04);
    upperArmL.rotation.z = 0.22;
    fig.add(upperArmL);

    const upperArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.1, 0.55, 10), bodyMat);
    upperArmR.position.set(0.52, 1.38, 0.04);
    upperArmR.rotation.z = -0.22;
    fig.add(upperArmR);

    // Forearms
    const forearmL = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.08, 0.46, 10), bodyMat);
    forearmL.position.set(-0.56, 1.08, 0.1);
    forearmL.rotation.z = 0.16;
    fig.add(forearmL);

    const forearmR = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.08, 0.46, 10), bodyMat);
    forearmR.position.set(0.56, 1.08, 0.1);
    forearmR.rotation.z = -0.16;
    fig.add(forearmR);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.23, 24, 24), skinMat);
    head.position.y = 1.97;
    fig.add(head);

    // Eye glow
    const eyeMat = new THREE.MeshBasicMaterial({ color: sig.accent });
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), eyeMat);
    eyeL.position.set(-0.07, 1.99, 0.22);
    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), eyeMat);
    eyeR.position.set(0.07, 1.99, 0.22);
    fig.add(eyeL, eyeR);

    // Class-specific headgear
    addClassHeadgear(fig, classId, sig, accentMat, robeMat);

    // Weapons / class-specific accessories
    addClassWeapon(fig, sig, accentMat);

    // Aura sphere
    const aura = new THREE.Mesh(new THREE.SphereGeometry(1.2, 24, 24), auraMat);
    aura.position.y = 1.05;
    fig.add(aura);

    // --- Particle System ---
    const positions = new Float32Array(120 * 3);
    for (let i = 0; i < 120; i++) {
      const r     = 0.5 + Math.random() * 1.0;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.random() * Math.PI;
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = 0.5 + r * Math.sin(phi) * Math.sin(theta) * 1.4;
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const ptMat = new THREE.PointsMaterial({
      color: sig.accent,
      size: 0.032,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(ptGeo, ptMat);
    scene.add(particles);

    // --- Animation loop ---
    let raf;
    let t = 0;
    const tick = () => {
      t += 0.014;
      if (autoRotate) fig.rotation.y += 0.004;

      // Breathing
      torso.scale.y       = 1 + Math.sin(t * 1.5) * 0.018;
      chestDetail.scale.y = 1 + Math.sin(t * 1.5) * 0.015;
      head.position.y     = 1.97 + Math.sin(t * 1.5) * 0.010;
      eyeL.position.y     = 1.99 + Math.sin(t * 1.5) * 0.010;
      eyeR.position.y     = 1.99 + Math.sin(t * 1.5) * 0.010;

      // Aura pulse
      aura.scale.setScalar(1 + Math.sin(t * 1.1) * 0.055);
      aura.material.opacity = 0.10 + Math.sin(t * 1.1) * 0.04;

      // Inner point light pulse
      innerLight.intensity = 2.2 + Math.sin(t * 1.8) * 0.6;

      // Inner ring pulse
      const innerRing = scene.userData.innerRing;
      if (innerRing) {
        innerRing.material.opacity = 0.4 + Math.sin(t * 2.0) * 0.25;
        innerRing.rotation.z += 0.01;
      }

      // Particles
      particles.rotation.y += 0.003;
      particles.rotation.x = Math.sin(t * 0.4) * 0.08;
      ptMat.opacity = 0.55 + Math.sin(t * 1.3) * 0.2;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      scene.traverse(obj => {
        if (obj.isPoints) {
          obj.geometry.dispose();
          obj.material.dispose();
        }
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
    };
  }, [classId, size, showStage, autoRotate]);

  return <div ref={mountRef} style={{ width: size, height: size }} />;
}

function addClassHeadgear(fig, classId, sig, accentMat, robeMat) {
  if (classId === 'mage' || classId === 'necromancer') {
    const hood = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.45, 12, 1, true), robeMat);
    hood.position.y = 1.85;
    fig.add(hood);
  } else if (classId === 'paladin') {
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.28, 0.025, 8, 32),
      new THREE.MeshStandardMaterial({ color: sig.accent, emissive: sig.accent, emissiveIntensity: 1 })
    );
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 1.96;
    fig.add(halo);
  } else if (classId === 'berserker') {
    const horn = new THREE.ConeGeometry(0.05, 0.22, 8);
    const hl = new THREE.Mesh(horn, accentMat); hl.position.set(-0.13, 1.94, 0); hl.rotation.z = -0.5;
    const hr = new THREE.Mesh(horn, accentMat); hr.position.set( 0.13, 1.94, 0); hr.rotation.z =  0.5;
    fig.add(hl, hr);
  } else if (classId === 'monarch') {
    const crown = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.26, 0.15, 6, 1, true),
      new THREE.MeshStandardMaterial({ color: sig.primary, emissive: sig.primary, emissiveIntensity: 0.7, metalness: 1, roughness: 0.2 })
    );
    crown.position.y = 1.92;
    fig.add(crown);
    for (let i = 0; i < 6; i++) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.18, 8), accentMat);
      const a = (i / 6) * Math.PI * 2;
      spike.position.set(Math.cos(a) * 0.24, 2.06, Math.sin(a) * 0.24);
      fig.add(spike);
    }
  } else if (classId === 'assassin') {
    const hood = new THREE.Mesh(
      new THREE.ConeGeometry(0.26, 0.36, 12, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x0e1818, roughness: 0.9 })
    );
    hood.position.y = 1.82;
    fig.add(hood);
  } else if (classId === 'monk') {
    const band = new THREE.Mesh(
      new THREE.TorusGeometry(0.21, 0.018, 8, 32),
      new THREE.MeshStandardMaterial({ color: sig.accent, emissive: sig.accent, emissiveIntensity: 0.6 })
    );
    band.position.y = 1.74;
    band.rotation.x = Math.PI / 2;
    fig.add(band);
  } else if (classId === 'ranger') {
    const hood = new THREE.Mesh(
      new THREE.ConeGeometry(0.27, 0.4, 12, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x2a3a1a, roughness: 0.9 })
    );
    hood.position.y = 1.84;
    fig.add(hood);
  }
}

function addClassWeapon(fig, sig, accentMat) {
  const weapon = sig.weapon;
  if (weapon === 'staff') {
    const staff = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 1.6, 8),
      new THREE.MeshStandardMaterial({ color: 0x4a3a2a, roughness: 0.7 })
    );
    staff.position.set(0.55, 1.2, 0.05);
    staff.rotation.z = -0.05;
    fig.add(staff);
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 16, 16),
      new THREE.MeshStandardMaterial({ color: sig.accent, emissive: sig.accent, emissiveIntensity: 1.2 })
    );
    orb.position.set(0.55, 2.0, 0.05);
    fig.add(orb);
  } else if (weapon === 'sword' || weapon === 'rune-blade') {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.05, 0.12), accentMat);
    blade.position.set(-0.55, 1.4, 0.06);
    fig.add(blade);
    const hilt = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.08, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x4a3a2a })
    );
    hilt.position.set(-0.55, 0.85, 0.06);
    fig.add(hilt);
  } else if (weapon === 'daggers') {
    for (let s of [-1, 1]) {
      const d = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.32, 8), accentMat);
      d.position.set(0.45 * s, 0.85, 0.16);
      d.rotation.x = Math.PI / 1.6;
      fig.add(d);
    }
  } else if (weapon === 'axe') {
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 1.1, 8),
      new THREE.MeshStandardMaterial({ color: 0x3a2a1a })
    );
    handle.position.set(0.55, 1.3, 0);
    handle.rotation.z = -0.05;
    fig.add(handle);
    const axeHead = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.22, 0.06), accentMat);
    axeHead.position.set(0.55, 1.85, 0);
    fig.add(axeHead);
  } else if (weapon === 'orb') {
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 24, 24),
      new THREE.MeshStandardMaterial({ color: sig.primary, emissive: sig.primary, emissiveIntensity: 1.4 })
    );
    orb.position.set(0, 1.25, 0.4);
    fig.add(orb);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 8, 8),
        new THREE.MeshBasicMaterial({ color: sig.accent })
      );
      sphere.position.set(Math.cos(a) * 0.32, 1.25 + Math.sin(a * 2) * 0.08, 0.4 + Math.sin(a) * 0.32);
      fig.add(sphere);
    }
  } else if (weapon === 'bow') {
    const bow = new THREE.Mesh(
      new THREE.TorusGeometry(0.55, 0.025, 8, 24, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0x4a3a1a })
    );
    bow.position.set(-0.55, 1.2, 0.05);
    bow.rotation.z = Math.PI / 2;
    fig.add(bow);
    const string = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.005, 1.1, 4),
      new THREE.MeshBasicMaterial({ color: 0xeeeeee })
    );
    string.position.set(-0.5, 1.2, 0.05);
    fig.add(string);
  } else if (weapon === 'scythe') {
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 1.7, 8),
      new THREE.MeshStandardMaterial({ color: 0x281f3a })
    );
    handle.position.set(0.55, 1.2, 0);
    handle.rotation.z = 0.08;
    fig.add(handle);
    const scytheBlade = new THREE.Mesh(
      new THREE.TorusGeometry(0.32, 0.04, 8, 16, Math.PI / 1.4),
      accentMat
    );
    scytheBlade.position.set(0.6, 2.0, 0);
    scytheBlade.rotation.z = 1.0;
    fig.add(scytheBlade);
  } else if (weapon === 'fists') {
    const fistMat = new THREE.MeshStandardMaterial({
      color: sig.accent, emissive: sig.accent, emissiveIntensity: 1.1,
    });
    const fL = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), fistMat);
    fL.position.set(-0.5, 0.78, 0.1);
    const fR = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), fistMat);
    fR.position.set(0.5, 0.78, 0.1);
    fig.add(fL, fR);
  }
}

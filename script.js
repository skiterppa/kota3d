import * as THREE from "three";

const container = document.getElementById("three-canvas-container");
const width = container.clientWidth;
const height = container.clientHeight;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0d10);

const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
camera.position.set(4, 3, 8);
camera.lookAt(0, 0.2, 0);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

// Valot
const ambient = new THREE.AmbientLight(0x404060, 0.6);
scene.add(ambient);

const mainLight = new THREE.DirectionalLight(0xffeedd, 1.2);
mainLight.position.set(5, 8, 7);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 1024;
mainLight.shadow.mapSize.height = 1024;
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0x4488ff, 0.5);
fillLight.position.set(-4, 2, 5);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0x88bbff, 0.6);
rimLight.position.set(-2, 1, -8);
scene.add(rimLight);

const backLight = new THREE.PointLight(0x3f7aff, 0.5, 15);
backLight.position.set(-3, 2, -6);
scene.add(backLight);

// --- 3D PERINTEINEN KAHVIKUPPI ---
const coffeeGroup = new THREE.Group();

// Materiaalit
const cupMat = new THREE.MeshStandardMaterial({
  color: 0x2a3040,
  roughness: 0.15,
  metalness: 0.4,
  emissive: new THREE.Color(0x111822),
  emissiveIntensity: 0.03,
});

const cupMatLight = new THREE.MeshStandardMaterial({
  color: 0x3a4a5a,
  roughness: 0.15,
  metalness: 0.3,
});

const accentMat = new THREE.MeshStandardMaterial({
  color: 0x3f7aff,
  roughness: 0.2,
  metalness: 0.5,
  emissive: new THREE.Color(0x1f4faf),
  emissiveIntensity: 0.08,
});

const coffeeMat = new THREE.MeshStandardMaterial({
  color: 0x3d1f0a,
  roughness: 0.9,
  metalness: 0.0,
  emissive: new THREE.Color(0x2a1508),
  emissiveIntensity: 0.05,
});

const saucerMat = new THREE.MeshStandardMaterial({
  color: 0x2a3040,
  roughness: 0.2,
  metalness: 0.3,
});

// 1. Aluslautanen (sileä, perinteinen)
const saucerGroup = new THREE.Group();

// Lautasen pääosa - matala, pyöreä
const saucerShape = new THREE.Shape();
saucerShape.moveTo(0, 0);
saucerShape.absarc(0, 0, 1.3, 0, Math.PI * 2, false);

const saucerExtrudeSettings = {
  steps: 1,
  depth: 0.06,
  bevelEnabled: true,
  bevelThickness: 0.02,
  bevelSize: 0.02,
  bevelSegments: 8,
};

const saucerGeometry = new THREE.ExtrudeGeometry(saucerShape, saucerExtrudeSettings);
const saucer = new THREE.Mesh(saucerGeometry, saucerMat);
saucer.position.y = -0.03;
saucer.rotation.x = -Math.PI / 2;
saucer.castShadow = true;
saucer.receiveShadow = true;
saucerGroup.add(saucer);

// Lautasen korotettu reunus
const saucerRim = new THREE.Mesh(
  new THREE.TorusGeometry(1.2, 0.025, 16, 48),
  saucerMat
);
saucerRim.position.y = 0.04;
saucerRim.rotation.x = Math.PI / 2;
saucerRim.castShadow = true;
saucerGroup.add(saucerRim);

// Lautasen keskikoroke
const saucerCenter = new THREE.Mesh(
  new THREE.CylinderGeometry(0.35, 0.45, 0.04, 24),
  saucerMat
);
saucerCenter.position.y = 0.04;
saucerCenter.castShadow = true;
saucerGroup.add(saucerCenter);

coffeeGroup.add(saucerGroup);

// 2. Kuppi (sileä, perinteinen muoto)
const cupGroup = new THREE.Group();
cupGroup.position.y = 0.08;

// Kupin runko - käytetään lathe-geometriaa sileään muotoon
const cupPoints = [];
const segments = 20;

for (let i = 0; i <= segments; i++) {
  const t = i / segments;
  const y = t * 1.0;
  // Sileä, hieman kapeneva muoto
  let radius;
  if (y < 0.1) {
    // Pohja
    radius = 0.65 + y * 0.5;
  } else if (y < 0.85) {
    // Tasainen runko, hieman levenee ylöspäin
    radius = 0.7 + (y - 0.1) * 0.2;
  } else {
    // Yläreuna - hieman levenee
    radius = 0.85 + (y - 0.85) * 0.5;
  }
  cupPoints.push(new THREE.Vector2(radius, y - 0.5));
}

const cupGeometry = new THREE.LatheGeometry(cupPoints, 32);
const cup = new THREE.Mesh(cupGeometry, cupMat);
cup.castShadow = true;
cup.receiveShadow = true;
cupGroup.add(cup);

// Kupin pohja (paksumpi)
const cupBottom = new THREE.Mesh(
  new THREE.CircleGeometry(0.65, 24),
  cupMatLight
);
cupBottom.position.y = -0.5;
cupBottom.rotation.x = -Math.PI / 2;
cupBottom.castShadow = true;
cupBottom.receiveShadow = true;
cupGroup.add(cupBottom);

// Kupin yläreuna (sileä kaulus)
const cupRim = new THREE.Mesh(
  new THREE.TorusGeometry(0.85, 0.025, 16, 32),
  cupMatLight
);
cupRim.position.y = 0.5;
cupRim.rotation.x = Math.PI / 2;
cupRim.castShadow = true;
cupGroup.add(cupRim);

// 3. D-mallinen kahva
const handleGroup = new THREE.Group();

// D-mallinen kahva - käytetään putkea
const handlePoints = [];
const handleSegments = 24;

// D-muoto: suora alaosa, kaareva yläosa ja sivu
for (let i = 0; i <= handleSegments; i++) {
  const t = i / handleSegments;
  const angle = t * Math.PI * 1.5 + Math.PI * 0.25;
  
  let x, y;
  if (t < 0.4) {
    // Alaosa - suora
    const lt = t / 0.4;
    x = 0.85 + lt * 0.35;
    y = -0.3 + lt * 0.3;
  } else if (t < 0.7) {
    // Sivukaari
    const lt = (t - 0.4) / 0.3;
    const angle2 = lt * Math.PI * 0.5 + Math.PI * 0.5;
    x = 1.2 + Math.cos(angle2) * 0.15;
    y = 0 + Math.sin(angle2) * 0.3;
  } else {
    // Yläkaari takaisin kupiin
    const lt = (t - 0.7) / 0.3;
    const angle2 = lt * Math.PI * 0.5;
    x = 1.2 - Math.sin(angle2) * 0.35;
    y = 0.3 + Math.cos(angle2) * 0.2;
  }
  
  handlePoints.push(new THREE.Vector3(x, y, 0));
}

// Luo D-muotoinen putki
const handleCurve = new THREE.CatmullRomCurve3(handlePoints);
const handleTube = new THREE.TubeGeometry(handleCurve, 20, 0.045, 8, false);
const handle = new THREE.Mesh(handleTube, cupMatLight);
handle.castShadow = true;
handle.receiveShadow = true;
handleGroup.add(handle);

// Kahvan kiinnityskohdat (pyöristetyt)
const attachPoints = [
  [0.85, -0.3, 0],
  [0.85, 0.3, 0]
];

attachPoints.forEach(pos => {
  const attach = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 8, 8),
    cupMatLight
  );
  attach.position.set(pos[0], pos[1], pos[2]);
  attach.castShadow = true;
  handleGroup.add(attach);
});

cupGroup.add(handleGroup);

// 4. Kahvi (pinta)
const coffeeSurface = new THREE.Mesh(
  new THREE.CircleGeometry(0.78, 32),
  coffeeMat
);
coffeeSurface.position.y = 0.48;
coffeeSurface.rotation.x = -Math.PI / 2;
coffeeSurface.receiveShadow = true;
cupGroup.add(coffeeSurface);

// 5. Koristeellinen ohut viiva (minimalistinen)
const decorRing = new THREE.Mesh(
  new THREE.TorusGeometry(0.78, 0.01, 8, 32),
  accentMat
);
decorRing.position.y = 0.1;
decorRing.rotation.x = Math.PI / 2;
decorRing.castShadow = true;
cupGroup.add(decorRing);

coffeeGroup.add(cupGroup);

// Skaalaa ja aseta
coffeeGroup.scale.set(1.0, 1.0, 1.0);
coffeeGroup.position.y = 0.0;

scene.add(coffeeGroup);

// --- Lattia / heijastus ---
const floorGeo = new THREE.CircleGeometry(4.5, 32);
const floorMat = new THREE.MeshStandardMaterial({
  color: 0x1a2233,
  transparent: true,
  opacity: 0.2,
  roughness: 0.4,
  metalness: 0.2,
  side: THREE.DoubleSide,
});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.15;
floor.receiveShadow = true;
scene.add(floor);

// Valokehä
const ringGeo = new THREE.RingGeometry(1.8, 2.2, 64);
const ringMat = new THREE.MeshStandardMaterial({
  color: 0x3f7aff,
  emissive: 0x1f4faf,
  transparent: true,
  opacity: 0.1,
  side: THREE.DoubleSide,
});
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = -Math.PI / 2;
ring.position.y = -0.05;
scene.add(ring);

// --- Animaatio ---
function animate() {
  const elapsed = performance.now() * 0.001;

  // Pyöritä kahvikuppia hitaasti
  coffeeGroup.rotation.y += 0.004;
  coffeeGroup.rotation.x = Math.sin(elapsed * 0.06) * 0.02;
  coffeeGroup.rotation.z = Math.sin(elapsed * 0.05) * 0.015;

  // Kameran kevyt liike
  camera.position.x = 4.5 * Math.sin(elapsed * 0.02);
  camera.position.z = 7 + 1.0 * Math.sin(elapsed * 0.015);
  camera.lookAt(0, 0.3, 0);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

// --- Ikkunan koko ---
window.addEventListener("resize", () => {
  const w = container.clientWidth;
  const h = container.clientHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
});
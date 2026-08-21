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

const paperMat = new THREE.MeshStandardMaterial({
  color: 0xe6ded0,
  roughness: 0.8,
  metalness: 0.0,
});

const lidMat = new THREE.MeshStandardMaterial({
  color: 0x20252a,
  roughness: 0.32,
  metalness: 0.05,
});

const sleeveMat = new THREE.MeshStandardMaterial({
  color: 0x9a5b35,
  roughness: 0.95,
  metalness: 0.0,
});

// 1. Aluslautanen (sileä, perinteinen)
const saucerGroup = new THREE.Group();

// Lautasen pääosa - matala, pyöreä
const saucerShape = new THREE.Shape();
saucerShape.moveTo(0, 0);
saucerShape.absarc(0, 0, 1.5, 0, Math.PI * 2, false);

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
  new THREE.TorusGeometry(1.42, 0.025, 16, 48),
  saucerMat
);
saucerRim.position.y = 0.04;
saucerRim.rotation.x = Math.PI / 2;
saucerRim.castShadow = true;
saucerGroup.add(saucerRim);

// Lautasen keskikoroke
const saucerCenter = new THREE.Mesh(
  new THREE.CylinderGeometry(0.42, 0.52, 0.04, 24),
  saucerMat
);
saucerCenter.position.y = 0.04;
saucerCenter.castShadow = true;
saucerGroup.add(saucerCenter);

// Takeaway-kuppi ei tarvitse aluslautasta.

// 2. Jääkuutio ja sen pinnalle tiivistyneet vesipisarat
const cupGroup = new THREE.Group();
cupGroup.position.y = 0.9;

const iceMat = new THREE.MeshPhysicalMaterial({
  color: 0x9edcff,
  transparent: true,
  opacity: 0.58,
  roughness: 0.08,
  metalness: 0.0,
  transmission: 0.25,
  thickness: 0.35,
  clearcoat: 0.8,
});

const iceEdgeMat = new THREE.LineBasicMaterial({
  color: 0xc8efff,
  transparent: true,
  opacity: 0.7,
});

const dropletMat = new THREE.MeshPhysicalMaterial({
  color: 0x78cfff,
  transparent: true,
  opacity: 0.8,
  roughness: 0.03,
  metalness: 0.0,
  transmission: 0.35,
  thickness: 0.18,
  clearcoat: 1.0,
});

const iceCube = new THREE.Mesh(
  new THREE.BoxGeometry(1.65, 1.65, 1.65),
  iceMat
);
iceCube.castShadow = true;
iceCube.receiveShadow = true;
cupGroup.add(iceCube);

const iceEdges = new THREE.LineSegments(
  new THREE.EdgesGeometry(iceCube.geometry),
  iceEdgeMat
);
iceEdges.scale.setScalar(1.005);
cupGroup.add(iceEdges);

// Pisaran profiili on pyöreä alhaalta ja terävä ylhäältä.
const dropletProfile = [
  [0.0, -0.16],
  [0.055, -0.14],
  [0.1, -0.06],
  [0.085, 0.06],
  [0.045, 0.14],
  [0.0, 0.22],
].map(([radius, y]) => new THREE.Vector2(radius, y));

function addDroplet(position, size, face) {
  const droplet = new THREE.Mesh(
    new THREE.LatheGeometry(dropletProfile, 16),
    dropletMat
  );
  droplet.position.set(position[0], position[1], position[2]);
  droplet.scale.set(size, size, size);

  if (face === "front" || face === "back") {
    droplet.scale.z = size * 0.28;
  } else if (face === "left" || face === "right") {
    droplet.scale.x = size * 0.28;
  } else {
    droplet.rotation.x = Math.PI / 2;
    droplet.scale.z = size * 0.28;
  }

  droplet.castShadow = true;
  cupGroup.add(droplet);
}

// Pisaroita kaikilla kuution sivuilla.
[
  [[-0.52, 0.38, 0.84], 0.85, "front"],
  [[-0.15, -0.08, 0.84], 1.1, "front"],
  [[0.42, -0.3, 0.84], 0.72, "front"],
  [[0.3, 0.44, -0.84], 0.9, "back"],
  [[-0.42, -0.28, -0.84], 0.72, "back"],
  [[0.84, 0.34, 0.3], 0.82, "right"],
  [[0.84, -0.32, -0.35], 1.0, "right"],
  [[-0.84, 0.15, 0.42], 0.92, "left"],
  [[-0.84, -0.42, -0.2], 0.7, "left"],
  [[-0.38, 0.84, 0.28], 0.68, "top"],
  [[0.34, 0.84, -0.35], 0.86, "top"],
].forEach(([position, size, face]) => {
  addDroplet(position, size, face);
});

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
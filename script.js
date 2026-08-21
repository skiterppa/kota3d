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

// --- 3D PERINTEINEN KOTA ---
const kotaGroup = new THREE.Group();

const woodMat = new THREE.MeshStandardMaterial({
  color: 0x9b5a32,
  roughness: 0.9,
  metalness: 0.0,
});
const roofMat = new THREE.MeshStandardMaterial({
  color: 0x38231b,
  roughness: 1.0,
  metalness: 0.0,
});
const plankEdgeMat = new THREE.MeshStandardMaterial({
  color: 0x6b3925,
  roughness: 0.95,
  metalness: 0.0,
});
const darkWoodMat = new THREE.MeshStandardMaterial({
  color: 0x2a1714,
  roughness: 0.9,
  metalness: 0.0,
});
const copperMat = new THREE.MeshStandardMaterial({
  color: 0x9a5532,
  roughness: 0.75,
  metalness: 0.1,
});

function addKotaPart(geometry, material, position) {
  const part = new THREE.Mesh(geometry, material);
  part.position.set(...position);
  part.castShadow = true;
  part.receiveShadow = true;
  kotaGroup.add(part);
  return part;
}

const plankCount = 16;
const plankRadius = 1.22;
for (let index = 0; index < plankCount; index += 1) {
  const angle = (index / plankCount) * Math.PI * 2;
  const plank = addKotaPart(
    new THREE.BoxGeometry(0.49, 1.5, 0.16),
    index % 3 === 0 ? plankEdgeMat : woodMat,
    [Math.sin(angle) * plankRadius, 0.78, Math.cos(angle) * plankRadius]
  );
  plank.rotation.y = angle;
}

addKotaPart(new THREE.CylinderGeometry(1.3, 1.42, 0.16, 16), darkWoodMat, [0, 0.05, 0]);
addKotaPart(new THREE.ConeGeometry(1.52, 1.55, 16), roofMat, [0, 2.22, 0]);

const doorShape = new THREE.Shape();
doorShape.moveTo(-0.31, 0);
doorShape.lineTo(0.31, 0);
doorShape.lineTo(0.31, 0.78);
doorShape.absarc(0, 0.78, 0.31, 0, Math.PI, false);
doorShape.closePath();
addKotaPart(
  new THREE.ExtrudeGeometry(doorShape, { depth: 0.1, bevelEnabled: false }),
  darkWoodMat,
  [0, 0.1, 1.27]
);

[-0.35, 0.35].forEach((x) => {
  addKotaPart(new THREE.BoxGeometry(0.1, 0.8, 0.12), woodMat, [x, 0.5, 1.34]);
});

const doorArch = new THREE.Mesh(
  new THREE.TorusGeometry(0.35, 0.055, 8, 24, Math.PI),
  woodMat
);
doorArch.position.set(0, 0.9, 1.34);
doorArch.castShadow = true;
kotaGroup.add(doorArch);

const entranceStep = addKotaPart(
  new THREE.BoxGeometry(0.86, 0.14, 0.42),
  plankEdgeMat,
  [0, 0.08, 1.39]
);

kotaGroup.scale.setScalar(0.945);
kotaGroup.position.y = -0.08;
scene.add(kotaGroup);

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

  // Pyöritä kotaa hitaasti
  kotaGroup.rotation.y += 0.004;
  kotaGroup.rotation.x = Math.sin(elapsed * 0.06) * 0.02;
  kotaGroup.rotation.z = Math.sin(elapsed * 0.05) * 0.015;

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
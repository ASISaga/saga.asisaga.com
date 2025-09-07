import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

export function setupScene() {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05060a, 0.02);
  return scene;
}

export function setupCamera() {
  const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 200);
  camera.position.set(0, 0, 7.5);
  return camera;
}

export function setupRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(renderer.domElement);
  return renderer;
}

export function setupLighting(scene) {
  scene.add(new THREE.AmbientLight(0x6ea9ff, 0.38));
  const dir = new THREE.DirectionalLight(0x9ee8ff, 0.85);
  dir.position.set(2.2, 2.8, 2.6);
  scene.add(dir);
}

export function setupCore(scene) {
  const coreRadius = 1.08;
  const coreGeometry = new THREE.SphereGeometry(coreRadius * 0.96, 48, 48);
  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.2,
    roughness: 0.05,
    transmission: 1.0,
    thickness: 1.0,
    ior: 1.45,
    transparent: true,
    opacity: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.01,
    reflectivity: 0.7,
    emissive: 0x89e4ff,
    emissiveIntensity: 0.08
  });
  const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
  coreMesh.renderOrder = 1;
  scene.add(coreMesh);
  return { coreMesh, coreRadius };
}

// core.js - Scene, camera, renderer, lighting, and core mesh setup for ASI Saga
// Provides functions to create and configure the main Three.js scene and its core elements

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
  // Slightly larger geometry to ensure brain fits inside
  const coreGeometry = new THREE.SphereGeometry(coreRadius, 64, 64);
  // Enhanced glass-like material
  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.2,
    transmission: 0.0,
    thickness: 0.1,
    ior: 1.0,
    transparent: true,
    opacity: 0.01,
    clearcoat: 0.2,
    clearcoatRoughness: 0.05,
    reflectivity: 0.1,
    emissive: 0x89e4ff,
    emissiveIntensity: 0.04,
    envMapIntensity: 0.0,
    specularIntensity: 0.0
  });
  const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
  coreMesh.renderOrder = 1;
  scene.add(coreMesh);
  return { coreMesh, coreRadius };
}

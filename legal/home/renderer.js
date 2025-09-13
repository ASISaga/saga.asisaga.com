// core.js - Scene, camera, renderer, lighting, and core mesh setup for ASI Saga
// Provides functions to create and configure the main Three.js scene and its core elements

import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

export class Renderer {
  renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  setCamera(camera) {
    this.camera = camera;
  }
  constructor() {
    this.scene = this.createScene();
    this.camera = this.createCamera();
    this.renderer = this.createRenderer();
    this.setupLighting();
    this.coreRadius = this.setupCore();
  }

  createScene() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05060a, 0.02);
    return scene;
  }

  createCamera() {
    const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 200);
    camera.position.set(0, 0, 7.5);
    return camera;
  }

  createRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    document.body.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100vw';
    renderer.domElement.style.height = '100vh';
    return renderer;
  }

  setupLighting() {
    this.scene.add(new THREE.AmbientLight(0x6ea9ff, 0.38));
    const dir = new THREE.DirectionalLight(0x9ee8ff, 0.85);
    dir.position.set(2.2, 2.8, 2.6);
    this.scene.add(dir);
  }

  setupCore() {
    // No core mesh; only provide coreRadius for brain and thoughts placement
    return 1.08;
  }
}

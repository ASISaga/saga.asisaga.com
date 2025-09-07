import { setupScene, setupCamera, setupRenderer, setupLighting, setupCore } from './core.js';
import { setupBrain } from './brain.js';
import { setupThoughts, ThoughtsManager } from './thoughts.js';
import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

document.addEventListener('DOMContentLoaded', () => {
  const scene = setupScene();
  const camera = setupCamera();
  const renderer = setupRenderer();
  setupLighting(scene);
  const { coreMesh, coreRadius } = setupCore(scene);
  const { neuronMeshes } = setupBrain(scene, coreRadius);
  const { thoughtSprites } = setupThoughts(scene, coreRadius);
  const thoughtsManager = new ThoughtsManager(scene, coreRadius, thoughtSprites, neuronMeshes);
  thoughtsManager.setRenderer(renderer);
  thoughtsManager.setCamera(camera);
  thoughtsManager.animate(coreMesh);
});

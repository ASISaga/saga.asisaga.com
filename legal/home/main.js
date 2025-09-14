/**
 * ASI Saga Scene Overview
 *
 * This scene visualizes a stylized, animated representation of a mind or intelligence.
 * At the center is a stylized side-view outline of a brain, with distinct anatomical lobes and neuron spheres.
 * Neurons are connected by lines, and their colors/emissive intensities pulse to simulate neural activity.
 * Animated thought balloon emojis (sprites) spiral inward from the edges of the screen, orbiting and vanishing as they reach the core.
 * The entire scene is rendered in Three.js with soft lighting and fog for depth, creating a sense of mystery and emergence.
 * All elements are managed and animated in real time, with the ThoughtsManager orchestrating the movement and effects.
 */

// main.js - Entry point for the ASI Saga animation
// Sets up the Three.js scene, camera, renderer, lighting, core, brain, and thoughts
// and starts the animation loop using ThoughtsManager
//
// Imports:
//   - setupScene, setupCamera, setupRenderer, setupLighting, setupCore: scene and core setup
//   - setupBrain: brain outline and neurons
//   - ThoughtsManager: thought sprites and animation manager
import { Renderer } from './renderer.js';
import { setupBrain } from './brain.js';
import { ThoughtManager } from './thoughts.js';

// Wait for DOM to be ready before initializing Three.js scene
document.addEventListener('DOMContentLoaded', () => {
  // Create renderer instance
  const rendererInstance = new Renderer();
  const scene = rendererInstance.scene;
  const camera = rendererInstance.camera;
  const renderer = rendererInstance.renderer;
  const coreRadius = rendererInstance.coreRadius;

  setupBrain(scene, coreRadius);

  // Create the manager for animating thoughts (SVG neurons only)
    const thoughtManager = new ThoughtManager(scene, coreRadius);
    thoughtManager.setCamera(camera);
    thoughtManager.setRenderer(renderer);
    thoughtManager.animate();
});

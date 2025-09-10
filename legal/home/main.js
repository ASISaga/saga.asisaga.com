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
//   - setupThoughts, ThoughtsManager: thought sprites and animation manager
import { setupScene, setupCamera, setupRenderer, setupLighting, setupCore } from './core.js';
import { setupBrain } from './brain.js';
import { setupThoughts, ThoughtsManager } from './thoughts.js';

// Wait for DOM to be ready before initializing Three.js scene
document.addEventListener('DOMContentLoaded', () => {
  // Create the main 3D scene
  const scene = setupScene();
  // Set up the camera for viewing the scene
  const camera = setupCamera();
  // Set up the renderer and add its canvas to the DOM
  const renderer = setupRenderer();
  // Add ambient and directional lighting to the scene
  setupLighting(scene);
  // No core sphere; show the brain directly at the center
  const coreRadius = 1.08;
  setupBrain(scene, coreRadius);
  // Add animated thought sprites (emojis)
  const { thoughtSprites } = setupThoughts(scene, coreRadius);
  // Create the manager for animating thoughts (SVG neurons only)
  const thoughtsManager = new ThoughtsManager(scene, coreRadius, thoughtSprites);
  // Provide renderer and camera to the manager for animation and projection
  thoughtsManager.setRenderer(renderer);
  thoughtsManager.setCamera(camera);
  // Start the animation loop
  thoughtsManager.animate();
});

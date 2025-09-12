// brain.js - Brain outline and neuron mesh setup for ASI Saga
// Provides function to add a stylized brain outline and neuron spheres to the scene

import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

export function setupBrain(scene, coreRadius) {
  // Use SVG brain in animation
  const svgUrl = 'brain.svg';
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '50%';
  container.style.left = '50%';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.pointerEvents = 'none';
  container.style.transform = 'translate(-50%, -50%)';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  document.body.appendChild(container);

  fetch(svgUrl)
    .then(response => response.text())
    .then(svgText => {
      container.innerHTML = svgText;
      const svg = container.querySelector('svg');
      if (svg) {
        svg.style.width = '40vw';
        svg.style.height = '40vh';
        svg.style.display = 'block';
        svg.style.margin = 'auto';
        svg.style.position = 'relative';
        svg.style.overflow = 'visible';
        svg.style.transform = 'none';
        svg.style.left = '0';
        svg.style.top = '0';
        svg.style.transformOrigin = 'center center';
        svg.style.border = 'none';
        svg.style.background = 'transparent';
        // Example animation: pulse effect
//        svg.animate([
  //        { transform: 'scale(1)' },
    //      { transform: 'scale(1.05)' },
      //    { transform: 'scale(1)' }
        //], {
          //duration: 2000,
         // iterations: Infinity
        //});
      }
    });

  // ...existing code...
}

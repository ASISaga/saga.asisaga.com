// brain.js - Brain outline and neuron mesh setup for ASI Saga
// Provides function to add a stylized brain outline and neuron spheres to the scene

import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

export function setupBrain(scene, coreRadius) {
  // Use SVG brain in animation
  const svgUrl = 'brain.svg';
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.pointerEvents = 'none';
  document.body.appendChild(container);

  fetch(svgUrl)
    .then(response => response.text())
    .then(svgText => {
      container.innerHTML = svgText;
      const svg = container.querySelector('svg');
      if (svg) {
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        // Example animation: pulse effect
        svg.animate([
          { transform: 'scale(1)' },
          { transform: 'scale(1.05)' },
          { transform: 'scale(1)' }
        ], {
          duration: 2000,
          iterations: Infinity
        });
      }
    });

  // Complex neural network: 12 neurons randomly distributed inside the brain volume
  const neuronCount = 12;
  const neuronRadius = 0.07;
  const neuronMeshes = [];
  const neurons = [];
  // Use bounding box of brainCurve for placement
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const v of brainCurve) {
    minX = Math.min(minX, v.x); maxX = Math.max(maxX, v.x);
    minY = Math.min(minY, v.y); maxY = Math.max(maxY, v.y);
    minZ = Math.min(minZ, v.z); maxZ = Math.max(maxZ, v.z);
  }
  for (let i = 0; i < neuronCount; i++) {
    // Random position inside bounding box, scaled to brain size
    let pos;
    let attempts = 0;
    do {
      pos = new THREE.Vector3(
        minX + Math.random() * (maxX - minX),
        minY + Math.random() * (maxY - minY),
        minZ + Math.random() * (maxZ - minZ)
  ).multiplyScalar(coreRadius * 2.20);
      // Only accept if inside convex hull (approximate by distance to center)
      attempts++;
    } while (pos.length() > coreRadius * 0.6 && attempts < 10);
    neurons.push(pos);
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(neuronRadius, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0xffffe0,
        emissive: 0x99ccff,
        emissiveIntensity: 0.18,
        metalness: 0.6,
        roughness: 0.18,
        transparent: false,
        opacity: 1.0
      })
    );
    mesh.position.copy(pos);
    mesh.renderOrder = 101;
    scene.add(mesh);
    neuronMeshes.push(mesh);
  }
  // Connect each neuron to 3-5 random others
  for (let i = 0; i < neuronCount; i++) {
    const connections = new Set();
    while (connections.size < 3 + Math.floor(Math.random() * 3)) {
      const j = Math.floor(Math.random() * neuronCount);
      if (j !== i) connections.add(j);
    }
    for (const j of connections) {
      const a = neurons[i];
      const b = neurons[j];
      const geometry = new THREE.BufferGeometry().setFromPoints([a, b]);
      const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x99ccff, transparent: false, opacity: 0.5, linewidth: 1 }));
      line.renderOrder = 101;
      scene.add(line);
    }
  }
  return { neuronMeshes };
}

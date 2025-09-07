import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

export function setupBrain(scene, coreRadius) {
  // Side view brain outline: more anatomical, with distinct lobes
  const brainCurve = [
    new THREE.Vector3(-0.65, 0.18, 0.0), // occipital lobe (back)
    new THREE.Vector3(-0.75, 0.38, 0.08), // occipital upper
    new THREE.Vector3(-0.68, 0.65, 0.18), // parietal
    new THREE.Vector3(-0.45, 0.78, 0.22), // parietal upper
    new THREE.Vector3(0.0, 0.82, 0.18),   // top
    new THREE.Vector3(0.45, 0.75, 0.12),  // frontal upper
    new THREE.Vector3(0.68, 0.55, 0.05),  // frontal lobe (front top)
    new THREE.Vector3(0.75, 0.28, -0.05), // frontal
    new THREE.Vector3(0.65, 0.05, -0.12), // temporal lobe (front lower)
    new THREE.Vector3(0.45, -0.18, -0.18),// temporal lower
    new THREE.Vector3(0.0, -0.38, -0.22), // bottom center
    new THREE.Vector3(-0.35, -0.45, -0.18),// cerebellum
    new THREE.Vector3(-0.55, -0.38, -0.12),// cerebellum lower
    new THREE.Vector3(-0.65, 0.18, 0.0)    // close loop
  ];
  for (let v of brainCurve) v.z += 0.15;
  const brainGeometry = new THREE.BufferGeometry().setFromPoints(brainCurve.map(v => v.clone().multiplyScalar(coreRadius * 0.6)));
  // Use fat line material for better visibility
  const brainLineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: false, opacity: 1.0, linewidth: 4 });
  const brainLine = new THREE.Line(brainGeometry, brainLineMaterial);
  brainLine.renderOrder = 100;
  scene.add(brainLine);

  // Neuron positions (on curve)
  const neuronCount = 12;
  const neuronRadius = 0.11;
  const neuronMeshes = [];
  for (let i = 0; i < neuronCount; i++) {
    const t = i / neuronCount;
    const idx = Math.floor(t * (brainCurve.length - 1));
    const pos = brainCurve[idx].clone().multiplyScalar(coreRadius * 0.6);
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(neuronRadius, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0xffffe0,
        emissive: 0xffff80,
        emissiveIntensity: 0.0,
        metalness: 0.4,
        roughness: 0.2,
        transparent: false,
        opacity: 1.0
      })
    );
    mesh.position.copy(pos);
    mesh.renderOrder = 101;
    scene.add(mesh);
    neuronMeshes.push(mesh);
  }
  // Connect neurons with lines
  for (let i = 0; i < neuronCount - 1; i++) {
    const a = neuronMeshes[i].position.clone();
    const b = neuronMeshes[i + 1].position.clone();
    a.z += 0.15; b.z += 0.15;
    const geometry = new THREE.BufferGeometry().setFromPoints([a, b]);
    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: false, opacity: 1.0 }));
    line.renderOrder = 101;
    scene.add(line);
  }
  return { neuronMeshes };
}

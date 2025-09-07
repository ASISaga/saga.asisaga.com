import THREE from './three-minimal.js';

export function randomOnHorizontalRing(radius) {
  const theta = Math.random() * 2 * Math.PI;
  const ringBands = [
    { center: 0, thickness: 0.08 },
    { center: 0.15, thickness: 0.05 },
    { center: -0.15, thickness: 0.05 },
  ];
  const bandWeights = [0.7, 0.15, 0.15];
  let selectedBand = 0;
  const random = Math.random();
  let cumulative = 0;
  for (let i = 0; i < bandWeights.length; i++) {
    cumulative += bandWeights[i];
    if (random <= cumulative) {
      selectedBand = i;
      break;
    }
  }
  const band = ringBands[selectedBand];
  const bandLatRad = band.thickness * Math.PI / 8;
  const centerLatRad = band.center * Math.PI / 4;
  const lat = centerLatRad + (Math.random() - 0.5) * bandLatRad;
  const phi = Math.PI / 2 - lat;
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

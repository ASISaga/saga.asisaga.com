// thoughts.js - Thought balloon sprite setup and animation manager for ASI Saga
// Provides functions to create thought sprites and animate them, including neuron flashes

import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { randomOnHorizontalRing } from './utils.js';

export function setupThoughts(scene, coreRadius, thoughtCount = 20) {
  // Setup thought balloon emojis
  const thoughtSprites = [];
  const emoji = '💭';
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.font = '48px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.clearRect(0, 0, 64, 64);
  ctx.fillText(emoji, 32, 32);
  const texture = new THREE.CanvasTexture(canvas);
  for (let i = 0; i < thoughtCount; i++) {
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(0.22 + Math.random() * 0.08, 0.22 + Math.random() * 0.08, 1);
    sprite.material.opacity = 0.85 + Math.random() * 0.15;
    scene.add(sprite);
    thoughtSprites.push(sprite);
  }
  return { thoughtSprites };
}

export class ThoughtsManager {
  constructor(scene, coreRadius, thoughtSprites) {
    this.scene = scene;
    this.coreRadius = coreRadius;
    this.thoughtSprites = thoughtSprites;
    // Parse SVG for neuron elements (paths, circles, ellipses, etc. with id containing 'neuron')
    const svg = document.querySelector('svg');
    if (svg) {
      this.svgNeurons = Array.from(svg.querySelectorAll('[id*="neuron"]'));
    } else {
      this.svgNeurons = [];
    }
    this.thoughtCount = thoughtSprites.length;
    this.neuronFlashTimers = Array(this.svgNeurons.length).fill(0).map(() => Math.random() * 2.5);
    this.animationClock = new THREE.Clock();
    this.initParticles();
  }

  seedParticle(index, now) {
    const ringRadius = this.particleStartRadiusMin + Math.random() * (this.particleStartRadiusMax - this.particleStartRadiusMin);
    this.particleRingAngles[index] = Math.random() * 2 * Math.PI;
    this.particleRingRadii[index] = ringRadius;
    this.particleRingStartTime[index] = now;
    this.particleSpawnTime[index] = now;
    const sphereRadius = this.coreRadius * 1.1;
    const targetVector = randomOnHorizontalRing(sphereRadius);
    this.particleTargets[index * 3 + 0] = targetVector.x;
    this.particleTargets[index * 3 + 1] = targetVector.y;
    this.particleTargets[index * 3 + 2] = targetVector.z;
    const ringAngle = this.particleRingAngles[index];
    const ringY = targetVector.y * (ringRadius / sphereRadius);
    const ringX = ringRadius * Math.cos(ringAngle);
    const ringZ = ringRadius * Math.sin(ringAngle);
    this.particlePositions[index * 3 + 0] = ringX;
    this.particlePositions[index * 3 + 1] = ringY;
    this.particlePositions[index * 3 + 2] = ringZ;
    this.particleSpeeds[index] = (0.8 + Math.random() * 0.6) * 0.6;
    this.particleDelays[index] = Math.random() * 1.5;
    this.particleStates[index] = 2;
    this.particleDwellAt[index] = 0;
    if (now > this.particleDelays[index]) this.particleStates[index] = 3;
  }

  initParticles() {
    for (let index = 0; index < this.thoughtCount; index++) this.seedParticle(index, 0);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const elapsedTime = this.animationClock.getElapsedTime();
    // Animate SVG neuron flashes
    if (this.svgNeurons && this.svgNeurons.length) {
      for (let i = 0; i < this.svgNeurons.length; i++) {
        this.neuronFlashTimers[i] -= 0.016;
        if (this.neuronFlashTimers[i] <= 0) {
          const neuron = this.svgNeurons[i];
          neuron.style.transition = 'fill 0.2s, opacity 0.2s';
          neuron.style.fill = '#ffff00';
          neuron.style.opacity = '1';
          setTimeout(() => {
            neuron.style.fill = '';
            neuron.style.opacity = '';
          }, 200);
          this.neuronFlashTimers[i] = 0.15 + Math.random() * 2.5;
        }
      }
    }
    // Spiral/ring motion for thought bubbles, vanish at sphere, and always respawn
    for (let index = 0; index < this.thoughtCount; index++) {
      const sprite = this.thoughtSprites[index];
      if (!sprite.visible) {
        let attempts = 0;
        let onScreen = false;
        let thetaDeg, theta, phi, r, pos3D, pos2D;
        while (!onScreen && attempts < 10) {
          thetaDeg = Math.random() * 360;
          if ((thetaDeg >= 0 && thetaDeg <= 60) || (thetaDeg >= 120 && thetaDeg <= 240) || (thetaDeg >= 300 && thetaDeg <= 360)) {
            theta = THREE.MathUtils.degToRad(thetaDeg);
            phi = Math.acos(2 * Math.random() - 1);
            r = this.coreRadius * (2.2 + Math.random() * 0.5); // More spread from edge
            pos3D = new THREE.Vector3(
              r * Math.sin(phi) * Math.cos(theta),
              r * Math.sin(phi) * Math.sin(theta),
              r * Math.cos(phi)
            );
            // Project to screen space
            pos2D = pos3D.clone().project(this.camera);
            const xScreen = (pos2D.x * 0.5 + 0.5) * this.renderer.domElement.width;
            const yScreen = (1 - (pos2D.y * 0.5 + 0.5)) * this.renderer.domElement.height;
            if (xScreen >= 0 && xScreen <= this.renderer.domElement.width && yScreen >= 0 && yScreen <= this.renderer.domElement.height) {
              onScreen = true;
              sprite.position.copy(pos3D);
              sprite.userData.target = sprite.position.clone().normalize().multiplyScalar(this.coreRadius * 1.05);
              sprite.visible = true;
              this.particleStates[index] = 2;
              this.particleDelays[index] = elapsedTime + Math.random() * 1.5;
              this.particleRingStartTime[index] = elapsedTime;
            }
          }
          attempts++;
        }
        // If not found after attempts, fallback to original logic
        if (!onScreen) {
          theta = THREE.MathUtils.degToRad(thetaDeg);
          phi = Math.acos(2 * Math.random() - 1);
          r = this.coreRadius * (2.2 + Math.random() * 0.5);
          sprite.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
          );
          sprite.userData.target = sprite.position.clone().normalize().multiplyScalar(this.coreRadius * 1.05);
          sprite.visible = true;
          this.particleStates[index] = 2;
          this.particleDelays[index] = elapsedTime + Math.random() * 1.5;
          this.particleRingStartTime[index] = elapsedTime;
        }
      }
      let x, y, z;
      if (this.particleStates[index] === 2) {
        if (elapsedTime >= this.particleDelays[index]) this.particleStates[index] = 3;
      }
      if (this.particleStates[index] === 3) {
        const timeInRing = elapsedTime - this.particleRingStartTime[index];
        if (timeInRing < this.ringOrbitTime) {
          this.particleRingAngles[index] += this.ringOrbitSpeed * 0.016;
          const pulse = 0.08 * Math.sin(elapsedTime * 2.5 + index * 0.3);
          const currentRadius = this.particleRingRadii[index] * (1 + pulse * 0.03);
          const currentAngle = this.particleRingAngles[index];
          const targetY = this.particleTargets[index * 3 + 1];
          y = targetY * (currentRadius / (this.coreRadius * 1.1)) + pulse * this.ringThickness * 0.5;
          x = currentRadius * Math.cos(currentAngle);
          z = currentRadius * Math.sin(currentAngle);
          sprite.position.set(x, y, z);
          if (Math.sqrt(x*x + y*y + z*z) <= this.coreRadius * 1.05) sprite.visible = false;
          continue;
        } else {
          this.particleStates[index] = 0;
        }
      }
      if (this.particleStates[index] === 1) {
        if (elapsedTime - this.particleDwellAt[index] > this.particleDwellTime) {
          if (Math.random() < this.continuousSpawnRate) {
            this.seedParticle(index, elapsedTime);
          }
        } else {
          const targetX = this.particleTargets[index * 3 + 0], targetY = this.particleTargets[index * 3 + 1], targetZ = this.particleTargets[index * 3 + 2];
          const attachmentTime = elapsedTime - this.particleDwellAt[index];
          const settlePulse = Math.exp(-attachmentTime * 2) * 0.03;
          const magneticPulse = 1 + 0.015 * Math.sin(elapsedTime * 3.5 + index * 0.4);
          const microWobble = 0.002 * Math.sin(elapsedTime * 6 + index * 0.23);
          const finalScale = magneticPulse + microWobble + settlePulse;
          x = targetX * finalScale;
          y = targetY * finalScale;
          z = targetZ * finalScale;
          sprite.position.set(x, y, z);
          if (Math.sqrt(x*x + y*y + z*z) <= this.coreRadius * 1.05) sprite.visible = false;
        }
        continue;
      }
      // Spiral inward state
      const currentX = sprite.position.x;
      const currentY = sprite.position.y;
      const currentZ = sprite.position.z;
      const targetX = this.particleTargets[index * 3 + 0];
      const targetY = this.particleTargets[index * 3 + 1];
      const targetZ = this.particleTargets[index * 3 + 2];
      this.radialVector.set(targetX - currentX, targetY - currentY, targetZ - currentZ);
      const radialDistance = this.radialVector.length();
      if (radialDistance <= this.particleStickDistance || Math.sqrt(currentX*currentX + currentY*currentY + currentZ*currentZ) <= this.coreRadius * 1.05) {
        sprite.position.set(targetX, targetY, targetZ);
        sprite.visible = false;
        this.particleStates[index] = 1;
        this.particleDwellAt[index] = elapsedTime;
      }
      this.radialVector.normalize();
      this.tangentialVector.copy(this.upVector).cross(this.radialVector);
      if (this.tangentialVector.lengthSq() < 1e-6) {
        this.tangentialVector.set(1, 0, 0);
      }
      this.tangentialVector.normalize();
      const baseInwardStep = this.particleBaseInwardStep * this.particleSpeeds[index];
      const distanceEase = Math.min(1, radialDistance / 2.0);
      const inwardStep = Math.min(this.particleMaxStep, baseInwardStep * (0.4 + distanceEase * 0.6));
      const spiralIntensity = Math.max(0.4, distanceEase);
      const timeFactor = Math.sin(elapsedTime * 0.8 + index * 0.91) * 0.3 + 0.7;
      const spiralStep = inwardStep * this.particleSpiralFactor * spiralIntensity * timeFactor *
                        (0.85 + this.particleVariance * (Math.sin(elapsedTime * 1.4 + index * 0.67) * 0.4 + 0.6));
      const perpVector = new THREE.Vector3().crossVectors(this.radialVector, this.tangentialVector);
      const perpStep = spiralStep * 0.3 * Math.sin(elapsedTime * 2.1 + index * 0.45);
      const nextX = currentX + this.radialVector.x * inwardStep + this.tangentialVector.x * spiralStep + perpVector.x * perpStep;
      const nextY = currentY + this.radialVector.y * inwardStep + this.tangentialVector.y * spiralStep + perpVector.y * perpStep;
      const nextZ = currentZ + this.radialVector.z * inwardStep + this.tangentialVector.z * spiralStep + perpVector.z * perpStep;
      sprite.position.set(nextX, nextY, nextZ);
      if (Math.sqrt(nextX*nextX + nextY*nextY + nextZ*nextZ) <= this.coreRadius * 1.05) sprite.visible = false;
    }
    // Render
    this.renderer.render(this.scene, this.camera);
  }

  setRenderer(renderer) {
    this.renderer = renderer;
  }

  setCamera(camera) {
    this.camera = camera;
  }
}

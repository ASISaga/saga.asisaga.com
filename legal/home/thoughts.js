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
    this.thoughtCount = (thoughtSprites && thoughtSprites.length) ? thoughtSprites.length : 0;
  // Defensive: always initialize thought arrays even if thoughtCount is 0
  this.thoughtStartRadiusMin = 3.0;
  this.thoughtStartRadiusMax = 7.0;
  this.thoughtStickDistance = 0.02;
  this.thoughtDwellTime = 0.8;
  this.thoughtSpiralFactor = 0.85;
  this.thoughtBaseInwardStep = 0.018;
  this.thoughtMaxStep = 0.08;
  this.thoughtVariance = 1.2;
  this.ringOrbitTime = 0.5;
  this.ringOrbitSpeed = 1.2;
  this.ringThickness = 0.2;
  this.continuousSpawnRate = 0.98;
  this.thoughtPositions = new Float32Array(this.thoughtCount * 3);
  this.thoughtTargets = new Float32Array(this.thoughtCount * 3);
  this.thoughtSpeeds = new Float32Array(this.thoughtCount);
  this.thoughtDelays = new Float32Array(this.thoughtCount);
  this.thoughtStates = new Uint8Array(this.thoughtCount);
  this.thoughtDwellAt = new Float32Array(this.thoughtCount);
  this.thoughtRingAngles = new Float32Array(this.thoughtCount);
  this.thoughtRingRadii = new Float32Array(this.thoughtCount);
  this.thoughtRingStartTime = new Float32Array(this.thoughtCount);
  this.thoughtSpawnTime = new Float32Array(this.thoughtCount);
  this.radialVector = new THREE.Vector3();
  this.tangentialVector = new THREE.Vector3();
  this.upVector = new THREE.Vector3(0, 1, 0);
    this.neuronFlashTimers = Array(this.svgNeurons.length).fill(0).map(() => Math.random() * 2.5);
    this.animationClock = new THREE.Clock();
    this.initthoughts();
  }

  seedthought(index, now) {
    const ringRadius = this.thoughtStartRadiusMin + Math.random() * (this.thoughtStartRadiusMax - this.thoughtStartRadiusMin);
    this.thoughtRingAngles[index] = Math.random() * 2 * Math.PI;
    this.thoughtRingRadii[index] = ringRadius;
    this.thoughtRingStartTime[index] = now;
    this.thoughtSpawnTime[index] = now;
    const sphereRadius = this.coreRadius * 1.1;
    const targetVector = randomOnHorizontalRing(sphereRadius);
    this.thoughtTargets[index * 3 + 0] = targetVector.x;
    this.thoughtTargets[index * 3 + 1] = targetVector.y;
    this.thoughtTargets[index * 3 + 2] = targetVector.z;
    const ringAngle = this.thoughtRingAngles[index];
    const ringY = targetVector.y * (ringRadius / sphereRadius);
    const ringX = ringRadius * Math.cos(ringAngle);
    const ringZ = ringRadius * Math.sin(ringAngle);
    this.thoughtPositions[index * 3 + 0] = ringX;
    this.thoughtPositions[index * 3 + 1] = ringY;
    this.thoughtPositions[index * 3 + 2] = ringZ;
    this.thoughtSpeeds[index] = (0.8 + Math.random() * 0.6) * 0.6;
    this.thoughtDelays[index] = Math.random() * 1.5;
    this.thoughtStates[index] = 2;
    this.thoughtDwellAt[index] = 0;
    if (now > this.thoughtDelays[index]) this.thoughtStates[index] = 3;
  }

  initthoughts() {
    for (let index = 0; index < this.thoughtCount; index++) this.seedthought(index, 0);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const elapsedTime = this.animationClock.getElapsedTime();
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
              this.thoughtStates[index] = 2;
              this.thoughtDelays[index] = elapsedTime + Math.random() * 1.5;
              this.thoughtRingStartTime[index] = elapsedTime;
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
          this.thoughtStates[index] = 2;
          this.thoughtDelays[index] = elapsedTime + Math.random() * 1.5;
          this.thoughtRingStartTime[index] = elapsedTime;
        }
      }
      let x, y, z;
      if (this.thoughtStates[index] === 2) {
        if (elapsedTime >= this.thoughtDelays[index]) this.thoughtStates[index] = 3;
      }
      if (this.thoughtStates[index] === 3) {
        const timeInRing = elapsedTime - this.thoughtRingStartTime[index];
        if (timeInRing < this.ringOrbitTime) {
          this.thoughtRingAngles[index] += this.ringOrbitSpeed * 0.016;
          const pulse = 0.08 * Math.sin(elapsedTime * 2.5 + index * 0.3);
          const currentRadius = this.thoughtRingRadii[index] * (1 + pulse * 0.03);
          const currentAngle = this.thoughtRingAngles[index];
          const targetY = this.thoughtTargets[index * 3 + 1];
          y = targetY * (currentRadius / (this.coreRadius * 1.1)) + pulse * this.ringThickness * 0.5;
          x = currentRadius * Math.cos(currentAngle);
          z = currentRadius * Math.sin(currentAngle);
          sprite.position.set(x, y, z);
          if (Math.sqrt(x*x + y*y + z*z) <= this.coreRadius * 1.05) sprite.visible = false;
          continue;
        } else {
          this.thoughtStates[index] = 0;
        }
      }
      if (this.thoughtStates[index] === 1) {
        if (elapsedTime - this.thoughtDwellAt[index] > this.thoughtDwellTime) {
          if (Math.random() < this.continuousSpawnRate) {
            this.seedthought(index, elapsedTime);
          }
        } else {
          const targetX = this.thoughtTargets[index * 3 + 0], targetY = this.thoughtTargets[index * 3 + 1], targetZ = this.thoughtTargets[index * 3 + 2];
          const attachmentTime = elapsedTime - this.thoughtDwellAt[index];
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
      const targetX = this.thoughtTargets[index * 3 + 0];
      const targetY = this.thoughtTargets[index * 3 + 1];
      const targetZ = this.thoughtTargets[index * 3 + 2];
      this.radialVector.set(targetX - currentX, targetY - currentY, targetZ - currentZ);
      const radialDistance = this.radialVector.length();
      if (radialDistance <= this.thoughtStickDistance || Math.sqrt(currentX*currentX + currentY*currentY + currentZ*currentZ) <= this.coreRadius * 1.05) {
        sprite.position.set(targetX, targetY, targetZ);
        sprite.visible = false;
        this.thoughtStates[index] = 1;
        this.thoughtDwellAt[index] = elapsedTime;
      }
      this.radialVector.normalize();
      this.tangentialVector.copy(this.upVector).cross(this.radialVector);
      if (this.tangentialVector.lengthSq() < 1e-6) {
        this.tangentialVector.set(1, 0, 0);
      }
      this.tangentialVector.normalize();
      const baseInwardStep = this.thoughtBaseInwardStep * this.thoughtSpeeds[index];
      const distanceEase = Math.min(1, radialDistance / 2.0);
      const inwardStep = Math.min(this.thoughtMaxStep, baseInwardStep * (0.4 + distanceEase * 0.6));
      const spiralIntensity = Math.max(0.4, distanceEase);
      const timeFactor = Math.sin(elapsedTime * 0.8 + index * 0.91) * 0.3 + 0.7;
      const spiralStep = inwardStep * this.thoughtSpiralFactor * spiralIntensity * timeFactor *
                        (0.85 + this.thoughtVariance * (Math.sin(elapsedTime * 1.4 + index * 0.67) * 0.4 + 0.6));
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

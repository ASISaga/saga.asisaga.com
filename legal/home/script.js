import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

// =============================
// Home Page 3D Animation - Updated for Continuous Horizontal Ring Spiral
// =============================
// Enhanced to create continuous particle flow from horizontal rings to core
// Particles originate from distinct horizontal rings and spiral inward like puzzle pieces
class Home3DAnimation {
  constructor() {
    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.setupLighting();
    this.setupCore();
    this.setupBrain(); // <-- Added
    this.setupParticleParams();
    this.setupBuffers();
    this.setupHelpers();
    this.setupGeometry();
    this.setupClock();
    this.initParticles();
    this.bindEvents();
    this.animate();
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x05060a, 0.02);
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 200);
    this.camera.position.set(0, 0, 7.5);
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setSize(innerWidth, innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  setupLighting() {
    this.scene.add(new THREE.AmbientLight(0x6ea9ff, 0.38));
    const dir = new THREE.DirectionalLight(0x9ee8ff, 0.85);
    dir.position.set(2.2, 2.8, 2.6);
    this.scene.add(dir);
  }

  // Core sphere setup
  setupCore() {
    this.coreRadius = 1.08;
    const coreGeometry = new THREE.SphereGeometry(this.coreRadius * 0.96, 48, 48);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.2,
      roughness: 0.05,
      transmission: 1.0,
      thickness: 1.0,
      ior: 1.45,
      transparent: true,
      opacity: 0.12, // clear glass
      clearcoat: 1.0,
      clearcoatRoughness: 0.01,
      reflectivity: 0.7,
      emissive: 0x89e4ff,
      emissiveIntensity: 0.08
    });
    this.coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    this.coreMesh.renderOrder = 1;
    this.scene.add(this.coreMesh);
  }

  // Brain setup: neurons and lines inside core sphere
  setupBrain() {
    // Stylized brain outline (simple closed curve)
    const brainCurve = [
      new THREE.Vector3(0.3, 0.2, 0.0),
      new THREE.Vector3(0.5, 0.5, 0.1),
      new THREE.Vector3(0.2, 0.7, 0.2),
      new THREE.Vector3(-0.2, 0.7, 0.1),
      new THREE.Vector3(-0.5, 0.5, 0.0),
      new THREE.Vector3(-0.3, 0.2, -0.1),
      new THREE.Vector3(-0.2, -0.2, -0.2),
      new THREE.Vector3(0.2, -0.2, -0.1),
      new THREE.Vector3(0.3, 0.2, 0.0)
    ];
    // Offset curve slightly in Z to avoid occlusion
    for (let v of brainCurve) v.z += 0.15;
    const brainGeometry = new THREE.BufferGeometry().setFromPoints(brainCurve.map(v => v.clone().multiplyScalar(this.coreRadius * 0.6)));
    const brainLine = new THREE.Line(brainGeometry, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: false, opacity: 1.0 }));
    brainLine.renderOrder = 100;
    this.scene.add(brainLine);

    // Neuron positions (on curve)
    this.neuronCount = 12;
    this.neuronRadius = 0.11;
    this.neuronMeshes = [];
    this.neuronFlashTimers = [];
    for (let i = 0; i < this.neuronCount; i++) {
      const t = i / this.neuronCount;
      const idx = Math.floor(t * (brainCurve.length - 1));
      const pos = brainCurve[idx].clone().multiplyScalar(this.coreRadius * 0.6);
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(this.neuronRadius, 16, 16),
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
      this.scene.add(mesh);
      this.neuronMeshes.push(mesh);
      this.neuronFlashTimers.push(Math.random() * 2.5);
    }
    // Connect neurons with lines
    for (let i = 0; i < this.neuronCount - 1; i++) {
      const a = this.neuronMeshes[i].position.clone();
      const b = this.neuronMeshes[i + 1].position.clone();
      a.z += 0.15; b.z += 0.15;
      const geometry = new THREE.BufferGeometry().setFromPoints([a, b]);
      const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: false, opacity: 1.0 }));
      line.renderOrder = 101;
      this.scene.add(line);
    }
  }

  setupParticleParams() {
  this.particleCount = 200;
    this.particleStartRadiusMin = 3.0;
    this.particleStartRadiusMax = 7.0;
    this.particleStickDistance = 0.02;
    this.particleDwellTime = 0.8; // Reduced dwell time for more continuous flow
    this.particleSpiralFactor = 0.85; // Increased spiral intensity
    this.particleBaseInwardStep = 0.018; // Slightly faster inward motion
    this.particleMaxStep = 0.08; // Increased max step
    this.particleVariance = 1.2; // More variation for organic feel
    // Enhanced horizontal ring parameters for immediate spiral effect
    this.ringOrbitTime = 0.5; // Much shorter orbit time for more immediate spiraling
    this.ringOrbitSpeed = 1.2; // Faster ring motion
    this.ringThickness = 0.2; // Thinner, more defined ring
    this.continuousSpawnRate = 0.98; // Probability of continuous spawning
  }

  setupBuffers() {
    this.particlePositions = new Float32Array(this.particleCount * 3);
    this.particleTargets = new Float32Array(this.particleCount * 3);
    this.particleSpeeds = new Float32Array(this.particleCount);
    this.particleDelays = new Float32Array(this.particleCount);
    this.particleStates = new Uint8Array(this.particleCount);
    this.particleDwellAt = new Float32Array(this.particleCount);
    // Enhanced state tracking for continuous horizontal ring effect
    this.particleRingAngles = new Float32Array(this.particleCount); // Current angle in ring orbit
    this.particleRingRadii = new Float32Array(this.particleCount); // Current radius in ring
    this.particleRingStartTime = new Float32Array(this.particleCount); // When particle started ring orbit
    this.particleSpawnTime = new Float32Array(this.particleCount); // For continuous spawning
  }

  setupHelpers() {
    this.radialVector = new THREE.Vector3();
    this.tangentialVector = new THREE.Vector3();
    this.upVector = new THREE.Vector3(0, 1, 0);
  }

  setupGeometry() {
    // Replace particles with thought balloon emojis
    this.thoughtSprites = [];
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
    for (let i = 0; i < this.particleCount; i++) {
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(0.22, 0.22, 1);
      this.scene.add(sprite);
      this.thoughtSprites.push(sprite);
    }
  }

  setupClock() {
    this.animationClock = new THREE.Clock();
  }

  bindEvents() {
    addEventListener('resize', () => this.handleResize(), { passive: true });
  }

  // Generate a random point on a horizontal ring system
  // Enhanced to create more defined horizontal ring formations
  randomOnHorizontalRing(radius) {
    const theta = Math.random() * 2 * Math.PI; // longitude around ring
    
    // Create distinct horizontal ring bands for better visual definition
    const ringBands = [
      { center: 0, thickness: 0.08 }, // Primary horizontal ring (equator)
      { center: 0.15, thickness: 0.05 }, // Upper ring
      { center: -0.15, thickness: 0.05 }, // Lower ring
    ];
    
    // Randomly select a ring band with preference for main ring
    const bandWeights = [0.7, 0.15, 0.15]; // 70% main ring, 15% each for others
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
    
    // Generate latitude within the selected horizontal band (tighter rings)
    const bandLatRad = band.thickness * Math.PI / 8; // Even narrower rings
    const centerLatRad = band.center * Math.PI / 4;
    const lat = centerLatRad + (Math.random() - 0.5) * bandLatRad;
    
    // Convert to spherical coordinates
    const phi = Math.PI / 2 - lat; // Convert latitude to phi (polar angle)
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
  }

  // Seed a particle with a new target and initial position
  seedParticle(index, now) {
    // Horizontal ring: Start particles in ring orbit, then continuously spiral to surface
    const ringRadius = this.particleStartRadiusMin + Math.random() * (this.particleStartRadiusMax - this.particleStartRadiusMin);
    
    // Initialize ring orbit parameters
    this.particleRingAngles[index] = Math.random() * 2 * Math.PI;
    this.particleRingRadii[index] = ringRadius;
    this.particleRingStartTime[index] = now;
    this.particleSpawnTime[index] = now;
    
    // Generate target on sphere surface using enhanced horizontal ring
    const sphereRadius = this.coreRadius * 1.1; // Closer to core for better puzzle effect
    const targetVector = this.randomOnHorizontalRing(sphereRadius);
    this.particleTargets[index * 3 + 0] = targetVector.x;
    this.particleTargets[index * 3 + 1] = targetVector.y;
    this.particleTargets[index * 3 + 2] = targetVector.z;

    // Start position: in horizontal ring orbit
    const ringAngle = this.particleRingAngles[index];
    const ringY = targetVector.y * (ringRadius / sphereRadius); // Maintain same relative Y position
    const ringX = ringRadius * Math.cos(ringAngle);
    const ringZ = ringRadius * Math.sin(ringAngle);
    
    this.particlePositions[index * 3 + 0] = ringX;
    this.particlePositions[index * 3 + 1] = ringY;
    this.particlePositions[index * 3 + 2] = ringZ;

    this.particleSpeeds[index] = (0.8 + Math.random() * 0.6) * 0.6; // More varied speeds
    this.particleDelays[index] = Math.random() * 1.5; // Shorter delays for continuous feel
    this.particleStates[index] = 2; // 0=spiraling, 1=attached, 2=delayed, 3=ring_orbit
    this.particleDwellAt[index] = 0;
    if (now > this.particleDelays[index]) this.particleStates[index] = 3; // Start in ring orbit
  }

  // Initialize all particles
  initParticles() {
    for (let index = 0; index < this.particleCount; index++) this.seedParticle(index, 0);
  }

  // Animation loop
  animate() {
    requestAnimationFrame(() => this.animate());
    const elapsedTime = this.animationClock.getElapsedTime();
    // Core breathing effect
    const coreBreathScale = 1 + Math.sin(elapsedTime * 1.6) * 0.025;
    this.coreMesh.scale.setScalar(coreBreathScale);
    // Animate neuron flashes
    if (this.neuronMeshes) {
      for (let i = 0; i < this.neuronMeshes.length; i++) {
        this.neuronFlashTimers[i] -= 0.016;
        if (this.neuronFlashTimers[i] <= 0) {
          this.neuronMeshes[i].material.emissiveIntensity = 3.5;
          this.neuronMeshes[i].material.color.set(0xffff80);
          this.neuronFlashTimers[i] = 0.15 + Math.random() * 2.5;
        } else if (this.neuronMeshes[i].material.emissiveIntensity > 0.1) {
          this.neuronMeshes[i].material.emissiveIntensity *= 0.5;
          this.neuronMeshes[i].material.color.lerp(new THREE.Color(0xffffe0), 0.5);
        } else {
          this.neuronMeshes[i].material.emissiveIntensity = 0.0;
          this.neuronMeshes[i].material.color.set(0xffffe0);
        }
      }
    }
    // Spiral/ring motion for thought bubbles, vanish at sphere, and always respawn
    for (let index = 0; index < this.particleCount; index++) {
      const sprite = this.thoughtSprites[index];
      // If vanished, respawn immediately 
      if (!sprite.visible) {
        // Restrict spawn angles to 0-60, 120-240, and 300-360 degrees
        let thetaDeg, theta;
        while (true) {
          thetaDeg = Math.random() * 360;
          if ((thetaDeg >= 0 && thetaDeg <= 60) || (thetaDeg >= 120 && thetaDeg <= 240) || (thetaDeg >= 300 && thetaDeg <= 360)) {
            break;
          }
        }
        theta = THREE.MathUtils.degToRad(thetaDeg);
        const phi = Math.acos(2 * Math.random() - 1);
        const r = this.coreRadius * 2.2;
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
      // Use spiral/ring logic to position sprites
      let x, y, z;
      if (this.particleStates[index] === 2) {
        if (elapsedTime >= this.particleDelays[index]) this.particleStates[index] = 3;
        // Do NOT continue; let the new thought animate immediately
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
        // Do NOT continue; let the new thought animate immediately
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
      // Do NOT continue; let the new thought animate immediately
    }

    this.renderer.render(this.scene, this.camera);
  }

  // Handle window resize
  handleResize() {
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(innerWidth, innerHeight);
  }
}

// Instantiate and run the animation
document.addEventListener('DOMContentLoaded', () => {
  new Home3DAnimation();
});

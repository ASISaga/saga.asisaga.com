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
      color: 0x1a2440,
      metalness: 0.7,
      roughness: 0.05,
      transmission: 0.92, // glass effect
      thickness: 0.6,
      ior: 1.5,
      transparent: true,
      opacity: 0.7,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 0.8,
      emissive: 0x89e4ff,
      emissiveIntensity: 0.18
    });
    this.coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    this.scene.add(this.coreMesh);
  }

  // Brain setup: neurons and lines inside core sphere
  setupBrain() {
    this.neuronCount = 18;
    this.neuronRadius = 0.08;
    this.brainRadius = this.coreRadius * 0.55;
    this.neurons = [];
    this.neuronMeshes = [];
    this.neuronLines = [];
    const neuronMaterial = new THREE.MeshStandardMaterial({
      color: 0xfff8a0,
      emissive: 0xffcc00,
      emissiveIntensity: 0.7,
      metalness: 0.2,
      roughness: 0.5,
      transparent: true,
      opacity: 0.95
    });
    // Randomly distribute neurons inside a sphere
    for (let i = 0; i < this.neuronCount; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * 2 * Math.PI;
      const r = this.brainRadius * (0.7 + 0.3 * Math.random());
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      this.neurons.push(new THREE.Vector3(x, y, z));
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(this.neuronRadius, 16, 16),
        neuronMaterial.clone()
      );
      mesh.position.set(x, y, z);
      this.scene.add(mesh);
      this.neuronMeshes.push(mesh);
    }
    // Connect some neurons with lines
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x8888ff, transparent: true, opacity: 0.5 });
    for (let i = 0; i < this.neuronCount; i++) {
      for (let j = i + 1; j < this.neuronCount; j++) {
        if (Math.random() < 0.22) { // sparse connections
          const geometry = new THREE.BufferGeometry().setFromPoints([
            this.neurons[i], this.neurons[j]
          ]);
          const line = new THREE.Line(geometry, lineMaterial);
          this.scene.add(line);
          this.neuronLines.push(line);
        }
      }
    }
  }

  setupParticleParams() {
    this.particleCount = 2000;
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
    this.particleGeometry = new THREE.BufferGeometry();
    this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    
    // Enhanced particle material for more puzzle-piece-like appearance
    this.particleMaterial = new THREE.PointsMaterial({
      color: 0x8fd3ff,
      size: 0.09, // Slightly larger for better visibility of puzzle pieces
      transparent: true,
      opacity: 0.9, // More opaque for better definition
      depthWrite: false,
      blending: THREE.AdditiveBlending, // Add glowing effect
      sizeAttenuation: true // Size varies with distance
    });
    
    this.particlePoints = new THREE.Points(this.particleGeometry, this.particleMaterial);
    this.scene.add(this.particlePoints);
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
    const positionAttribute = this.particleGeometry.attributes.position;

    // Core breathing effect
    const coreBreathScale = 1 + Math.sin(elapsedTime * 1.6) * 0.025;
    this.coreMesh.scale.setScalar(coreBreathScale);

    // Animate neuron glow
    if (this.neuronMeshes) {
      for (let i = 0; i < this.neuronMeshes.length; i++) {
        const mesh = this.neuronMeshes[i];
        const phase = elapsedTime * 2 + i * 0.5;
        const glow = 0.7 + 0.5 * Math.sin(phase);
        mesh.material.emissiveIntensity = glow;
        mesh.scale.setScalar(1 + 0.18 * Math.sin(phase));
      }
    }

    // Slight scene drift for life
    this.scene.rotation.y += 0.0008;

    // Update particles
    for (let index = 0; index < this.particleCount; index++) {
      const particleIdx = index * 3;

      // Manage Delay
      if (this.particleStates[index] === 2) {
        if (elapsedTime >= this.particleDelays[index]) this.particleStates[index] = 3; // Start in ring orbit
        else continue;
      }

      // Ring Orbit State - Horizontal ring orbital motion
      if (this.particleStates[index] === 3) {
        const timeInRing = elapsedTime - this.particleRingStartTime[index];
        
        // Shorter orbit time for more immediate spiraling
        if (timeInRing < this.ringOrbitTime) {
          // Update orbital angle with more dynamic motion
          this.particleRingAngles[index] += this.ringOrbitSpeed * 0.016; // Assuming ~60fps
          
          // Calculate ring position with gentle pulsing for organic feel
          const pulse = 0.08 * Math.sin(elapsedTime * 2.5 + index * 0.3);
          const currentRadius = this.particleRingRadii[index] * (1 + pulse * 0.03);
          const currentAngle = this.particleRingAngles[index];
          
          // Maintain horizontal ring structure with slight variation
          const targetY = this.particleTargets[particleIdx + 1];
          const ringY = targetY * (currentRadius / (this.coreRadius * 1.1)) + pulse * this.ringThickness * 0.5;
          
          const ringX = currentRadius * Math.cos(currentAngle);
          const ringZ = currentRadius * Math.sin(currentAngle);
          
          positionAttribute.setXYZ(index, ringX, ringY, ringZ);
          continue;
        } else {
          // Immediate transition to spiraling inward
          this.particleStates[index] = 0;
        }
      }

      // If Attached, Check Dwell Time then Respawn for Continuous Flow
      if (this.particleStates[index] === 1) {
        if (elapsedTime - this.particleDwellAt[index] > this.particleDwellTime) {
          // Continuous respawn with staggered timing
          if (Math.random() < this.continuousSpawnRate) {
            this.seedParticle(index, elapsedTime);
          }
        } else {
          const targetX = this.particleTargets[particleIdx + 0], targetY = this.particleTargets[particleIdx + 1], targetZ = this.particleTargets[particleIdx + 2];
          // Enhanced puzzle-piece attachment with subtle pulsing and magnetic attraction
          const attachmentTime = elapsedTime - this.particleDwellAt[index];
          const settlePulse = Math.exp(-attachmentTime * 2) * 0.03; // Settle into place
          const magneticPulse = 1 + 0.015 * Math.sin(elapsedTime * 3.5 + index * 0.4);
          const microWobble = 0.002 * Math.sin(elapsedTime * 6 + index * 0.23);
          const finalScale = magneticPulse + microWobble + settlePulse;
          positionAttribute.setXYZ(index, targetX * finalScale, targetY * finalScale, targetZ * finalScale);
        }
        continue;
      }

      // Current and Final Positions (Spiral Inward State)
      const currentX = positionAttribute.getX(index);
      const currentY = positionAttribute.getY(index);
      const currentZ = positionAttribute.getZ(index);
      const targetX = this.particleTargets[particleIdx + 0];
      const targetY = this.particleTargets[particleIdx + 1];
      const targetZ = this.particleTargets[particleIdx + 2];

      // Radial Direction (toward target)
      this.radialVector.set(targetX - currentX, targetY - currentY, targetZ - currentZ);
      const radialDistance = this.radialVector.length();

      // Stick to Core if Close Enough (Puzzle piece attachment)
      if (radialDistance <= this.particleStickDistance) {
        positionAttribute.setXYZ(index, targetX, targetY, targetZ);
        this.particleStates[index] = 1;
        this.particleDwellAt[index] = elapsedTime;
        continue;
      }

      this.radialVector.normalize();

      // Enhanced Tangential Direction for pronounced continuous spiral from horizontal ring
      this.tangentialVector.copy(this.upVector).cross(this.radialVector);
      if (this.tangentialVector.lengthSq() < 1e-6) {
        this.tangentialVector.set(1, 0, 0);
      }
      this.tangentialVector.normalize();

      // Enhanced Speed Profile for smoother, more continuous spiral motion
      const baseInwardStep = this.particleBaseInwardStep * this.particleSpeeds[index];
      const distanceEase = Math.min(1, radialDistance / 2.0); // Gradual easing
      const inwardStep = Math.min(this.particleMaxStep, baseInwardStep * (0.4 + distanceEase * 0.6));
      
      // Enhanced spiral motion that creates continuous flowing pattern
      const spiralIntensity = Math.max(0.4, distanceEase); // Maintain strong spiral throughout
      const timeFactor = Math.sin(elapsedTime * 0.8 + index * 0.91) * 0.3 + 0.7; // Temporal variation
      const spiralStep = inwardStep * this.particleSpiralFactor * spiralIntensity * timeFactor *
                        (0.85 + this.particleVariance * (Math.sin(elapsedTime * 1.4 + index * 0.67) * 0.4 + 0.6));

      // Additional perpendicular motion for more complex spiral pattern
      const perpVector = new THREE.Vector3().crossVectors(this.radialVector, this.tangentialVector);
      const perpStep = spiralStep * 0.3 * Math.sin(elapsedTime * 2.1 + index * 0.45);

      // Update Position with enhanced 3D spiral motion
      const nextX = currentX + this.radialVector.x * inwardStep + this.tangentialVector.x * spiralStep + perpVector.x * perpStep;
      const nextY = currentY + this.radialVector.y * inwardStep + this.tangentialVector.y * spiralStep + perpVector.y * perpStep;
      const nextZ = currentZ + this.radialVector.z * inwardStep + this.tangentialVector.z * spiralStep + perpVector.z * perpStep;

      positionAttribute.setXYZ(index, nextX, nextY, nextZ);
    }

    positionAttribute.needsUpdate = true;
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


import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';

// =============================
// Home Page 3D Animation
// =============================
// Refactored as a class for modularity and maintainability
class Home3DAnimation {
  constructor() {
  this.setupScene();
  this.setupCamera();
  this.setupRenderer();
  this.setupLighting();
  this.setupCore();
  this.setupParticleParams();
  this.setupBuffers();
  this.setupHelpers();
  this.setupGeometry();
  this.setupClock();
  this.initParticles();
  this.bindEvents();
  this.animate();

  // Pulsating effect properties
  this.baseRadius = 50; // Adjust as needed
  this.pulseAmplitude = 10; // How much the radius changes
  this.pulseSpeed = 2; // Pulses per second
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

  setupCore() {
    this.coreRadius = 1.08;
    const coreGeometry = new THREE.SphereGeometry(this.coreRadius * 0.96, 48, 48);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a2440,
      emissive: 0x89e4ff,
      emissiveIntensity: 0.25,
      metalness: 0.3, // Slightly more metallic for puzzle-piece effect
      roughness: 0.8, // Slightly smoother
      transparent: true,
      opacity: 0.95
    });
    this.coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    this.scene.add(this.coreMesh);
  }

  setupParticleParams() {
  // Number of particles in the system (higher for denser effect)
  this.particleCount = 2000;

  // Minimum and maximum radius for initial particle ring orbit (distance from core)
  this.particleStartRadiusMin = 3.0; // Closest ring band to core
  this.particleStartRadiusMax = 7.0; // Farthest ring band from core

  // Distance threshold for a particle to "stick" to the core (puzzle piece attachment)
  this.particleStickDistance = 0.02;

  // Time (in seconds) a particle remains attached to the core before respawning
  this.particleDwellTime = 1.6;

  // Spiral factor controls how much tangential (spiral) motion particles have as they move inward
  this.particleSpiralFactor = 0.65;

  // Base step size for inward movement per frame (controls speed toward core)
  this.particleBaseInwardStep = 0.015;

  // Maximum allowed step size per frame (prevents particles from jumping too far)
  this.particleMaxStep = 0.06;

  // Variance factor for spiral motion (adds randomness and organic feel)
  this.particleVariance = 0.8;

  // =============================
  // Jupiter Ring Effect Parameters
  // =============================

  // Time (in seconds) particles spend orbiting in the ring before spiraling inward
  this.ringOrbitTime = 3.0;

  // Speed of orbital motion in the ring (radians per second)
  this.ringOrbitSpeed = 0.8;

  // Thickness of the Jupiter ring (vertical spread of ring particles)
  this.ringThickness = 0.3;
  }

  setupBuffers() {
    this.particlePositions = new Float32Array(this.particleCount * 3);
    this.particleTargets = new Float32Array(this.particleCount * 3);
    this.particleSpeeds = new Float32Array(this.particleCount);
    this.particleDelays = new Float32Array(this.particleCount);
    this.particleStates = new Uint8Array(this.particleCount);
    this.particleDwellAt = new Float32Array(this.particleCount);
    // Enhanced state tracking for Jupiter ring effect
    this.particleRingAngles = new Float32Array(this.particleCount); // Current angle in ring orbit
    this.particleRingRadii = new Float32Array(this.particleCount); // Current radius in ring
    this.particleRingStartTime = new Float32Array(this.particleCount); // When particle started ring orbit
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
      size: 0.08, // Slightly larger for better visibility
      transparent: true,
      opacity: 0.85,
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

  // Generate a random point in a thick equatorial band (Jupiter-like)
  // Enhanced to create more pronounced ring formation
  randomOnJupiterBand(radius) {
    const theta = Math.random() * 2 * Math.PI; // longitude
    
    // Create a more pronounced ring by concentrating particles in narrower bands
    // Use multiple ring bands like Jupiter's actual ring system
    const ringBands = [
      { center: 0, thickness: 0.15 }, // Main ring
      { center: 0.2, thickness: 0.08 }, // Secondary ring
      { center: -0.2, thickness: 0.08 }, // Secondary ring
    ];
    
    // Randomly select a ring band
    const band = ringBands[Math.floor(Math.random() * ringBands.length)];
    
    // Generate latitude within the selected band
    const bandLatRad = band.thickness * Math.PI / 6; // Convert to radians (narrower rings)
    const centerLatRad = band.center * Math.PI / 6;
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
    // Jupiter ring: Start particles in ring orbit, then spiral to surface
    const ringRadius = this.particleStartRadiusMin + Math.random() * (this.particleStartRadiusMax - this.particleStartRadiusMin);
    
    // Initialize ring orbit parameters
    this.particleRingAngles[index] = Math.random() * 2 * Math.PI;
    this.particleRingRadii[index] = ringRadius;
    this.particleRingStartTime[index] = now;
    
    // Generate target on sphere surface using enhanced Jupiter band
    const sphereRadius = this.coreRadius * 1.2;
    const targetVector = this.randomOnJupiterBand(sphereRadius);
    this.particleTargets[index * 3 + 0] = targetVector.x;
    this.particleTargets[index * 3 + 1] = targetVector.y;
    this.particleTargets[index * 3 + 2] = targetVector.z;

  // Start position: in horizontal ring orbit (XZ plane, y=0)
  const ringAngle = this.particleRingAngles[index];
  const ringY = 0; // Horizontal ring at equator
  const ringX = ringRadius * Math.cos(ringAngle);
  const ringZ = ringRadius * Math.sin(ringAngle);

  this.particlePositions[index * 3 + 0] = ringX;
  this.particlePositions[index * 3 + 1] = ringY;
  this.particlePositions[index * 3 + 2] = ringZ;

    this.particleSpeeds[index] = (0.75 + Math.random() * 0.75) * 0.5;
    this.particleDelays[index] = Math.random() * 2.2;
    this.particleStates[index] = 2; // 0=moving, 1=stuck, 2=delayed, 3=ring_orbit
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

  // Sphere pulsating effect
  let time = elapsedTime;
  let pulsatingRadius = this.baseRadius + Math.sin(time * this.pulseSpeed) * this.pulseAmplitude;
  this.coreMesh.geometry.dispose();
  this.coreMesh.geometry = new THREE.SphereGeometry(pulsatingRadius, 48, 48);

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

      // Ring Orbit State - NEW: Jupiter-like ring orbital motion
      if (this.particleStates[index] === 3) {
        const timeInRing = elapsedTime - this.particleRingStartTime[index];
        
        // Orbit in ring for specified time before spiraling inward
        if (timeInRing < this.ringOrbitTime) {
          // Update orbital angle
          this.particleRingAngles[index] += this.ringOrbitSpeed * 0.016; // Assuming ~60fps
          
          // Calculate ring position with slight wobble to simulate ring particles
          const wobble = 0.1 * Math.sin(elapsedTime * 3 + index * 0.5);
          const currentRadius = this.particleRingRadii[index] * (1 + wobble * 0.05);
          const currentAngle = this.particleRingAngles[index];
          
          // Maintain same Y level (equatorial plane) with slight variation
          const targetY = this.particleTargets[particleIdx + 1];
          const ringY = targetY * (currentRadius / (this.coreRadius * 1.2)) + wobble * this.ringThickness;
          
          const ringX = currentRadius * Math.cos(currentAngle);
          const ringZ = currentRadius * Math.sin(currentAngle);
          
          positionAttribute.setXYZ(index, ringX, ringY, ringZ);
          continue;
        } else {
          // Transition from ring orbit to spiral inward
          this.particleStates[index] = 0;
        }
      }

      // If Stuck, Check Dwell Time then Respawn
      if (this.particleStates[index] === 1) {
        if (elapsedTime - this.particleDwellAt[index] > this.particleDwellTime) {
          this.seedParticle(index, elapsedTime);
        } else {
          const targetX = this.particleTargets[particleIdx + 0], targetY = this.particleTargets[particleIdx + 1], targetZ = this.particleTargets[particleIdx + 2];
          // Enhanced puzzle-piece attachment with subtle pulsing
          const pulse = 1 + 0.02 * Math.sin(elapsedTime * 4 + index * 0.3);
          const wobble = 0.003 * Math.sin(elapsedTime * 2 + index * 0.17);
          positionAttribute.setXYZ(index, targetX * (pulse + wobble), targetY * (pulse + wobble), targetZ * (pulse + wobble));
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

      // Enhanced Tangential Direction for more pronounced spiral from ring
      this.tangentialVector.copy(this.upVector).cross(this.radialVector);
      if (this.tangentialVector.lengthSq() < 1e-6) {
        this.tangentialVector.set(1, 0, 0);
      }
      this.tangentialVector.normalize();

      // Enhanced Speed Profile for smoother transition from ring to core
      const baseInwardStep = this.particleBaseInwardStep * this.particleSpeeds[index];
      const ease = Math.min(1, radialDistance / 1.2);
      const inwardStep = Math.min(this.particleMaxStep, baseInwardStep * (0.5 + ease));
      
      // Enhanced spiral motion that maintains ring-like behavior longer
      const spiralIntensity = Math.max(0.3, ease); // Maintain spiral even when close
      const spiralStep = inwardStep * this.particleSpiralFactor * spiralIntensity * 
                        (0.9 + this.particleVariance * (Math.sin(elapsedTime * 1.2 + index * 0.73) * 0.5 + 0.5));

      // Update Position
      const nextX = currentX + this.radialVector.x * inwardStep + this.tangentialVector.x * spiralStep;
      const nextY = currentY + this.radialVector.y * inwardStep + this.tangentialVector.y * spiralStep;
      const nextZ = currentZ + this.radialVector.z * inwardStep + this.tangentialVector.z * spiralStep;

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


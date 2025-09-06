
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
    this.coreRadius = 1.5;
    const coreGeometry = new THREE.SphereGeometry(this.coreRadius, 64, 64);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a3550,
      emissive: 0x4a9eff,
      emissiveIntensity: 0.4,
      metalness: 0.2,
      roughness: 0.6,
      transparent: true,
      opacity: 0.9
    });
    this.coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    this.scene.add(this.coreMesh);
  }

  setupParticleParams() {
    // Number of particles in the system
    this.particleCount = 1500;

    // Horizontal ring parameters
    this.ringRadius = 4.0;
    this.ringThickness = 0.2;

    // Spiral motion parameters
    this.spiralSpeed = 0.02;
    this.spiralTightness = 0.8;
    
    // Attachment parameters
    this.attachmentDistance = 0.1;
    this.dwellTime = 2.0;
  }

  setupBuffers() {
    this.particlePositions = new Float32Array(this.particleCount * 3);
    this.particleAngles = new Float32Array(this.particleCount);
    this.particleRadii = new Float32Array(this.particleCount);
    this.particleStates = new Uint8Array(this.particleCount); // 0=spiraling, 1=attached
    this.particleAttachTime = new Float32Array(this.particleCount);
    this.particleTargets = new Float32Array(this.particleCount * 3);
  }

  setupHelpers() {
    this.radialVector = new THREE.Vector3();
    this.tangentialVector = new THREE.Vector3();
    this.upVector = new THREE.Vector3(0, 1, 0);
  }

  setupGeometry() {
    this.particleGeometry = new THREE.BufferGeometry();
    this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    
    this.particleMaterial = new THREE.PointsMaterial({
      color: 0x6ea9ff,
      size: 0.12,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
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

  // Initialize a particle at a random position on the horizontal ring
  initParticle(index) {
    // Random angle on the ring
    this.particleAngles[index] = Math.random() * Math.PI * 2;
    
    // Start at ring radius
    this.particleRadii[index] = this.ringRadius;
    
    // Random height within ring thickness
    const y = (Math.random() - 0.5) * this.ringThickness;
    
    // Calculate ring position
    const x = Math.cos(this.particleAngles[index]) * this.ringRadius;
    const z = Math.sin(this.particleAngles[index]) * this.ringRadius;
    
    // Set initial position
    this.particlePositions[index * 3] = x;
    this.particlePositions[index * 3 + 1] = y;
    this.particlePositions[index * 3 + 2] = z;
    
    // Calculate target position on sphere surface
    const sphereRadius = this.coreRadius;
    const targetDir = new THREE.Vector3(x, y, z).normalize();
    this.particleTargets[index * 3] = targetDir.x * sphereRadius;
    this.particleTargets[index * 3 + 1] = targetDir.y * sphereRadius;
    this.particleTargets[index * 3 + 2] = targetDir.z * sphereRadius;
    
    // Set state
    this.particleStates[index] = 0; // spiraling
    this.particleAttachTime[index] = 0;
  }

  // Initialize all particles
  initParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      this.initParticle(i);
    }
  }

  // Animation loop
  animate() {
    requestAnimationFrame(() => this.animate());
    const elapsedTime = this.animationClock.getElapsedTime();
    const positionAttribute = this.particleGeometry.attributes.position;

    // Core gentle breathing effect (scale only, no geometry recreation)
    const coreBreathScale = 1 + Math.sin(elapsedTime * 1.2) * 0.03;
    this.coreMesh.scale.setScalar(coreBreathScale);

    // Subtle scene rotation
    this.scene.rotation.y += 0.0005;

    // Update particles
    for (let i = 0; i < this.particleCount; i++) {
      const idx = i * 3;
      
      if (this.particleStates[i] === 1) {
        // Particle is attached - check if it should respawn
        if (elapsedTime - this.particleAttachTime[i] > this.dwellTime) {
          this.initParticle(i);
        }
        continue;
      }

      // Get current position
      const currentX = positionAttribute.getX(i);
      const currentY = positionAttribute.getY(i);
      const currentZ = positionAttribute.getZ(i);
      
      // Get target position
      const targetX = this.particleTargets[idx];
      const targetY = this.particleTargets[idx + 1];
      const targetZ = this.particleTargets[idx + 2];

      // Calculate distance to target
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      const dz = targetZ - currentZ;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      // Check if close enough to attach
      if (distance < this.attachmentDistance) {
        positionAttribute.setXYZ(i, targetX, targetY, targetZ);
        this.particleStates[i] = 1;
        this.particleAttachTime[i] = elapsedTime;
        continue;
      }

      // Update angle for spiral motion
      this.particleAngles[i] += this.spiralSpeed;
      
      // Reduce radius (spiral inward)
      this.particleRadii[i] *= (1 - this.spiralSpeed * this.spiralTightness);
      
      // Calculate new position with spiral motion
      const spiralX = Math.cos(this.particleAngles[i]) * this.particleRadii[i];
      const spiralZ = Math.sin(this.particleAngles[i]) * this.particleRadii[i];
      
      // Interpolate Y position toward target
      const newY = currentY + (targetY - currentY) * 0.02;
      
      positionAttribute.setXYZ(i, spiralX, newY, spiralZ);
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


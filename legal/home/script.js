
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
    this.coreRadius = 1.08;
    const coreGeometry = new THREE.SphereGeometry(this.coreRadius * 0.96, 48, 48);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a2440,
      emissive: 0x89e4ff,
      emissiveIntensity: 0.25,
      metalness: 0.2,
      roughness: 0.9
    });
    this.coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    this.scene.add(this.coreMesh);
  }

  setupParticleParams() {
    this.particleCount = 2000;
    this.particleStartRadiusMin = 3.0;
    this.particleStartRadiusMax = 7.0;
    this.particleStickDistance = 0.02;
    this.particleDwellTime = 1.6;
    this.particleSpiralFactor = 0.65;
    this.particleBaseInwardStep = 0.015;
    this.particleMaxStep = 0.06;
    this.particleVariance = 0.8;
  }

  setupBuffers() {
    this.particlePositions = new Float32Array(this.particleCount * 3);
    this.particleTargets = new Float32Array(this.particleCount * 3);
    this.particleSpeeds = new Float32Array(this.particleCount);
    this.particleDelays = new Float32Array(this.particleCount);
    this.particleStates = new Uint8Array(this.particleCount);
    this.particleDwellAt = new Float32Array(this.particleCount);
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
      color: 0x8fd3ff,
      size: 0.056, // doubled from 0.028
      transparent: true,
      opacity: 0.95,
      depthWrite: false
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

  // Generate a random point uniformly on a sphere
  // Generate a random point on a torus (donut)
  // majorRadius: distance from center to middle of tube
  // minorRadius: radius of the tube
  randomOnTorus(majorRadius, minorRadius) {
    const u = Math.random() * 2 * Math.PI; // angle around main circle
    // Restrict v to avoid top/bottom extremes: e.g., avoid ±π/2 by using a margin
  // Use only the middle 30% of the tube angle to avoid top/bottom
  const minV = Math.PI * 0.85;
  const maxV = Math.PI * 1.15;
  const v = minV + Math.random() * (maxV - minV);
    const x = (majorRadius + minorRadius * Math.cos(v)) * Math.cos(u);
    const y = (majorRadius + minorRadius * Math.cos(v)) * Math.sin(u);
    const z = minorRadius * Math.sin(v);
    return new THREE.Vector3(x, y, z);
  }

  // Seed a particle with a new target and initial position
  seedParticle(index, now) {
    // Torus parameters: major radius (distance from center), minor radius (tube thickness)
    const majorRadius = this.coreRadius * 1.2; // slightly larger than core
    const minorRadius = this.coreRadius * 0.35; // thickness of donut
    const targetVector = this.randomOnTorus(majorRadius, minorRadius);
    this.particleTargets[index * 3 + 0] = targetVector.x;
    this.particleTargets[index * 3 + 1] = targetVector.y;
    this.particleTargets[index * 3 + 2] = targetVector.z;

    // Start position: along same ray but farther out
    const startRadius = this.particleStartRadiusMin + Math.random() * (this.particleStartRadiusMax - this.particleStartRadiusMin);
    const scale = startRadius / majorRadius;
    this.particlePositions[index * 3 + 0] = targetVector.x * scale;
    this.particlePositions[index * 3 + 1] = targetVector.y * scale;
    this.particlePositions[index * 3 + 2] = targetVector.z * scale;

    this.particleSpeeds[index] = (0.75 + Math.random() * 0.75) * 0.5; // keep at 50% speed
    this.particleDelays[index] = Math.random() * 2.2;
    this.particleStates[index] = 2;
    this.particleDwellAt[index] = 0;
    if (now > this.particleDelays[index]) this.particleStates[index] = 0;
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

    // Slight scene drift for life
    this.scene.rotation.y += 0.0008;

    // Update particles
    for (let index = 0; index < this.particleCount; index++) {
      const particleIdx = index * 3;

      // Manage Delay
      if (this.particleStates[index] === 2) {
        if (elapsedTime >= this.particleDelays[index]) this.particleStates[index] = 0;
        else continue;
      }

      // If Stuck, Check Dwell Time then Respawn
      if (this.particleStates[index] === 1) {
        if (elapsedTime - this.particleDwellAt[index] > this.particleDwellTime) {
          this.seedParticle(index, elapsedTime);
        } else {
          const targetX = this.particleTargets[particleIdx + 0], targetY = this.particleTargets[particleIdx + 1], targetZ = this.particleTargets[particleIdx + 2];
          const wobble = 0.003 * Math.sin(elapsedTime * 2 + index * 0.17);
          positionAttribute.setXYZ(index, targetX * (1 + wobble), targetY * (1 + wobble), targetZ * (1 + wobble));
        }
        continue;
      }

      // Current and Final Positions
      const currentX = positionAttribute.getX(index);
      const currentY = positionAttribute.getY(index);
      const currentZ = positionAttribute.getZ(index);
      const targetX = this.particleTargets[particleIdx + 0];
      const targetY = this.particleTargets[particleIdx + 1];
      const targetZ = this.particleTargets[particleIdx + 2];

      // Radial Direction (toward target)
      this.radialVector.set(targetX - currentX, targetY - currentY, targetZ - currentZ);
      const radialDistance = this.radialVector.length();

      // Stick to Core if Close Enough
      if (radialDistance <= this.particleStickDistance) {
        positionAttribute.setXYZ(index, targetX, targetY, targetZ);
        this.particleStates[index] = 1;
        this.particleDwellAt[index] = elapsedTime;
        continue;
      }

      this.radialVector.normalize();

      // Tangential Direction (perpendicular to radial)
      this.tangentialVector.copy(this.upVector).cross(this.radialVector);
      if (this.tangentialVector.lengthSq() < 1e-6) {
        this.tangentialVector.set(1, 0, 0);
      }
      this.tangentialVector.normalize();

      // Speed Profile
      const baseInwardStep = this.particleBaseInwardStep * this.particleSpeeds[index];
      const ease = Math.min(1, radialDistance / 1.2);
      const inwardStep = Math.min(this.particleMaxStep, baseInwardStep * (0.5 + ease));
      const spiralStep = inwardStep * this.particleSpiralFactor * (0.9 + this.particleVariance * (Math.sin(elapsedTime * 1.2 + index * 0.73) * 0.5 + 0.5));

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
new Home3DAnimation();


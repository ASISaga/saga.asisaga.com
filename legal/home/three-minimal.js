// Minimal Three.js implementation for testing and enhancement
// This is a simplified version to work around CDN blocking issues

// Basic Three.js polyfill for development
window.THREE = {
  Scene: function() {
    this.children = [];
    this.fog = null;
    this.add = function(object) { this.children.push(object); };
    return this;
  },
  
  PerspectiveCamera: function(fov, aspect, near, far) {
    this.position = { set: function(x, y, z) { this.x = x; this.y = y; this.z = z; }, x: 0, y: 0, z: 0 };
    return this;
  },
  
  WebGLRenderer: function(options) {
    this.domElement = document.createElement('canvas');
    this.domElement.width = window.innerWidth;
    this.domElement.height = window.innerHeight;
    this.domElement.style.position = 'fixed';
    this.domElement.style.top = '0';
    this.domElement.style.left = '0';
    this.domElement.style.zIndex = '-1';
    this.setSize = function(w, h) { this.domElement.width = w; this.domElement.height = h; };
    this.setPixelRatio = function(ratio) {};
    this.render = function(scene, camera) {
      // Simple animated background to show it's working
      const ctx = this.domElement.getContext('2d');
      const time = Date.now() * 0.001;
      
      // Clear with animated gradient
      const gradient = ctx.createRadialGradient(
        this.domElement.width/2, this.domElement.height/2, 0,
        this.domElement.width/2, this.domElement.height/2, Math.max(this.domElement.width, this.domElement.height)
      );
      gradient.addColorStop(0, `hsl(${time * 20 % 360}, 30%, 5%)`);
      gradient.addColorStop(1, '#000');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.domElement.width, this.domElement.height);
      
      // Draw animated brain outline
      this.drawBrainOutline(ctx, time);
      
      // Draw animated neurons
      this.drawNeurons(ctx, time);
      
      // Draw thought balloons
      this.drawThoughtBalloons(ctx, time);
    };
    
    this.drawBrainOutline = function(ctx, time) {
      const centerX = this.domElement.width / 2;
      const centerY = this.domElement.height / 2;
      const scale = Math.min(this.domElement.width, this.domElement.height) * 0.2;
      
      ctx.strokeStyle = `hsl(${200 + Math.sin(time) * 20}, 70%, ${60 + Math.sin(time * 2) * 10}%)`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      // Brain outline points (simplified from the original)
      const brainPoints = [
        [-0.65, 0.18], [-0.75, 0.38], [-0.68, 0.65], [-0.45, 0.78],
        [0.0, 0.82], [0.45, 0.75], [0.68, 0.55], [0.75, 0.28],
        [0.65, 0.05], [0.45, -0.18], [0.0, -0.38], [-0.35, -0.45],
        [-0.55, -0.38], [-0.65, 0.18]
      ];
      
      brainPoints.forEach((point, i) => {
        const x = centerX + point[0] * scale;
        const y = centerY - point[1] * scale;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      
      ctx.stroke();
    };
    
    this.drawNeurons = function(ctx, time) {
      const centerX = this.domElement.width / 2;
      const centerY = this.domElement.height / 2;
      const scale = Math.min(this.domElement.width, this.domElement.height) * 0.15;
      
      // Generate neurons inside brain area
      for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        const radius = 0.3 + Math.random() * 0.4;
        const x = centerX + Math.cos(angle) * radius * scale;
        const y = centerY + Math.sin(angle) * radius * scale;
        
        // Pulsing effect
        const pulse = Math.sin(time * 3 + i * 0.5) * 0.5 + 0.5;
        const size = 3 + pulse * 4;
        const intensity = 50 + pulse * 50;
        
        ctx.fillStyle = `hsl(${200 + pulse * 40}, 80%, ${intensity}%)`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw connections
        if (i < 23) {
          const nextAngle = ((i + 1) / 24) * Math.PI * 2;
          const nextRadius = 0.3 + Math.random() * 0.4;
          const nextX = centerX + Math.cos(nextAngle) * nextRadius * scale;
          const nextY = centerY + Math.sin(nextAngle) * nextRadius * scale;
          
          ctx.strokeStyle = `hsla(200, 60%, 60%, ${0.3 + pulse * 0.3})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(nextX, nextY);
          ctx.stroke();
        }
      }
    };
    
    this.drawThoughtBalloons = function(ctx, time) {
      ctx.font = '24px serif';
      ctx.textAlign = 'center';
      
      // Spiral thought balloons
      for (let i = 0; i < 8; i++) {
        const spiralTime = (time * 0.5 + i * 0.5) % 4;
        const angle = spiralTime * Math.PI * 2;
        const radius = (4 - spiralTime) * Math.min(this.domElement.width, this.domElement.height) * 0.15;
        
        if (radius > 20) {
          const x = this.domElement.width / 2 + Math.cos(angle) * radius;
          const y = this.domElement.height / 2 + Math.sin(angle) * radius;
          
          const opacity = Math.max(0, 1 - spiralTime / 4);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.fillText('💭', x, y);
        }
      }
    };
    
    return this;
  },
  
  AmbientLight: function(color, intensity) { return {}; },
  DirectionalLight: function(color, intensity) { 
    this.position = { set: function() {} };
    return this;
  },
  FogExp2: function(color, density) { return {}; },
  Vector3: function(x, y, z) {
    this.x = x || 0; this.y = y || 0; this.z = z || 0;
    this.clone = function() { return new THREE.Vector3(this.x, this.y, this.z); };
    this.multiplyScalar = function(s) { return new THREE.Vector3(this.x * s, this.y * s, this.z * s); };
    this.length = function() { return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); };
    this.normalize = function() { 
      const len = this.length();
      if (len > 0) { this.x /= len; this.y /= len; this.z /= len; }
      return this;
    };
    this.copy = function(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; };
    this.set = function(x, y, z) { this.x = x; this.y = y; this.z = z; return this; };
    this.add = function(v) { this.x += v.x; this.y += v.y; this.z += v.z; return this; };
    this.sub = function(v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; return this; };
    this.cross = function(v) {
      const x = this.y * v.z - this.z * v.y;
      const y = this.z * v.x - this.x * v.z;
      const z = this.x * v.y - this.y * v.x;
      return new THREE.Vector3(x, y, z);
    };
    this.lengthSq = function() { return this.x * this.x + this.y * this.y + this.z * this.z; };
    this.project = function(camera) { return this.clone(); };
    return this;
  },
  BufferGeometry: function() {
    this.setFromPoints = function() { return this; };
    return this;
  },
  Line: function() { return { renderOrder: 0 }; },
  LineBasicMaterial: function() { return {}; },
  SphereGeometry: function() { return {}; },
  Mesh: function() { 
    this.position = { copy: function() {} };
    this.renderOrder = 0;
    return this;
  },
  MeshStandardMaterial: function() { return {}; },
  Sprite: function() {
    this.scale = { set: function() {} };
    this.material = { opacity: 1 };
    this.visible = true;
    this.position = { set: function() {}, copy: function() {} };
    this.userData = {};
    return this;
  },
  SpriteMaterial: function() { return {}; },
  CanvasTexture: function() { return {}; },
  Clock: function() {
    this.startTime = Date.now();
    this.getElapsedTime = function() { return (Date.now() - this.startTime) / 1000; };
    return this;
  },
  Color: function(color) {
    this.set = function() { return this; };
    this.lerp = function() { return this; };
    return this;
  },
  MathUtils: {
    degToRad: function(degrees) { return degrees * Math.PI / 180; }
  }
};

export default THREE;
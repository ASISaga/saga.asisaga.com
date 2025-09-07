// Enhanced ASI Saga Animation
// Implements sophisticated brain visualization with enhanced effects
// Based on the ASI Saga Scene Overview requirements

export class EnhancedASISagaAnimation {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.startTime = Date.now();
    this.neurons = [];
    this.thoughtBalloons = [];
    this.connections = [];
    
    this.init();
  }

  init() {
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.zIndex = '-1';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
    
    this.initNeurons();
    this.initThoughtBalloons();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth * window.devicePixelRatio;
    this.canvas.height = window.innerHeight * window.devicePixelRatio;
    this.ctx?.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  initNeurons() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const scale = Math.min(window.innerWidth, window.innerHeight) * 0.15;
    
    // Enhanced brain outline coordinates (more anatomically accurate)
    const brainOutline = [
      [-0.8, 0.2], [-0.85, 0.45], [-0.78, 0.7], [-0.6, 0.85], [-0.3, 0.9],
      [0.0, 0.88], [0.3, 0.85], [0.6, 0.8], [0.78, 0.6], [0.85, 0.35],
      [0.8, 0.1], [0.7, -0.1], [0.5, -0.25], [0.2, -0.4], [0.0, -0.45],
      [-0.2, -0.42], [-0.4, -0.35], [-0.6, -0.25], [-0.75, -0.1], [-0.8, 0.2]
    ];

    // Create neurons with enhanced properties
    this.neurons = [];
    for (let i = 0; i < 48; i++) {
      // Place neurons within brain boundary
      let x, y, attempts = 0;
      do {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.6;
        x = centerX + Math.cos(angle) * radius * scale;
        y = centerY + Math.sin(angle) * radius * scale * 0.8; // Slightly flatter
        attempts++;
      } while (attempts < 10);

      this.neurons.push({
        x, y,
        baseX: x, baseY: y,
        size: 2 + Math.random() * 4,
        pulseOffset: Math.random() * Math.PI * 2,
        pulseSpeed: 0.5 + Math.random() * 2,
        flashTimer: Math.random() * 3,
        isFlashing: false,
        connections: []
      });
    }

    // Create neural connections (more realistic network)
    this.connections = [];
    this.neurons.forEach((neuron, i) => {
      const numConnections = 2 + Math.floor(Math.random() * 4);
      for (let j = 0; j < numConnections; j++) {
        const targetIndex = Math.floor(Math.random() * this.neurons.length);
        if (targetIndex !== i) {
          const target = this.neurons[targetIndex];
          const distance = Math.sqrt((neuron.x - target.x) ** 2 + (neuron.y - target.y) ** 2);
          
          if (distance < scale * 0.8) { // Only connect nearby neurons
            this.connections.push({
              from: neuron,
              to: target,
              activity: Math.random(),
              pulseSpeed: 0.3 + Math.random() * 0.7
            });
          }
        }
      }
    });
  }

  initThoughtBalloons() {
    this.thoughtBalloons = [];
    
    // Different types of thought symbols for variety
    const thoughtSymbols = ['💭', '🧠', '💡', '✨', '🌟', '💫'];
    
    for (let i = 0; i < 15; i++) {
      this.thoughtBalloons.push({
        symbol: thoughtSymbols[Math.floor(Math.random() * thoughtSymbols.length)],
        x: 0, y: 0,
        angle: Math.random() * Math.PI * 2,
        radius: 200 + Math.random() * 300,
        spiralSpeed: 0.3 + Math.random() * 0.5,
        spiralOffset: Math.random() * Math.PI * 2,
        opacity: 0.6 + Math.random() * 0.4,
        size: 16 + Math.random() * 12,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  drawEnhancedBrainOutline(time) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const scale = Math.min(window.innerWidth, window.innerHeight) * 0.15;
    
    // Enhanced brain outline with anatomical details
    const brainPoints = [
      [-0.8, 0.2], [-0.85, 0.45], [-0.78, 0.7], [-0.6, 0.85], [-0.3, 0.9],
      [0.0, 0.88], [0.3, 0.85], [0.6, 0.8], [0.78, 0.6], [0.85, 0.35],
      [0.8, 0.1], [0.7, -0.1], [0.5, -0.25], [0.2, -0.4], [0.0, -0.45],
      [-0.2, -0.42], [-0.4, -0.35], [-0.6, -0.25], [-0.75, -0.1], [-0.8, 0.2]
    ];

    // Main brain outline with glow effect
    this.ctx.save();
    
    // Outer glow
    this.ctx.shadowColor = `hsl(200, 80%, 60%)`;
    this.ctx.shadowBlur = 20;
    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = `hsl(${200 + Math.sin(time * 0.5) * 20}, 70%, ${60 + Math.sin(time) * 15}%)`;
    
    this.ctx.beginPath();
    brainPoints.forEach((point, i) => {
      const wobble = Math.sin(time * 2 + i * 0.3) * 2;
      const x = centerX + (point[0] * scale) + wobble;
      const y = centerY - (point[1] * scale * 0.8) + wobble * 0.5;
      
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    });
    this.ctx.stroke();
    
    // Add brain lobes detail
    this.drawBrainLobes(centerX, centerY, scale, time);
    
    this.ctx.restore();
  }

  drawBrainLobes(centerX, centerY, scale, time) {
    // Frontal lobe
    this.ctx.strokeStyle = `hsla(220, 60%, 70%, 0.6)`;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(centerX + scale * 0.3, centerY - scale * 0.3, scale * 0.25, 0, Math.PI);
    this.ctx.stroke();
    
    // Parietal lobe
    this.ctx.beginPath();
    this.ctx.arc(centerX - scale * 0.2, centerY - scale * 0.4, scale * 0.2, 0, Math.PI);
    this.ctx.stroke();
    
    // Temporal lobe
    this.ctx.beginPath();
    this.ctx.arc(centerX + scale * 0.4, centerY + scale * 0.1, scale * 0.15, Math.PI, Math.PI * 2);
    this.ctx.stroke();
  }

  drawEnhancedNeurons(time) {
    // Update neuron flashing
    this.neurons.forEach(neuron => {
      neuron.flashTimer -= 0.016;
      if (neuron.flashTimer <= 0) {
        neuron.isFlashing = true;
        neuron.flashTimer = 1 + Math.random() * 3;
      }
      
      if (neuron.isFlashing) {
        neuron.flashTimer -= 0.016;
        if (neuron.flashTimer <= 0.1) {
          neuron.isFlashing = false;
        }
      }
    });

    // Draw neural connections with activity pulses
    this.connections.forEach(connection => {
      const activity = Math.sin(time * connection.pulseSpeed + connection.activity * Math.PI * 2) * 0.5 + 0.5;
      const opacity = 0.2 + activity * 0.6;
      
      this.ctx.strokeStyle = `hsla(200, 80%, 70%, ${opacity})`;
      this.ctx.lineWidth = 1 + activity * 2;
      this.ctx.beginPath();
      this.ctx.moveTo(connection.from.x, connection.from.y);
      this.ctx.lineTo(connection.to.x, connection.to.y);
      this.ctx.stroke();
      
      // Draw activity pulse along connection
      if (activity > 0.7) {
        const pulsePos = (time * connection.pulseSpeed) % 1;
        const pulseX = connection.from.x + (connection.to.x - connection.from.x) * pulsePos;
        const pulseY = connection.from.y + (connection.to.y - connection.from.y) * pulsePos;
        
        this.ctx.fillStyle = `hsl(${180 + activity * 40}, 90%, 80%)`;
        this.ctx.beginPath();
        this.ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });

    // Draw neurons with enhanced effects
    this.neurons.forEach(neuron => {
      const pulse = Math.sin(time * neuron.pulseSpeed + neuron.pulseOffset) * 0.3 + 0.7;
      const size = neuron.size * pulse;
      
      if (neuron.isFlashing) {
        const flashIntensity = Math.min(1, neuron.flashTimer / 0.1);
        this.ctx.fillStyle = `hsl(${40 + flashIntensity * 20}, 90%, ${70 + flashIntensity * 20}%)`;
        this.ctx.shadowColor = `hsl(${40 + flashIntensity * 20}, 90%, 80%)`;
        this.ctx.shadowBlur = 15;
      } else {
        this.ctx.fillStyle = `hsl(${200 + pulse * 20}, 80%, ${50 + pulse * 20}%)`;
        this.ctx.shadowColor = `hsl(200, 80%, 60%)`;
        this.ctx.shadowBlur = 8;
      }
      
      this.ctx.beginPath();
      this.ctx.arc(neuron.x, neuron.y, size, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  drawEnhancedThoughtBalloons(time) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    this.thoughtBalloons.forEach((balloon, i) => {
      // Enhanced spiral motion with depth
      balloon.angle += balloon.spiralSpeed * 0.02;
      balloon.radius *= 0.998; // Gradually spiral inward
      
      if (balloon.radius < 50) {
        // Reset balloon from edge
        balloon.radius = 300 + Math.random() * 200;
        balloon.angle = Math.random() * Math.PI * 2;
        balloon.phase = Math.random() * Math.PI * 2;
      }
      
      // Calculate position with 3D-like motion
      const depthFactor = balloon.radius / 500;
      const x = centerX + Math.cos(balloon.angle) * balloon.radius;
      const y = centerY + Math.sin(balloon.angle) * balloon.radius * 0.7;
      const z = Math.sin(time * 0.5 + balloon.phase) * 20;
      
      // Adjust size and opacity based on depth
      const size = balloon.size * (0.5 + depthFactor * 0.5) * (1 + z * 0.01);
      const opacity = balloon.opacity * depthFactor * (0.8 + Math.sin(time + balloon.phase) * 0.2);
      
      this.ctx.save();
      this.ctx.globalAlpha = opacity;
      this.ctx.font = `${size}px serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      
      // Add subtle glow to thought balloons
      this.ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
      this.ctx.shadowBlur = 10;
      
      this.ctx.fillText(balloon.symbol, x, y);
      this.ctx.restore();
    });
  }

  drawAnimatedBackground(time) {
    // Enhanced gradient background with depth
    const gradient = this.ctx.createRadialGradient(
      window.innerWidth / 2, window.innerHeight / 2, 0,
      window.innerWidth / 2, window.innerHeight / 2, 
      Math.max(window.innerWidth, window.innerHeight) * 0.8
    );
    
    const hue1 = (time * 10) % 360;
    const hue2 = (time * 15 + 180) % 360;
    
    gradient.addColorStop(0, `hsla(${hue1}, 30%, 8%, 1)`);
    gradient.addColorStop(0.5, `hsla(${hue2}, 25%, 5%, 1)`);
    gradient.addColorStop(1, 'hsla(240, 20%, 2%, 1)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    
    // Add subtle particles for atmosphere
    this.drawAtmosphericParticles(time);
  }

  drawAtmosphericParticles(time) {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    
    for (let i = 0; i < 50; i++) {
      const x = (Math.sin(time * 0.1 + i) * 0.5 + 0.5) * window.innerWidth;
      const y = (Math.cos(time * 0.15 + i * 0.5) * 0.5 + 0.5) * window.innerHeight;
      const size = Math.sin(time + i) * 0.5 + 1;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  animate() {
    const time = (Date.now() - this.startTime) / 1000;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    // Draw all enhanced elements
    this.drawAnimatedBackground(time);
    this.drawEnhancedBrainOutline(time);
    this.drawEnhancedNeurons(time);
    this.drawEnhancedThoughtBalloons(time);
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}
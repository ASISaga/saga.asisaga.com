// Simple enhanced animation that works reliably
// Based on ASI Saga Scene Overview requirements

console.log('Loading simple animation...');

class SimpleASISagaAnimation {
  constructor() {
    console.log('Initializing ASI Saga Animation...');
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.startTime = Date.now();
    this.neurons = [];
    this.thoughts = [];
    
    this.init();
  }

  init() {
    console.log('Creating canvas...');
    
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.zIndex = '1'; // Changed from -1 to 1
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.backgroundColor = 'transparent';
    
    // Set actual canvas size
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
    
    console.log('Canvas created, initializing elements...');
    
    this.initNeurons();
    this.initThoughts();
    this.animate();
    
    console.log('Animation started!');
  }

  initNeurons() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const scale = Math.min(window.innerWidth, window.innerHeight) * 0.18;
    
    this.neurons = [];
    // Create more sophisticated neuron network
    for (let i = 0; i < 32; i++) {
      const angle = (i / 32) * Math.PI * 2;
      const layer = Math.floor(i / 8);
      const radius = (0.25 + layer * 0.15) + Math.random() * 0.1;
      
      this.neurons.push({
        x: centerX + Math.cos(angle) * radius * scale,
        y: centerY + Math.sin(angle) * radius * scale * 0.85,
        size: 2.5 + Math.random() * 3.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.8,
        layer: layer,
        type: Math.random() > 0.7 ? 'major' : 'normal',
        flashIntensity: 0,
        lastFlash: 0
      });
    }
  }

  initThoughts() {
    this.thoughts = [];
    const symbols = ['💭', '🧠', '💡', '✨', '🌟', '💫', '🔮', '⚡', '🌀', '💎'];
    
    for (let i = 0; i < 12; i++) {
      this.thoughts.push({
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        angle: (i / 12) * Math.PI * 2 + Math.random() * 0.5,
        radius: 250 + Math.random() * 150,
        speed: 0.25 + Math.random() * 0.35,
        size: 18 + Math.random() * 14,
        opacity: 0.6 + Math.random() * 0.4,
        verticalOffset: Math.random() * Math.PI * 2,
        rotationSpeed: 0.1 + Math.random() * 0.2
      });
    }
  }

  drawBackground(time) {
    // Multi-layered animated gradient background
    const gradient = this.ctx.createRadialGradient(
      window.innerWidth / 2, window.innerHeight / 2, 0,
      window.innerWidth / 2, window.innerHeight / 2, 
      Math.max(window.innerWidth, window.innerHeight) * 0.8
    );
    
    const hue1 = (time * 15) % 360;
    const hue2 = (time * 20 + 120) % 360;
    const hue3 = (time * 10 + 240) % 360;
    
    gradient.addColorStop(0, `hsla(${hue1}, 50%, 12%, 1)`);
    gradient.addColorStop(0.3, `hsla(${hue2}, 40%, 8%, 1)`);
    gradient.addColorStop(0.7, `hsla(${hue3}, 35%, 4%, 1)`);
    gradient.addColorStop(1, 'hsla(240, 30%, 1%, 1)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    
    // Add depth particles
    this.drawDepthParticles(time);
  }

  drawDepthParticles(time) {
    // Atmospheric depth particles
    this.ctx.fillStyle = 'rgba(150, 200, 255, 0.1)';
    
    for (let i = 0; i < 30; i++) {
      const x = (Math.sin(time * 0.1 + i * 0.3) * 0.5 + 0.5) * window.innerWidth;
      const y = (Math.cos(time * 0.12 + i * 0.4) * 0.5 + 0.5) * window.innerHeight;
      const size = Math.sin(time * 0.8 + i) * 1.5 + 2;
      const opacity = Math.sin(time * 0.5 + i * 0.2) * 0.3 + 0.7;
      
      this.ctx.save();
      this.ctx.globalAlpha = opacity * 0.15;
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  drawBrain(time) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const scale = Math.min(window.innerWidth, window.innerHeight) * 0.18; // Slightly larger
    
    // Enhanced brain outline with more anatomical accuracy
    const brainPoints = [
      [-0.85, 0.15], [-0.88, 0.4], [-0.82, 0.68], [-0.65, 0.85], [-0.35, 0.92],
      [-0.05, 0.90], [0.25, 0.88], [0.55, 0.82], [0.75, 0.68], [0.85, 0.45],
      [0.88, 0.2], [0.82, -0.05], [0.68, -0.2], [0.45, -0.32], [0.18, -0.42],
      [-0.05, -0.45], [-0.25, -0.43], [-0.45, -0.38], [-0.65, -0.28], [-0.78, -0.12], [-0.85, 0.15]
    ];

    // Draw multiple brain outline layers for depth
    this.ctx.save();
    
    // Outer glow layer
    this.ctx.shadowColor = `hsl(200, 90%, 70%)`;
    this.ctx.shadowBlur = 25;
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = `hsla(${200 + Math.sin(time * 0.7) * 30}, 80%, ${65 + Math.sin(time * 1.2) * 20}%, 0.8)`;
    
    this.ctx.beginPath();
    brainPoints.forEach((point, i) => {
      const wobble = Math.sin(time * 1.8 + i * 0.4) * 1.8;
      const x = centerX + (point[0] * scale) + wobble;
      const y = centerY - (point[1] * scale * 0.85) + wobble * 0.6;
      
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    });
    this.ctx.stroke();
    
    // Inner detail layer
    this.ctx.shadowBlur = 10;
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = `hsla(${220 + Math.sin(time * 0.5) * 15}, 70%, 75%, 0.9)`;
    
    this.ctx.beginPath();
    brainPoints.forEach((point, i) => {
      const microWobble = Math.sin(time * 3 + i * 0.6) * 0.8;
      const x = centerX + (point[0] * scale * 0.95) + microWobble;
      const y = centerY - (point[1] * scale * 0.82) + microWobble * 0.4;
      
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    });
    this.ctx.stroke();
    
    this.ctx.restore();
    
    // Add brain lobes and anatomical details
    this.drawBrainLobes(centerX, centerY, scale, time);
  }

  drawBrainLobes(centerX, centerY, scale, time) {
    this.ctx.save();
    
    // Frontal lobe
    this.ctx.strokeStyle = `hsla(210, 70%, 70%, ${0.4 + Math.sin(time * 1.5) * 0.2})`;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(centerX + scale * 0.35, centerY - scale * 0.35, scale * 0.28, 0, Math.PI * 1.2);
    this.ctx.stroke();
    
    // Parietal lobe
    this.ctx.strokeStyle = `hsla(190, 65%, 65%, ${0.4 + Math.sin(time * 1.8 + 1) * 0.2})`;
    this.ctx.beginPath();
    this.ctx.arc(centerX - scale * 0.15, centerY - scale * 0.45, scale * 0.22, 0, Math.PI * 1.1);
    this.ctx.stroke();
    
    // Temporal lobe
    this.ctx.strokeStyle = `hsla(230, 60%, 75%, ${0.4 + Math.sin(time * 1.3 + 2) * 0.2})`;
    this.ctx.beginPath();
    this.ctx.arc(centerX + scale * 0.45, centerY + scale * 0.05, scale * 0.18, Math.PI, Math.PI * 2.2);
    this.ctx.stroke();
    
    // Occipital lobe
    this.ctx.strokeStyle = `hsla(170, 55%, 80%, ${0.3 + Math.sin(time * 1.1 + 3) * 0.2})`;
    this.ctx.beginPath();
    this.ctx.arc(centerX - scale * 0.5, centerY + scale * 0.1, scale * 0.15, 0, Math.PI * 1.5);
    this.ctx.stroke();
    
    this.ctx.restore();
  }

  drawNeurons(time) {
    // Enhanced neural network with sophisticated connections
    this.ctx.save();
    
    // Draw inter-layer connections first
    for (let i = 0; i < this.neurons.length; i++) {
      const neuron = this.neurons[i];
      
      // Connect to neurons in adjacent layers and same layer
      for (let j = i + 1; j < this.neurons.length; j++) {
        const target = this.neurons[j];
        const distance = Math.sqrt((neuron.x - target.x) ** 2 + (neuron.y - target.y) ** 2);
        const maxDistance = Math.min(window.innerWidth, window.innerHeight) * 0.12;
        
        if (distance < maxDistance) {
          const activity = Math.sin(time * 1.5 + i * 0.3 + j * 0.2) * 0.5 + 0.5;
          const opacity = (0.15 + activity * 0.4) * (1 - distance / maxDistance);
          
          this.ctx.strokeStyle = `hsla(${180 + activity * 60}, 70%, 70%, ${opacity})`;
          this.ctx.lineWidth = 0.8 + activity * 1.5;
          
          this.ctx.beginPath();
          this.ctx.moveTo(neuron.x, neuron.y);
          this.ctx.lineTo(target.x, target.y);
          this.ctx.stroke();
          
          // Draw activity pulses along connections
          if (activity > 0.75) {
            const pulsePos = (time * 2 + i * 0.1) % 1;
            const pulseX = neuron.x + (target.x - neuron.x) * pulsePos;
            const pulseY = neuron.y + (target.y - neuron.y) * pulsePos;
            
            this.ctx.fillStyle = `hsla(${200 + activity * 40}, 90%, 85%, ${activity})`;
            this.ctx.beginPath();
            this.ctx.arc(pulseX, pulseY, 1.5 + activity, 0, Math.PI * 2);
            this.ctx.fill();
          }
        }
      }
    }
    
    // Draw neurons with enhanced effects
    this.neurons.forEach((neuron, i) => {
      const pulse = Math.sin(time * neuron.speed + neuron.phase) * 0.4 + 0.6;
      const size = neuron.size * pulse;
      
      // Random neural firing
      if (Math.random() < 0.002) {
        neuron.flashIntensity = 1.0;
        neuron.lastFlash = time;
      }
      
      // Decay flash intensity
      if (neuron.flashIntensity > 0) {
        neuron.flashIntensity = Math.max(0, neuron.flashIntensity - 0.05);
      }
      
      let hue, saturation, lightness;
      if (neuron.flashIntensity > 0) {
        // Flashing neuron
        hue = 45 + neuron.flashIntensity * 30;
        saturation = 85 + neuron.flashIntensity * 15;
        lightness = 60 + neuron.flashIntensity * 30;
      } else if (neuron.type === 'major') {
        // Major neurons
        hue = 200 + pulse * 25;
        saturation = 75 + pulse * 15;
        lightness = 55 + pulse * 25;
      } else {
        // Normal neurons
        hue = 190 + pulse * 20;
        saturation = 65 + pulse * 15;
        lightness = 45 + pulse * 20;
      }
      
      this.ctx.shadowColor = `hsl(${hue}, ${saturation}%, ${lightness + 20}%)`;
      this.ctx.shadowBlur = 8 + neuron.flashIntensity * 15;
      this.ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      
      this.ctx.beginPath();
      this.ctx.arc(neuron.x, neuron.y, size, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Draw neuron core for major neurons
      if (neuron.type === 'major') {
        this.ctx.fillStyle = `hsla(${hue + 30}, 90%, 90%, 0.8)`;
        this.ctx.beginPath();
        this.ctx.arc(neuron.x, neuron.y, size * 0.4, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });
    
    this.ctx.restore();
  }

  drawThoughts(time) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    this.thoughts.forEach((thought, i) => {
      // Enhanced spiral motion with 3D-like depth
      thought.angle += thought.speed * 0.015;
      thought.radius *= 0.994; // Gradual spiral inward
      
      // Reset when reaching center
      if (thought.radius < 60) {
        thought.radius = 280 + Math.random() * 120;
        thought.angle = Math.random() * Math.PI * 2;
        // Occasionally change symbol
        if (Math.random() < 0.3) {
          const symbols = ['💭', '🧠', '💡', '✨', '🌟', '💫', '🔮', '⚡', '🌀', '💎'];
          thought.symbol = symbols[Math.floor(Math.random() * symbols.length)];
        }
      }
      
      // Calculate position with vertical oscillation
      const verticalWave = Math.sin(time * 0.8 + thought.verticalOffset) * 15;
      const x = centerX + Math.cos(thought.angle) * thought.radius;
      const y = centerY + Math.sin(thought.angle) * thought.radius * 0.75 + verticalWave;
      
      // Calculate depth-based effects
      const depthFactor = Math.max(0.3, thought.radius / 300);
      const size = thought.size * depthFactor * (0.8 + Math.sin(time * 0.6 + i) * 0.2);
      const opacity = thought.opacity * depthFactor * (0.7 + Math.sin(time * 0.4 + i * 0.3) * 0.3);
      
      this.ctx.save();
      this.ctx.globalAlpha = opacity;
      this.ctx.font = `${size}px serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      
      // Add enhanced glow effect
      this.ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      this.ctx.shadowBlur = 12 + Math.sin(time + i) * 5;
      
      // Slight rotation for some symbols
      if (Math.floor(i / 3) % 2 === 0) {
        this.ctx.translate(x, y);
        this.ctx.rotate(time * thought.rotationSpeed + i);
        this.ctx.fillText(thought.symbol, 0, 0);
      } else {
        this.ctx.fillText(thought.symbol, x, y);
      }
      
      this.ctx.restore();
    });
  }

  animate() {
    const time = (Date.now() - this.startTime) / 1000;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    // Draw all elements
    this.drawBackground(time);
    this.drawBrain(time);
    this.drawNeurons(time);
    this.drawThoughts(time);
    
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

// Auto-start animation when script loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, starting animation...');
  window.asiSagaAnimation = new SimpleASISagaAnimation();
});

// If DOM is already loaded, start immediately
if (document.readyState === 'loading') {
  console.log('DOM still loading, waiting...');
} else {
  console.log('DOM already loaded, starting animation immediately...');
  window.asiSagaAnimation = new SimpleASISagaAnimation();
}
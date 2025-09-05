/**
 * ASI Saga Foundation - Sacred Interactions
 * Advanced interactivity for consciousness-driven experiences
 */

class SacredInteractions {
  constructor() {
    this.init();
  }

  init() {
    this.setupConsciousnessVisualization();
    this.setupSacredGeometry();
    this.setupMythicText();
    this.setupTranscendentEffects();
    this.bindAdvancedInteractions();
  }

  /**
   * Consciousness Visualization System
   */
  setupConsciousnessVisualization() {
    const consciousnessSymbols = document.querySelectorAll('.consciousness-symbol, .infinite-consciousness');
    
    consciousnessSymbols.forEach(symbol => {
      this.enhanceConsciousnessSymbol(symbol);
    });
  }

  /**
   * Enhance Consciousness Symbol
   */
  enhanceConsciousnessSymbol(symbol) {
    let isInteracting = false;
    
    symbol.addEventListener('mouseenter', () => {
      if (!isInteracting) {
        isInteracting = true;
        this.triggerConsciousnessResonance(symbol);
      }
    });

    symbol.addEventListener('click', () => {
      this.triggerTranscendentPulse(symbol);
    });

    // Periodic ambient animation
    setInterval(() => {
      if (!isInteracting) {
        this.subtleConsciousnessPulse(symbol);
      }
    }, 5000 + Math.random() * 3000);
  }

  /**
   * Trigger Consciousness Resonance
   */
  triggerConsciousnessResonance(symbol) {
    const resonanceEffect = symbol.animate([
      { 
        transform: 'scale(1) rotate(0deg)',
        filter: 'hue-rotate(0deg) brightness(1) drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))'
      },
      { 
        transform: 'scale(1.1) rotate(180deg)',
        filter: 'hue-rotate(180deg) brightness(1.5) drop-shadow(0 0 30px rgba(233, 69, 96, 0.8))'
      },
      { 
        transform: 'scale(1.05) rotate(360deg)',
        filter: 'hue-rotate(360deg) brightness(1.2) drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))'
      },
      { 
        transform: 'scale(1) rotate(360deg)',
        filter: 'hue-rotate(0deg) brightness(1) drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))'
      }
    ], {
      duration: 2000,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    });

    resonanceEffect.addEventListener('finish', () => {
      setTimeout(() => {
        // Reset interaction flag after a delay
        this.isInteracting = false;
      }, 1000);
    });
  }

  /**
   * Trigger Transcendent Pulse
   */
  triggerTranscendentPulse(symbol) {
    // Create expanding consciousness rings
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.createConsciousnessRing(symbol);
      }, i * 200);
    }

    // Enhance the symbol itself
    symbol.animate([
      { transform: 'scale(1)', filter: 'brightness(1)' },
      { transform: 'scale(1.3)', filter: 'brightness(2)' },
      { transform: 'scale(1)', filter: 'brightness(1)' }
    ], {
      duration: 1000,
      easing: 'ease-out'
    });
  }

  /**
   * Create Consciousness Ring
   */
  createConsciousnessRing(centerElement) {
    const ring = document.createElement('div');
    const rect = centerElement.getBoundingClientRect();
    
    ring.style.cssText = `
      position: fixed;
      left: ${rect.left + rect.width / 2}px;
      top: ${rect.top + rect.height / 2}px;
      width: 20px;
      height: 20px;
      border: 2px solid var(--infinite-purple);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%) scale(0);
      opacity: 1;
    `;
    
    document.body.appendChild(ring);
    
    ring.animate([
      { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
      { transform: 'translate(-50%, -50%) scale(15)', opacity: 0 }
    ], {
      duration: 1500,
      easing: 'ease-out'
    }).addEventListener('finish', () => {
      ring.remove();
    });
  }

  /**
   * Subtle Consciousness Pulse
   */
  subtleConsciousnessPulse(symbol) {
    symbol.animate([
      { opacity: 1, transform: 'scale(1)' },
      { opacity: 0.8, transform: 'scale(1.02)' },
      { opacity: 1, transform: 'scale(1)' }
    ], {
      duration: 1500,
      easing: 'ease-in-out'
    });
  }

  /**
   * Sacred Geometry System
   */
  setupSacredGeometry() {
    // Add geometric patterns to background
    this.createSacredGeometryBackground();
    
    // Enhance cards with geometric effects
    document.querySelectorAll('.purpose-card, .component-card, .nav-card').forEach(card => {
      this.addGeometricEnhancement(card);
    });
  }

  /**
   * Create Sacred Geometry Background
   */
  createSacredGeometryBackground() {
    const canvas = document.createElement('canvas');
    canvas.className = 'sacred-geometry-canvas';
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -2;
      opacity: 0.1;
    `;
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.drawSacredGeometry(ctx, canvas.width, canvas.height);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Animate the geometry
    let rotation = 0;
    const animate = () => {
      rotation += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawSacredGeometry(ctx, canvas.width, canvas.height, rotation);
      requestAnimationFrame(animate);
    };
    animate();
  }

  /**
   * Draw Sacred Geometry
   */
  drawSacredGeometry(ctx, width, height, rotation = 0) {
    const centerX = width / 2;
    const centerY = height / 2;
    
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
    ctx.lineWidth = 1;
    
    // Draw Flower of Life pattern
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 + rotation;
      const x = centerX + Math.cos(angle) * 100;
      const y = centerY + Math.sin(angle) * 100;
      
      ctx.beginPath();
      ctx.arc(x, y, 50, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Central circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
    ctx.stroke();
    
    // Add golden ratio spirals
    ctx.strokeStyle = 'rgba(233, 69, 96, 0.2)';
    this.drawGoldenSpiral(ctx, centerX - 200, centerY - 200, rotation);
    this.drawGoldenSpiral(ctx, centerX + 200, centerY + 200, rotation + Math.PI);
  }

  /**
   * Draw Golden Spiral
   */
  drawGoldenSpiral(ctx, startX, startY, rotation) {
    ctx.save();
    ctx.translate(startX, startY);
    ctx.rotate(rotation);
    
    ctx.beginPath();
    const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
    
    for (let i = 0; i < 100; i++) {
      const angle = i * 0.1;
      const radius = Math.pow(phi, angle * 0.1) * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Add Geometric Enhancement to Cards
   */
  addGeometricEnhancement(card) {
    card.addEventListener('mouseenter', () => {
      this.activateCardGeometry(card);
    });
    
    card.addEventListener('mouseleave', () => {
      this.deactivateCardGeometry(card);
    });
  }

  /**
   * Activate Card Geometry
   */
  activateCardGeometry(card) {
    const geometryOverlay = document.createElement('div');
    geometryOverlay.className = 'geometry-overlay';
    geometryOverlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      opacity: 0;
      background: 
        radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(233, 69, 96, 0.1) 0%, transparent 50%);
      border-radius: inherit;
    `;
    
    card.style.position = 'relative';
    card.appendChild(geometryOverlay);
    
    geometryOverlay.animate([
      { opacity: 0, transform: 'scale(0.8)' },
      { opacity: 1, transform: 'scale(1)' }
    ], {
      duration: 300,
      easing: 'ease-out',
      fill: 'forwards'
    });
  }

  /**
   * Deactivate Card Geometry
   */
  deactivateCardGeometry(card) {
    const overlay = card.querySelector('.geometry-overlay');
    if (overlay) {
      overlay.animate([
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(1.2)' }
      ], {
        duration: 300,
        easing: 'ease-in'
      }).addEventListener('finish', () => {
        overlay.remove();
      });
    }
  }

  /**
   * Mythic Text Enhancement
   */
  setupMythicText() {
    // Add typewriter effect to important quotes
    document.querySelectorAll('.quote-text, .mission-text').forEach(element => {
      this.addTypewriterEffect(element);
    });
    
    // Add text reveal animations
    document.querySelectorAll('.lead-paragraph').forEach(element => {
      this.addTextRevealEffect(element);
    });
  }

  /**
   * Add Typewriter Effect
   */
  addTypewriterEffect(element) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.typewriterAnimation(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(element);
  }

  /**
   * Typewriter Animation
   */
  typewriterAnimation(element) {
    const text = element.textContent;
    element.textContent = '';
    element.style.opacity = '1';
    
    let i = 0;
    const typeInterval = setInterval(() => {
      element.textContent += text[i];
      i++;
      
      if (i >= text.length) {
        clearInterval(typeInterval);
        element.classList.add('typewriter-complete');
      }
    }, 50);
  }

  /**
   * Add Text Reveal Effect
   */
  addTextRevealEffect(element) {
    const words = element.textContent.split(' ');
    element.innerHTML = words.map(word => 
      `<span class="word-reveal" style="opacity: 0; transform: translateY(20px);">${word}</span>`
    ).join(' ');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateWordReveal(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(element);
  }

  /**
   * Animate Word Reveal
   */
  animateWordReveal(element) {
    const words = element.querySelectorAll('.word-reveal');
    
    words.forEach((word, index) => {
      setTimeout(() => {
        word.animate([
          { opacity: 0, transform: 'translateY(20px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], {
          duration: 600,
          easing: 'ease-out',
          fill: 'forwards'
        });
      }, index * 100);
    });
  }

  /**
   * Transcendent Effects
   */
  setupTranscendentEffects() {
    // Add aurora effect to hero section
    this.createAuroraEffect();
    
    // Add particle systems to sections
    this.setupParticleSystems();
  }

  /**
   * Create Aurora Effect
   */
  createAuroraEffect() {
    const hero = document.querySelector('.sacred-hero');
    if (!hero) return;
    
    const aurora = document.createElement('div');
    aurora.className = 'aurora-effect';
    aurora.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        45deg,
        rgba(139, 92, 246, 0.1) 0%,
        transparent 25%,
        rgba(233, 69, 96, 0.1) 50%,
        transparent 75%,
        rgba(16, 185, 129, 0.1) 100%
      );
      background-size: 200% 200%;
      animation: auroraFlow 10s ease-in-out infinite;
      pointer-events: none;
      z-index: -1;
    `;
    
    hero.appendChild(aurora);
    
    // Add aurora animation if not exists
    if (!document.querySelector('#aurora-styles')) {
      const style = document.createElement('style');
      style.id = 'aurora-styles';
      style.textContent = `
        @keyframes auroraFlow {
          0%, 100% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Setup Particle Systems
   */
  setupParticleSystems() {
    document.querySelectorAll('.foundation-section').forEach((section, index) => {
      if (index % 2 === 0) { // Add particles to every other section
        this.addSectionParticles(section);
      }
    });
  }

  /**
   * Add Section Particles
   */
  addSectionParticles(section) {
    const particleCount = 5;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'section-particle';
      particle.style.cssText = `
        position: absolute;
        width: 3px;
        height: 3px;
        background: var(--infinite-purple);
        border-radius: 50%;
        pointer-events: none;
        opacity: 0;
        z-index: -1;
      `;
      
      section.style.position = 'relative';
      section.appendChild(particle);
      
      this.animateSectionParticle(particle, section);
    }
  }

  /**
   * Animate Section Particle
   */
  animateSectionParticle(particle, container) {
    const animate = () => {
      const startX = Math.random() * container.offsetWidth;
      const startY = container.offsetHeight;
      const endX = Math.random() * container.offsetWidth;
      const endY = -50;
      
      particle.style.left = startX + 'px';
      particle.style.top = startY + 'px';
      
      particle.animate([
        { 
          opacity: 0, 
          transform: 'translateY(0) scale(0)',
          filter: 'hue-rotate(0deg)'
        },
        { 
          opacity: 0.7, 
          transform: 'translateY(-50px) scale(1)',
          filter: 'hue-rotate(90deg)',
          offset: 0.3
        },
        { 
          opacity: 0.3, 
          transform: `translateY(${endY - startY}px) scale(1.5)`,
          filter: 'hue-rotate(180deg)',
          offset: 0.7
        },
        { 
          opacity: 0, 
          transform: `translateY(${endY - startY}px) scale(0)`,
          filter: 'hue-rotate(270deg)'
        }
      ], {
        duration: 8000 + Math.random() * 4000,
        easing: 'ease-out'
      }).addEventListener('finish', () => {
        setTimeout(animate, Math.random() * 2000);
      });
    };
    
    // Start with a random delay
    setTimeout(animate, Math.random() * 3000);
  }

  /**
   * Bind Advanced Interactions
   */
  bindAdvancedInteractions() {
    // Add consciousness resonance to form inputs
    document.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('focus', () => {
        this.enhanceFormInput(input);
      });
    });
    
    // Add sacred geometry to buttons
    document.querySelectorAll('.sacred-button').forEach(button => {
      button.addEventListener('mouseenter', () => {
        this.addButtonGeometry(button);
      });
    });
  }

  /**
   * Enhance Form Input
   */
  enhanceFormInput(input) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, var(--infinite-purple), var(--transcendent-gold));
      border-radius: inherit;
      z-index: -1;
      opacity: 0;
      pointer-events: none;
    `;
    
    input.style.position = 'relative';
    input.parentElement.appendChild(glow);
    
    glow.animate([
      { opacity: 0 },
      { opacity: 0.3 }
    ], {
      duration: 300,
      fill: 'forwards'
    });
    
    input.addEventListener('blur', () => {
      glow.animate([
        { opacity: 0.3 },
        { opacity: 0 }
      ], {
        duration: 300
      }).addEventListener('finish', () => {
        glow.remove();
      });
    }, { once: true });
  }

  /**
   * Add Button Geometry
   */
  addButtonGeometry(button) {
    // Add a subtle geometric pattern overlay
    const pattern = document.createElement('div');
    pattern.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%);
      border-radius: inherit;
      pointer-events: none;
      opacity: 0;
    `;
    
    button.appendChild(pattern);
    
    pattern.animate([
      { opacity: 0, transform: 'scale(0)' },
      { opacity: 1, transform: 'scale(1)' }
    ], {
      duration: 300,
      easing: 'ease-out'
    });
    
    button.addEventListener('mouseleave', () => {
      pattern.animate([
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(1.2)' }
      ], {
        duration: 300
      }).addEventListener('finish', () => {
        pattern.remove();
      });
    }, { once: true });
  }
}

// Initialize Sacred Interactions
document.addEventListener('DOMContentLoaded', () => {
  try {
    window.sacredInteractions = new SacredInteractions();
  } catch (error) {
    console.error('Failed to initialize Sacred Interactions:', error);
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SacredInteractions;
}
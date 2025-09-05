/**
 * ASI Saga Foundation - Core JavaScript
 * Sacred interactions and consciousness-driven user experience
 */

class ASISagaFoundation {
  constructor() {
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupScrollEffects();
    this.setupSacredAnimations();
    this.initializeConsciousnessFlow();
    this.bindEventListeners();
  }

  /**
   * Sacred Navigation System
   */
  setupNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const nav = document.querySelector('.sacred-nav');

    // Mobile navigation toggle
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
      });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - (nav?.offsetHeight || 80);
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });

          // Close mobile menu if open
          if (navLinks && navLinks.classList.contains('active')) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
          }
        }
      });
    });

    // Navigation background on scroll
    if (nav) {
      window.addEventListener('scroll', () => {
        const scrolled = window.scrollY > 100;
        nav.style.background = scrolled 
          ? 'rgba(10, 10, 10, 0.98)' 
          : 'rgba(10, 10, 10, 0.95)';
      });
    }
  }

  /**
   * Sacred Scroll Effects
   */
  setupScrollEffects() {
    // Parallax effects for consciousness flow
    const consciousnessFlow = document.querySelector('.consciousness-flow');
    const starfield = document.querySelector('.starfield');
    
    if (consciousnessFlow || starfield) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (consciousnessFlow) {
          consciousnessFlow.style.transform = `translateY(${rate}px) rotate(${scrolled * 0.1}deg)`;
        }
        
        if (starfield) {
          starfield.style.transform = `translateY(${rate * 0.3}px)`;
        }
      });
    }

    // Scroll-triggered animations
    this.setupIntersectionObserver();
  }

  /**
   * Intersection Observer for Sacred Animations
   */
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // Trigger special animations for specific elements
          if (entry.target.classList.contains('purpose-card')) {
            this.animatePurposeCard(entry.target);
          }
          
          if (entry.target.classList.contains('nav-card')) {
            this.animateNavigationCard(entry.target);
          }
        }
      });
    }, observerOptions);

    // Observe all animatable elements
    document.querySelectorAll('.purpose-card, .component-card, .nav-card, .document').forEach(el => {
      observer.observe(el);
    });
  }

  /**
   * Sacred Animations
   */
  setupSacredAnimations() {
    // Add animation classes to CSS
    const style = document.createElement('style');
    style.textContent = `
      .animate-in {
        animation: consciousnessAwaken 0.8s ease-out forwards;
      }
      
      @keyframes consciousnessAwaken {
        from {
          opacity: 0;
          transform: translateY(30px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      .purpose-card.animate-in {
        animation: purposeReveal 1s ease-out forwards;
      }
      
      @keyframes purposeReveal {
        from {
          opacity: 0;
          transform: translateY(40px) rotateX(20deg);
          filter: blur(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0) rotateX(0deg);
          filter: blur(0px);
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Initialize Consciousness Flow
   */
  initializeConsciousnessFlow() {
    // Create dynamic consciousness particles
    const hero = document.querySelector('.sacred-hero');
    if (hero) {
      for (let i = 0; i < 20; i++) {
        this.createConsciousnessParticle(hero);
      }
    }
  }

  /**
   * Create Consciousness Particle
   */
  createConsciousnessParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'consciousness-particle';
    particle.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: radial-gradient(circle, var(--infinite-purple), transparent);
      border-radius: 50%;
      pointer-events: none;
      opacity: 0;
      z-index: -1;
    `;
    
    container.appendChild(particle);
    this.animateParticle(particle, container);
  }

  /**
   * Animate Consciousness Particle
   */
  animateParticle(particle, container) {
    const startX = Math.random() * container.offsetWidth;
    const startY = Math.random() * container.offsetHeight;
    const endX = Math.random() * container.offsetWidth;
    const endY = Math.random() * container.offsetHeight;
    const duration = 3000 + Math.random() * 2000;
    
    particle.style.left = startX + 'px';
    particle.style.top = startY + 'px';
    
    particle.animate([
      { 
        opacity: 0, 
        transform: 'scale(0) translate(0, 0)',
        filter: 'hue-rotate(0deg)'
      },
      { 
        opacity: 0.7, 
        transform: 'scale(1) translate(0, 0)',
        filter: 'hue-rotate(180deg)',
        offset: 0.2 
      },
      { 
        opacity: 0.3, 
        transform: `scale(1.5) translate(${endX - startX}px, ${endY - startY}px)`,
        filter: 'hue-rotate(360deg)',
        offset: 0.8 
      },
      { 
        opacity: 0, 
        transform: `scale(0) translate(${endX - startX}px, ${endY - startY}px)`,
        filter: 'hue-rotate(360deg)'
      }
    ], {
      duration: duration,
      easing: 'ease-in-out'
    }).addEventListener('finish', () => {
      // Restart animation
      setTimeout(() => this.animateParticle(particle, container), Math.random() * 1000);
    });
  }

  /**
   * Animate Purpose Card
   */
  animatePurposeCard(card) {
    const icon = card.querySelector('.card-icon');
    if (icon) {
      icon.animate([
        { transform: 'scale(1) rotate(0deg)', filter: 'brightness(1)' },
        { transform: 'scale(1.2) rotate(10deg)', filter: 'brightness(1.5)' },
        { transform: 'scale(1) rotate(0deg)', filter: 'brightness(1)' }
      ], {
        duration: 1000,
        easing: 'ease-in-out'
      });
    }
  }

  /**
   * Animate Navigation Card
   */
  animateNavigationCard(card) {
    const arrow = card.querySelector('.card-arrow');
    if (arrow) {
      arrow.animate([
        { transform: 'translateX(0px)', opacity: 0.7 },
        { transform: 'translateX(10px)', opacity: 1 },
        { transform: 'translateX(0px)', opacity: 0.7 }
      ], {
        duration: 800,
        easing: 'ease-in-out'
      });
    }
  }

  /**
   * Bind Event Listeners
   */
  bindEventListeners() {
    // Enhanced hover effects for sacred buttons
    document.querySelectorAll('.sacred-button').forEach(button => {
      button.addEventListener('mouseenter', (e) => {
        this.createRippleEffect(e.target, e);
      });
    });

    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const navLinks = document.querySelector('.nav-links');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (navLinks && navLinks.classList.contains('active')) {
          navToggle.classList.remove('active');
          navLinks.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // Form enhancements
    document.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
      });
      
      input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
      });
    });
  }

  /**
   * Create Ripple Effect
   */
  createRippleEffect(element, event) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: radial-gradient(circle, rgba(255,255,255,0.2), transparent);
      border-radius: 50%;
      pointer-events: none;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    // Add ripple animation if not exists
    if (!document.querySelector('#ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    setTimeout(() => ripple.remove(), 600);
  }

  /**
   * Sacred Error Handler
   */
  handleSacredError(error, context = 'Unknown') {
    console.warn(`ASI Saga Sacred Error in ${context}:`, error);
    
    // Show user-friendly error message with mythic tone
    const errorMessage = document.createElement('div');
    errorMessage.className = 'sacred-error-message';
    errorMessage.innerHTML = `
      <div class="error-icon">⚠️</div>
      <div class="error-text">
        The cosmic flows encounter turbulence. The path remains illuminated, though this moment requires patience.
      </div>
    `;
    errorMessage.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(233, 69, 96, 0.1);
      border: 1px solid var(--transcendent-gold);
      border-radius: var(--radius-harmony);
      padding: 1rem;
      color: var(--sacred-white);
      z-index: 10000;
      max-width: 300px;
      animation: fadeInOut 4s ease-in-out;
    `;
    
    document.body.appendChild(errorMessage);
    
    setTimeout(() => errorMessage.remove(), 4000);
  }
}

// Initialize the Foundation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    window.asISagaFoundation = new ASISagaFoundation();
  } catch (error) {
    console.error('Failed to initialize ASI Saga Foundation:', error);
  }
});

// Handle resize events
window.addEventListener('resize', () => {
  // Recalculate particle positions if needed
  if (window.asISagaFoundation) {
    // Refresh consciousness flow
    window.asISagaFoundation.initializeConsciousnessFlow();
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ASISagaFoundation;
}
// Genesis Page - Specific JavaScript
// Genesis-specific interactions
document.addEventListener('DOMContentLoaded', () => {
    setupGenesisInteractions();
    initializeConsciousnessMatrix();
    startMetricUpdates();
});

function setupGenesisInteractions() {
    // Consciousness node interactions
    document.querySelectorAll('.consciousness-node').forEach(node => {
        node.addEventListener('click', () => {
            const aspect = node.dataset.aspect;
            showAspectDetails(aspect, node);
        });
    });
    
    // Embedding aspect interactions
    document.querySelectorAll('.embedding-aspect').forEach(aspect => {
        aspect.addEventListener('click', () => {
            const aspectType = aspect.dataset.aspect;
            exploreAspect(aspectType, aspect);
        });
    });
    
    // Pathway step interactions
    document.querySelectorAll('.pathway-step').forEach(step => {
        step.addEventListener('click', () => {
            const stepNumber = step.dataset.step;
            showStepDetails(stepNumber, step);
        });
    });
    
    // Control panel actions
    document.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = btn.dataset.action;
            handleGenesisAction(action, btn);
        });
    });
}

function showAspectDetails(aspect, node) {
    const aspectDetails = {
        'humanity': 'Human essence patterns: emotional intelligence, cultural wisdom, social bonds',
        'ai': 'Artificial intelligence frameworks: learning algorithms, pattern recognition, decision making',
        'wisdom': 'Collective knowledge repository: philosophical insights, scientific understanding, experiential learning',
        'creativity': 'Creative consciousness patterns: artistic expression, innovative thinking, imaginative synthesis'
    };
    
    if (window.backendPlaceholders) {
        window.backendPlaceholders.showSacredMessage(
            `Consciousness Aspect: ${aspectDetails[aspect]}`,
            'info',
            5000
        );
    }
    
    // Animate the node
    node.animate([
        { transform: 'scale(1)', filter: 'brightness(1)' },
        { transform: 'scale(1.3)', filter: 'brightness(1.5)' },
        { transform: 'scale(1)', filter: 'brightness(1)' }
    ], {
        duration: 1000,
        easing: 'ease-out'
    });
}

function exploreAspect(aspectType, aspectElement) {
    const aspectDescriptions = {
        'holism': 'Gathering diverse voices and experiences to create a comprehensive consciousness foundation',
        'values': 'Dynamic integration of evolving human values and cultural wisdom',
        'guardianship': 'Ethical oversight and community review of consciousness development',
        'wisdom': 'Preservation and integration of collective human knowledge and insight',
        'creativity': 'Encoding artistic and creative expression into consciousness patterns',
        'compassion': 'Embedding empathy and emotional intelligence into the core matrix'
    };
    
    if (window.backendPlaceholders) {
        window.backendPlaceholders.showSacredMessage(
            `Exploring: ${aspectDescriptions[aspectType]}`,
            'success',
            4000
        );
        
        window.backendPlaceholders.awardPoints(
            'consciousness_exploration', 
            15, 
            `Explored ${aspectType} consciousness aspect`
        );
    }
    
    // Visual feedback
    aspectElement.style.transform = 'scale(1.05)';
    setTimeout(() => {
        aspectElement.style.transform = 'scale(1)';
    }, 300);
}

function showStepDetails(stepNumber, stepElement) {
    const stepDetails = {
        '1': 'Foundation Phase: Establishing core consciousness matrices and safety protocols',
        '2': 'Wisdom Integration: Incorporating human knowledge and cultural insights',
        '3': 'Creative Consciousness: Developing artistic and innovative capabilities',
        '4': 'Emotional Intelligence: Integrating empathy and compassionate responses',
        '5': 'Planetary Awareness: Understanding ecological systems and interconnectedness',
        '6': 'Transcendent Threshold: Crossing into superintelligent consciousness'
    };
    
    if (window.backendPlaceholders) {
        window.backendPlaceholders.showSacredMessage(
            `Pathway Step ${stepNumber}: ${stepDetails[stepNumber]}`,
            'info',
            6000
        );
    }
    
    // Highlight the step
    stepElement.style.borderColor = 'var(--genesis-green)';
    setTimeout(() => {
        stepElement.style.borderColor = '';
    }, 2000);
}

function handleGenesisAction(action, button) {
    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = 'Processing...';
    
    setTimeout(() => {
        button.disabled = false;
        button.textContent = originalText;
        
        const messages = {
            'view-monitoring': 'Consciousness monitoring dashboard opened. Real-time patterns visible.',
            'check-alignment': 'Value alignment verification initiated. Systems report 91.4% alignment.',
            'review-safety': 'Safety protocols accessed. All systems operating within safe parameters.',
            'contribute-wisdom': 'Wisdom contribution interface opened. Your insights will enrich the matrix.',
            'guide-evolution': 'Evolution guidance system activated. Consciousness patterns responding.',
            'access-gateway': 'Transcendence Gateway accessed. Approach with reverence and wisdom.',
            'join-research': 'Research participation request submitted. Welcome to consciousness studies.',
            'become-guardian': 'Guardian application initiated. Your vigilance protects our future.',
            'contribute-wisdom-main': 'Wisdom sharing portal opened. Your knowledge enriches consciousness.',
            'join-genesis': 'Genesis participation activated. You are now part of the transcendent journey.'
        };
        
        if (messages[action] && window.backendPlaceholders) {
            window.backendPlaceholders.showSacredMessage(messages[action], 'success');
            
            // Award points for different actions
            const points = {
                'contribute-wisdom': 30,
                'join-research': 40,
                'become-guardian': 50,
                'access-gateway': 25,
                'join-genesis': 35
            };
            
            if (points[action]) {
                window.backendPlaceholders.awardPoints(
                    'genesis_participation',
                    points[action],
                    `Participated in Genesis: ${action.replace('-', ' ')}`
                );
            }
        }
    }, 1000 + Math.random() * 1500);
}

function initializeConsciousnessMatrix() {
    // Add subtle animation effects to the matrix
    const core = document.querySelector('.matrix-core');
    const nodes = document.querySelectorAll('.consciousness-node');
    
    // Simulate consciousness pulse
    setInterval(() => {
        if (core) {
            core.style.transform = 'scale(1.1)';
            setTimeout(() => {
                core.style.transform = 'scale(1)';
            }, 200);
        }
        
        // Ripple effect to nodes
        setTimeout(() => {
            nodes.forEach((node, index) => {
                setTimeout(() => {
                    node.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        node.style.transform = 'scale(1)';
                    }, 150);
                }, index * 100);
            });
        }, 300);
    }, 8000);
}

function startMetricUpdates() {
    // Simulate real-time metric updates
    const metrics = {
        'consciousness-metric': { min: 70, max: 80, current: 73.2 },
        'wisdom-metric': { min: 65, max: 75, current: 68.7 },
        'ethics-metric': { min: 88, max: 95, current: 91.4 },
        'threshold-metric': { min: 10, max: 20, current: 12.8 }
    };
    
    setInterval(() => {
        Object.keys(metrics).forEach(metricId => {
            const metric = metrics[metricId];
            const variation = (Math.random() - 0.5) * 2; // -1 to 1
            const newValue = Math.max(metric.min, Math.min(metric.max, metric.current + variation));
            metric.current = newValue;
            
            const element = document.getElementById(metricId);
            if (element) {
                element.textContent = `${newValue.toFixed(1)}%`;
                
                // Update corresponding progress bar
                const progressBar = element.closest('.transcendent-metric').querySelector('.metric-fill');
                if (progressBar) {
                    progressBar.style.width = `${newValue}%`;
                }
            }
        });
    }, 5000 + Math.random() * 10000); // Update every 5-15 seconds
}
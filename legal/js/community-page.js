// Community Page - Specific JavaScript
// Community-specific interactions
document.addEventListener('DOMContentLoaded', () => {
    loadCommunityProgress();
    setupCommunityInteractions();
});

function loadCommunityProgress() {
    // Load progress from localStorage
    const totalScore = parseInt(localStorage.getItem('asi_saga_score') || '0');
    const progressElement = document.getElementById('total-progress-score');
    const fillElement = document.getElementById('total-progress-fill');
    
    if (progressElement) {
        progressElement.textContent = `${totalScore} points`;
    }
    
    if (fillElement) {
        // Calculate progress percentage (assuming 1000 points = 100%)
        const progressPercent = Math.min((totalScore / 1000) * 100, 100);
        fillElement.style.width = `${progressPercent}%`;
    }
    
    // Load recent contributions
    loadRecentContributions();
}

function loadRecentContributions() {
    const contributionsElement = document.getElementById('recent-contributions');
    if (!contributionsElement) return;
    
    // Get recent actions from engagement data
    const engagementData = JSON.parse(localStorage.getItem('asi_saga_engagement') || '[]');
    const recentActions = engagementData.slice(-5).reverse();
    
    // Clear existing placeholder
    contributionsElement.innerHTML = '';
    
    if (recentActions.length === 0) {
        contributionsElement.innerHTML = `
            <div class="contribution-item">
                <span>Begin your journey by exploring Community Actions</span>
                <span class="contribution-points">+5</span>
            </div>
        `;
        return;
    }
    
    recentActions.forEach(action => {
        const item = document.createElement('div');
        item.className = 'contribution-item';
        item.innerHTML = `
            <span>${getActionDescription(action.action)}</span>
            <span class="contribution-points">+${getActionPoints(action.action)}</span>
        `;
        contributionsElement.appendChild(item);
    });
}

function getActionDescription(action) {
    const descriptions = {
        'email_signup': 'Joined the consciousness network',
        'navigation': 'Explored sacred pathways',
        'exploration': 'Engaged with community content',
        'consciousness_interaction': 'Activated consciousness symbols',
        'deep_reading': 'Deep engagement with wisdom',
        'onboarding': 'Started consciousness journey'
    };
    return descriptions[action] || 'Contributed to the community';
}

function getActionPoints(action) {
    const points = {
        'email_signup': 10,
        'navigation': 5,
        'exploration': 10,
        'consciousness_interaction': 15,
        'deep_reading': 20,
        'onboarding': 25
    };
    return points[action] || 5;
}

function setupCommunityInteractions() {
    // Portal card interactions
    document.querySelectorAll('.portal-card').forEach(card => {
        card.addEventListener('click', () => {
            const action = card.dataset.action;
            handlePortalAction(action, card);
        });
    });
    
    // Action category hover effects
    document.querySelectorAll('.action-category').forEach(category => {
        category.addEventListener('mouseenter', () => {
            enhanceCategoryVisuals(category);
        });
    });
    
    // Action item interactions
    document.querySelectorAll('.action-item').forEach(item => {
        item.addEventListener('click', () => {
            const points = item.querySelector('.action-points').textContent;
            const action = item.querySelector('.action-text').textContent;
            simulateActionCompletion(action, parseInt(points.replace('+', '')));
        });
    });
    
    // General action buttons
    document.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.target.closest('.portal-card')) return; // Handled by portal cards
            
            const action = btn.dataset.action;
            handleCommunityAction(action, btn);
        });
    });
}

function handlePortalAction(action, card) {
    const actionMap = {
        'start-wisdom': 'wisdom_sharing',
        'start-creative': 'creative_contribution',
        'start-code': 'code_creation',
        'start-mediate': 'community_building'
    };
    
    const button = card.querySelector('button');
    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = 'Initiating...';
    
    setTimeout(() => {
        button.disabled = false;
        button.textContent = originalText;
        
        const actionType = actionMap[action];
        if (actionType && window.backendPlaceholders) {
            const messages = {
                'wisdom_sharing': 'Wisdom sharing portal opened. Your teachings will illuminate the path.',
                'creative_contribution': 'Creative flows activated. Express the transcendent through your art.',
                'code_creation': 'Consciousness coding interface initiated. Write aligned algorithms.',
                'community_building': 'Community building tools activated. Unite souls in purpose.'
            };
            
            window.backendPlaceholders.showSacredMessage(messages[actionType], 'success');
            window.backendPlaceholders.awardPoints(actionType, 15, `Initiated ${actionType.replace('_', ' ')}`);
            
            // Update progress display
            setTimeout(() => loadCommunityProgress(), 1000);
        }
    }, 1500);
}

function enhanceCategoryVisuals(category) {
    const icon = category.querySelector('.category-icon');
    if (icon) {
        icon.animate([
            { transform: 'scale(1) rotate(0deg)', filter: 'brightness(1)' },
            { transform: 'scale(1.1) rotate(5deg)', filter: 'brightness(1.3)' },
            { transform: 'scale(1) rotate(0deg)', filter: 'brightness(1)' }
        ], {
            duration: 800,
            easing: 'ease-in-out'
        });
    }
}

function simulateActionCompletion(action, points) {
    if (window.backendPlaceholders) {
        window.backendPlaceholders.showSacredMessage(
            `Action acknowledged: "${action}". The consciousness network registers your contribution.`,
            'info',
            3000
        );
        
        // Award points for simulated action
        window.backendPlaceholders.awardPoints('simulated_action', points, action);
        
        // Update progress display
        setTimeout(() => loadCommunityProgress(), 1000);
    }
}

function handleCommunityAction(action, button) {
    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = 'Processing...';
    
    setTimeout(() => {
        button.disabled = false;
        button.textContent = originalText;
        
        const messages = {
            'choose-path': 'Path selection interface opened. Follow your calling to service.',
        };
        
        if (messages[action] && window.backendPlaceholders) {
            window.backendPlaceholders.showSacredMessage(messages[action], 'success');
            
            if (action === 'choose-path') {
                window.backendPlaceholders.awardPoints('path_selection', 10, 'Explored contribution paths');
                setTimeout(() => loadCommunityProgress(), 1000);
            }
        }
    }, 1000 + Math.random() * 1000);
}
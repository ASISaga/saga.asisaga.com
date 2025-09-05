// Governance Page - Specific JavaScript
// Governance-specific interactions
document.addEventListener('DOMContentLoaded', () => {
    // Proposal filtering
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Update active filter
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter proposals
            document.querySelectorAll('.proposal-card').forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Governance action handlers
    document.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = btn.dataset.action;
            handleGovernanceAction(action, btn);
        });
    });
});

function handleGovernanceAction(action, button) {
    // Simulate backend interaction
    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = 'Processing...';
    
    setTimeout(() => {
        button.disabled = false;
        button.textContent = originalText;
        
        // Show appropriate response
        const messages = {
            'vote': 'Your vote has been recorded in the consciousness ledger.',
            'create-proposal': 'Proposal creation interface opened.',
            'join-forum': 'Welcome to the Planetary Forum!',
            'become-participant': 'Participation level upgraded!',
            'seek-nomination': 'Nomination request submitted to the community.'
        };
        
        if (messages[action]) {
            if (window.backendPlaceholders) {
                window.backendPlaceholders.showSacredMessage(messages[action], 'success');
            }
        }
    }, 1000 + Math.random() * 1000);
}
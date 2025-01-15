document.addEventListener('DOMContentLoaded', () => {
    updateRewardDisplay();
});

function updateRewardDisplay() {
    const tutorialId = new URLSearchParams(window.location.search).get('stage');
    const isCompleted = localStorage.getItem(`tutorial_${tutorialId}_completed`) === 'true';
    
    if (isCompleted) {
        const rewardsContainer = document.querySelector('.rewards-container');
        const rewardsTitle = rewardsContainer.querySelector('.rewards-title');
        
        // Add "Acquired" text
        const acquiredText = document.createElement('div');
        acquiredText.className = 'acquired-text';
        acquiredText.textContent = 'Acquired';
        rewardsTitle.insertAdjacentElement('afterend', acquiredText);
        
        // Add completed style to rewards
        document.querySelectorAll('.reward-item').forEach(item => {
            item.classList.add('reward-acquired');
        });
    }
} 
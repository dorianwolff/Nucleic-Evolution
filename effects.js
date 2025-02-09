// Particle system for all pages
document.addEventListener('DOMContentLoaded', () => {
    // Create container for particles
    const particleContainer = document.createElement('div');
    particleContainer.style.position = 'fixed';
    particleContainer.style.top = '0';
    particleContainer.style.left = '0';
    particleContainer.style.width = '100%';
    particleContainer.style.height = '100%';
    particleContainer.style.pointerEvents = 'none';
    particleContainer.style.zIndex = '99999';
    document.body.appendChild(particleContainer);

    // Mouse trail effect (only on desktop)
    let mouseX = 0, mouseY = 0;
    const mouseMoveHandler = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (window.innerWidth > 768) {
            createMouseGlow(mouseX, mouseY);
            if (Math.random() < 0.3) createTrailParticle(mouseX, mouseY);
        }
    };
    document.addEventListener('mousemove', mouseMoveHandler);

    // Click effect (all screen sizes)
    document.addEventListener('click', (e) => {
        createClickBurst(e.clientX, e.clientY);
    });

    function createMouseGlow(x, y) {
        const glow = document.createElement('div');
        glow.className = 'mouse-glow';
        glow.style.left = `${x}px`;
        glow.style.top = `${y}px`;
        particleContainer.appendChild(glow);
        setTimeout(() => glow.remove(), 500);
    }

    function createTrailParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'mouse-trail-particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particleContainer.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }

    function createClickBurst(x, y) {
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'click-particle';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            const angle = (i / 12) * 360;
            const velocity = 2 + Math.random() * 2;
            particle.style.setProperty('--angle', angle + 'deg');
            particle.style.setProperty('--velocity', velocity);
            
            particleContainer.appendChild(particle);
            setTimeout(() => particle.remove(), 1000);
        }
    }
});

// Animation Queue System
const animationQueue = [];
let isAnimating = false;

function queueAnimation(element, animationClass, duration) {
    return new Promise((resolve) => {
        animationQueue.push({
            element,
            animationClass,
            duration,
            resolve
        });
        processAnimationQueue();
    });
}

async function processAnimationQueue() {
    if (isAnimating || animationQueue.length === 0) return;
    
    isAnimating = true;
    const { element, animationClass, duration, resolve } = animationQueue.shift();
    
    element.classList.add(animationClass);
    await new Promise(r => setTimeout(r, duration));
    element.classList.remove(animationClass);
    
    isAnimating = false;
    resolve();
    processAnimationQueue();
}

// Card Animation Functions
async function animateConfrontation(card1, card2) {
    // Create clash effect element
    const clashEffect = document.createElement('div');
    clashEffect.className = 'clash-effect';
    
    // Position clash effect between the two cards
    const card1Rect = card1.getBoundingClientRect();
    const card2Rect = card2.getBoundingClientRect();
    const clashX = (card1Rect.left + card2Rect.left) / 2;
    const clashY = (card1Rect.top + card2Rect.top) / 2;
    
    clashEffect.style.left = `${clashX}px`;
    clashEffect.style.top = `${clashY}px`;
    document.body.appendChild(clashEffect);

    // Animate cards clashing
    await Promise.all([
        queueAnimation(card1, 'confronting-left', 1000),
        queueAnimation(card2, 'confronting-right', 1000)
    ]);

    // Remove clash effect after animation
    setTimeout(() => clashEffect.remove(), 500);
}

function animateRawValueConfrontation(card) {
    const resourceCircle = card.querySelector('.resource-circle');
    const combatCircle = card.querySelector('.combat-circle');
    
    return Promise.all([
        queueAnimation(resourceCircle, 'metallic-circle', 1000),
        queueAnimation(combatCircle, 'metallic-circle', 1000)
    ]);
}

function animateResourceConfrontation(card) {
    const resourceCircle = card.querySelector('.resource-circle');
    return queueAnimation(resourceCircle, 'resource-confrontation', 1000);
}

function animateVictory(card, isPlayer) {
    // Get the AI glow class from the game state
    const aiGlowClass = window.gameState?.aiGlowClass || 'aura-red';
    card.classList.add('victory-glow', isPlayer ? 'aura-yellow' : aiGlowClass);
}

async function animateDefeat(card) {
    await queueAnimation(card, 'blood-effect', 1000);
    card.style.filter = 'grayscale(100%)';
    // Remove all animation classes except grayscale
    card.className = 'placed-card';
}

function animateNullification(card) {
    return queueAnimation(card, 'nullified', 500);
}

function animateAbilityActivation(card) {
    return queueAnimation(card, 'ability-active', 1000);
}

async function animateNullifiedAbility(card) {
    await animateAbilityActivation(card);
    await animateNullification(card);
}

function animateEffectSwitch(card) {
    return queueAnimation(card, 'effect-switch', 1000);
}

function animateResourceIncrease(card) {
    return queueAnimation(card, 'resource-increasing', 1000);
}

function animateResourceDecrease(card) {
    return queueAnimation(card, 'resource-decreasing', 1000);
}

function animateCombatIncrease(card) {
    return queueAnimation(card, 'combat-increasing', 1000);
}

function animateCombatDecrease(card) {
    return queueAnimation(card, 'combat-decreasing', 1000);
}

function animateTypeChange(card) {
    return queueAnimation(card, 'type-changing', 1000);
}

// Export animation functions
window.cardAnimations = {
    confrontation: animateConfrontation,
    rawValueConfrontation: animateRawValueConfrontation,
    resourceConfrontation: animateResourceConfrontation,
    victory: animateVictory,
    defeat: animateDefeat,
    nullification: animateNullification,
    abilityActivation: animateAbilityActivation,
    nullifiedAbility: animateNullifiedAbility,
    effectSwitch: animateEffectSwitch,
    resourceIncrease: animateResourceIncrease,
    resourceDecrease: animateResourceDecrease,
    combatIncrease: animateCombatIncrease,
    combatDecrease: animateCombatDecrease,
    typeChange: animateTypeChange
}; 
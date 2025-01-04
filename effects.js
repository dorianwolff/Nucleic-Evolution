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
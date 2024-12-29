function initializeNavbar() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const menuOverlay = document.querySelector('.menu-overlay');

    if (menuToggle && mobileNav && menuOverlay) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            mobileNav.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            menuToggle.textContent = mobileNav.classList.contains('active') ? '✕' : '☰';
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });

        menuOverlay.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            menuOverlay.classList.remove('active');
            menuToggle.textContent = '☰';
            document.body.style.overflow = '';
        });

        const mobileLinks = document.querySelectorAll('.mobile-nav .nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileNav.classList.remove('active');
                menuOverlay.classList.remove('active');
                menuToggle.textContent = '☰';
                document.body.style.overflow = '';
            });
        });
    }

    // Highlight active page
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
            if (window.innerWidth < 768) {
                link.style.backgroundColor = 'rgba(251, 191, 36, 0.2)';
                link.style.borderLeft = '4px solid #fbbf24';
            }
        }
    });
}

// Function to be called when navbar is loaded
function setupNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            navbarContainer.innerHTML = data;
            initializeNavbar();
            if (typeof updateCartCount === 'function') {
                updateCartCount();
            }
        });
} 
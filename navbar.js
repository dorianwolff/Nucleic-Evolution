function setupNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    
    // Remove any existing event listeners before fetching navbar
    cleanupNavbarListeners();
    
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            navbarContainer.innerHTML = data;
            initializeNavbar();
        })
        .catch(error => console.error('Error loading navbar:', error));
}

function cleanupNavbarListeners() {
    // Remove old elements and their listeners
    const oldMenuToggle = document.querySelector('.menu-toggle');
    const oldMenuOverlay = document.querySelector('.menu-overlay');
    const oldMobileNav = document.querySelector('.mobile-nav');
    
    if (oldMenuToggle) oldMenuToggle.remove();
    if (oldMenuOverlay) oldMenuOverlay.remove();
    if (oldMobileNav) oldMobileNav.remove();
}

function initializeNavbar() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const menuOverlay = document.querySelector('.menu-overlay');

    if (menuToggle && mobileNav && menuOverlay) {
        // Create new elements to ensure clean event listeners
        const newMenuToggle = menuToggle.cloneNode(true);
        const newMenuOverlay = menuOverlay.cloneNode(true);
        
        menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
        menuOverlay.parentNode.replaceChild(newMenuOverlay, menuOverlay);

        // Add click handler for menu toggle
        newMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            mobileNav.classList.toggle('active');
            newMenuOverlay.classList.toggle('active');
            this.textContent = mobileNav.classList.contains('active') ? '✕' : '☰';
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });

        // Add click handler for overlay
        newMenuOverlay.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            newMenuOverlay.classList.remove('active');
            newMenuToggle.textContent = '☰';
            document.body.style.overflow = '';
        });

        // Add click handlers for mobile nav links
        const mobileLinks = document.querySelectorAll('.mobile-nav .nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileNav.classList.remove('active');
                newMenuOverlay.classList.remove('active');
                newMenuToggle.textContent = '☰';
                document.body.style.overflow = '';
            });
        });
    }

    // Highlight active page
    highlightActiveLink();
    
    // Update cart count
    updateCartCount();
}

function highlightActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

// Add this CSS to the existing navbar styles
const navbarStyles = `
  /* ... existing navbar styles ... */
  
  .nav-link {
    position: relative;
  }

  #cart-count {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: #ef4444;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
  }
`;

// Update the existing updateCartCount function to be consistent
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCountElement = document.getElementById('cart-count');
  
  // Check if element exists before proceeding
  if (!cartCountElement) return;
  
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  if (itemCount <= 0) {
    cartCountElement.style.display = 'none'; // Hide completely when empty
    cartCountElement.textContent = ''; // Clear the text content
  } else {
    cartCountElement.style.display = 'flex'; // Show when there are items
    cartCountElement.textContent = itemCount > 9 ? '9+' : itemCount;
  }
} 
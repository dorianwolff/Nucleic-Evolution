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

    // Ensure cart notification is properly initialized
    updateCartCount();
    
    // Add event listener for storage changes to keep cart count in sync across pages
    window.addEventListener('storage', (e) => {
        if (e.key === 'cart') {
            updateCartCount();
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
document.addEventListener('DOMContentLoaded', () => {
    const cart = [];

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-product-id');
            addToCart(productId);
        });
    });

    function addToCart(productId) {
        // Find product by ID
        const product = products.find(p => p.id === parseInt(productId));
        if (product) {
            cart.push(product);
            displayCart();
            updateCartCount();
        }
    }

    function displayCart() {
        const cartItems = document.getElementById('cart-items');
        cartItems.innerHTML = '';

        cart.forEach((product, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'bg-white shadow-lg rounded-lg overflow-hidden';
            cartItem.innerHTML = `
                <img class="w-full h-56 object-cover object-center" src="${product.image}" alt="Product">
                <div class="p-4">
                    <h3 class="text-gray-900 font-bold text-xl">${product.name}</h3>
                    <p class="mt-2 text-gray-600">${product.description}</p>
                    <div class="flex justify-between items-center mt-4">
                        <span class="text-gray-900 font-bold">$${product.price.toFixed(2)}</span>
                        <button class="remove-from-cart text-red-600 hover:text-red-800" data-cart-index="${index}">Remove</button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });

        const removeFromCartButtons = document.querySelectorAll('.remove-from-cart');
        removeFromCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const cartIndex = button.getAttribute('data-cart-index');
                removeFromCart(cartIndex);
            });
        });
    }

    function removeFromCart(cartIndex) {
        cart.splice(cartIndex, 1);
        displayCart();
        updateCartCount();
    }

    function updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        const itemCount = cart.length;
        if (itemCount > 0) {
            cartCountElement.textContent = itemCount > 9 ? '9+' : itemCount;
            cartCountElement.classList.remove('hidden');
        } else {
            cartCountElement.classList.add('hidden');
        }
    }

    const products = [
        { id: 1, name: 'Tribe Pack 1', description: 'Description of the Tribe Pack 1', price: 20.00, image: 'https://source.unsplash.com/random/400x400?card-game' },
        // Add more products as needed
    ];
});

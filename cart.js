// Shopping cart management
let cart = [];

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(productId) {
    const product = getProductById(productId);
    if (!product || !isInStock(productId)) {
        alert('Sorry, this item is out of stock.');
        return false;
    }

    const cartItem = cart.find(item => item.productId === productId);
    
    if (cartItem) {
        // Check if we can add more
        if (cartItem.quantity >= product.stock) {
            alert('Sorry, no more items available in stock.');
            return false;
        }
        cartItem.quantity++;
    } else {
        cart.push({
            productId: productId,
            quantity: 1,
            price: product.price
        });
    }
    
    saveCart();
    updateCartDisplay();
    return true;
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    saveCart();
    updateCartDisplay();
}

// Update item quantity in cart
function updateCartQuantity(productId, newQuantity) {
    const product = getProductById(productId);
    const cartItem = cart.find(item => item.productId === productId);
    
    if (!cartItem) return false;
    
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return true;
    }
    
    if (newQuantity > product.stock) {
        alert('Sorry, only ' + product.stock + ' items available in stock.');
        return false;
    }
    
    cartItem.quantity = newQuantity;
    saveCart();
    updateCartDisplay();
    return true;
}

// Calculate cart total
function getCartTotal() {
    return cart.reduce((total, item) => {
        const product = getProductById(item.productId);
        return total + (product ? product.price * item.quantity : 0);
    }, 0);
}

// Get cart item count
function getCartItemCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Clear cart
function clearCart() {
    cart = [];
    saveCart();
    updateCartDisplay();
}

// Update cart display
function updateCartDisplay() {
    // Update cart count badge
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = getCartItemCount();
    }
    
    // Update cart modal content
    const cartItemsElement = document.getElementById('cart-items');
    if (cartItemsElement) {
        if (cart.length === 0) {
            cartItemsElement.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">Your cart is empty</p>';
        } else {
            cartItemsElement.innerHTML = cart.map(item => {
                const product = getProductById(item.productId);
                if (!product) return '';
                
                return `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h4>${product.name}</h4>
                            <p>$${product.price.toFixed(2)} each</p>
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="updateCartQuantity(${product.id}, ${item.quantity - 1})">-</button>
                                <span style="padding: 0 1rem;">Qty: ${item.quantity}</span>
                                <button class="quantity-btn" onclick="updateCartQuantity(${product.id}, ${item.quantity + 1})">+</button>
                            </div>
                        </div>
                        <div>
                            <p style="font-weight: 600; margin-bottom: 0.5rem;">$${(product.price * item.quantity).toFixed(2)}</p>
                            <button class="remove-btn" onclick="removeFromCart(${product.id})">Remove</button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
    
    // Update cart total
    const cartTotalElement = document.getElementById('cart-total');
    if (cartTotalElement) {
        cartTotalElement.textContent = getCartTotal().toFixed(2);
    }
    
    // Update checkout button state
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
    }
}

// Initialize cart on page load
loadCart();

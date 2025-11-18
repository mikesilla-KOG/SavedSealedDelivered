// Main application logic
document.addEventListener('DOMContentLoaded', function() {
    // Render products
    renderProducts();
    
    // Update cart display
    updateCartDisplay();
    
    // Setup event listeners
    setupEventListeners();
});

// Render products on the page
function renderProducts() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;
    
    productGrid.innerHTML = products.map(product => {
        const stockClass = product.stock === 0 ? 'out-of-stock' : product.stock <= 2 ? 'low-stock' : '';
        const stockText = product.stock === 0 ? 'Out of Stock' : 
                         product.stock <= 2 ? `Only ${product.stock} left!` : 
                         `${product.stock} in stock`;
        
        return `
            <div class="product-card" data-product-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description.substring(0, 80)}...</p>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="stock-info ${stockClass}">${stockText}</div>
                    <button class="add-to-cart-btn" 
                            data-product-id="${product.id}" 
                            ${product.stock === 0 ? 'disabled' : ''}>
                        ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // Add click listeners to product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('add-to-cart-btn')) {
                const productId = parseInt(this.dataset.productId);
                showProductDetail(productId);
            }
        });
    });
    
    // Add click listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = parseInt(this.dataset.productId);
            if (addToCart(productId)) {
                // Show success feedback
                this.textContent = 'Added!';
                this.style.background = '#27ae60';
                setTimeout(() => {
                    this.textContent = 'Add to Cart';
                    this.style.background = '';
                }, 1000);
            }
        });
    });
}

// Show product detail modal
function showProductDetail(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    const modal = document.getElementById('product-modal');
    const detailContent = document.getElementById('product-detail');
    
    const stockClass = product.stock === 0 ? 'out-of-stock' : product.stock <= 2 ? 'low-stock' : '';
    const stockText = product.stock === 0 ? 'Out of Stock' : 
                     product.stock <= 2 ? `Only ${product.stock} left!` : 
                     `${product.stock} in stock`;
    
    detailContent.innerHTML = `
        <div class="product-detail-content">
            <div>
                <img src="${product.image}" alt="${product.name}" class="product-detail-image">
            </div>
            <div class="product-detail-info">
                <h2>${product.name}</h2>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="stock-info ${stockClass}">${stockText}</div>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart-btn" 
                        onclick="addToCartFromDetail(${product.id})" 
                        ${product.stock === 0 ? 'disabled' : ''}>
                    ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Add to cart from detail modal
function addToCartFromDetail(productId) {
    if (addToCart(productId)) {
        document.getElementById('product-modal').style.display = 'none';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Cart button
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            document.getElementById('cart-modal').style.display = 'block';
        });
    }
    
    // Close buttons for modals
    const closeButtons = document.querySelectorAll('.close, .close-product');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Handle checkout
function handleCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Refresh products display (useful after stock updates)
function refreshProducts() {
    renderProducts();
    updateCartDisplay();
}

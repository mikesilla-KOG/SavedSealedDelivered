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
        
        const images = product.images || [product.image];
        const imageDotsHtml = images.length > 1 ? `
            <div class="product-image-dots">
                ${images.map((img, index) => `
                    <span class="image-dot ${index === 0 ? 'active' : ''}" 
                          onclick="changeProductCardImage(event, ${product.id}, ${index})"></span>
                `).join('')}
            </div>
        ` : '';
        
        const priceHtml = product.originalPrice ? `
            <div class="product-price">
                <span class="sale-badge">SALE</span>
                <span class="original-price">$${product.originalPrice.toFixed(2)}</span>
                <span class="sale-price">$${product.price.toFixed(2)}</span>
            </div>
        ` : `
            <div class="product-price">$${product.price.toFixed(2)}</div>
        `;
        
        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image-container">
                    <img src="${images[0]}" alt="${product.name}" class="product-image" loading="lazy" data-images='${JSON.stringify(images)}'>
                    ${imageDotsHtml}
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category || 'Jewelry'}</div>
                    <h3>${product.name}</h3>
                    <p>${product.description.substring(0, 90)}${product.description.length > 90 ? '…' : ''}</p>
                    ${priceHtml}
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
            if (!e.target.classList.contains('add-to-cart-btn') && 
                !e.target.classList.contains('image-dot')) {
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

// Change product card image
function changeProductCardImage(event, productId, imageIndex) {
    event.stopPropagation();
    const card = document.querySelector(`.product-card[data-product-id="${productId}"]`);
    if (!card) return;
    
    const img = card.querySelector('.product-image');
    const images = JSON.parse(img.dataset.images);
    img.src = images[imageIndex];
    
    // Update active dot
    const dots = card.querySelectorAll('.image-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === imageIndex);
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
    
    // Generate image gallery HTML
    const images = product.images || [product.image];
    const mainImage = images[0];
    const thumbnailsHtml = images.length > 1 ? `
        <div class="product-thumbnails">
            ${images.map((img, index) => `
                <img src="${img}" alt="${product.name}" class="product-thumbnail ${index === 0 ? 'active' : ''}" 
                     onclick="changeProductImage('${img}', this)">
            `).join('')}
        </div>
    ` : '';
    
    const priceHtml = product.originalPrice ? `
        <div class="product-price">
            <span class="sale-badge">SALE</span>
            <span class="original-price">$${product.originalPrice.toFixed(2)}</span>
            <span class="sale-price">$${product.price.toFixed(2)}</span>
        </div>
    ` : `
        <div class="product-price">$${product.price.toFixed(2)}</div>
    `;
    
    // Size selector for products with sizes
    const sizeSelector = product.sizes ? `
        <div class="size-selector">
            <label for="product-size">Select Size:</label>
            <select id="product-size" class="size-select">
                ${product.sizes.map(s => `
                    <option value="${s.size}" ${s.stock === 0 ? 'disabled' : ''}>
                        Size ${s.size} ${s.stock === 0 ? '(Out of Stock)' : `(${s.stock} available)`}
                    </option>
                `).join('')}
            </select>
        </div>
    ` : '';
    
    detailContent.innerHTML = `
        <div class="product-detail-content">
            <div class="product-images">
                <img src="${mainImage}" alt="${product.name}" class="product-detail-image" id="main-product-image">
                ${thumbnailsHtml}
            </div>
            <div class="product-detail-info">
                <h2>${product.name}</h2>
                ${priceHtml}
                <div class="stock-info ${stockClass}">${stockText}</div>
                <p class="product-description">${product.description}</p>
                ${sizeSelector}
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

// Change main product image
function changeProductImage(imageSrc, thumbnail) {
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
        mainImage.src = imageSrc;
        // Update active thumbnail
        document.querySelectorAll('.product-thumbnail').forEach(thumb => {
            thumb.classList.remove('active');
        });
        thumbnail.classList.add('active');
    }
}

// Add to cart from detail modal
function addToCartFromDetail(productId) {
    const product = getProductById(productId);
    let selectedSize = null;
    
    // Get selected size if product has sizes
    if (product.sizes) {
        const sizeSelect = document.getElementById('product-size');
        if (sizeSelect) {
            selectedSize = sizeSelect.value;
        }
    }
    
    if (addToCart(productId, selectedSize)) {
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

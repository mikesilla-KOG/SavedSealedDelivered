// Initialize Stripe (Replace 'your_publishable_key_here' with your actual Stripe publishable key)
// For demo purposes, using a test key placeholder
const stripe = Stripe('pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE');
const elements = stripe.elements();

// Create card element
const cardElement = elements.create('card', {
    style: {
        base: {
            fontSize: '16px',
            color: '#32325d',
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#c0392b'
        }
    }
});

// Mount card element
cardElement.mount('#card-element');

// Handle real-time validation errors
cardElement.on('change', function(event) {
    const displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
    } else {
        displayError.textContent = '';
    }
});

// Load and display cart items
function displayOrderSummary() {
    const orderItemsContainer = document.getElementById('order-items');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<p style="text-align: center; color: #666;">Your cart is empty. <a href="index.html">Continue shopping</a></p>';
        document.getElementById('submit-payment').disabled = true;
        return;
    }
    
    orderItemsContainer.innerHTML = cart.map(item => {
        const product = getProductById(item.productId);
        if (!product) return '';
        
        return `
            <div class="order-item">
                <span>${product.name} × ${item.quantity}</span>
                <span>$${(product.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    }).join('');
    
    const total = getCartTotal();
    subtotalElement.textContent = '$' + total.toFixed(2);
    totalElement.textContent = '$' + total.toFixed(2);
}

// Handle form submission
document.getElementById('submit-payment').addEventListener('click', async function(e) {
    e.preventDefault();
    
    // Validate form
    const form = document.getElementById('checkout-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Check if cart is empty
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Show loading state
    document.getElementById('loading').style.display = 'block';
    document.getElementById('submit-payment').disabled = true;
    
    // Get form data
    const shippingInfo = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zip: document.getElementById('zip').value,
        phone: document.getElementById('phone').value
    };
    
    try {
        // In a real implementation, you would:
        // 1. Send order details to your backend server
        // 2. Backend creates a Stripe PaymentIntent
        // 3. Backend returns the client_secret
        // 4. Use stripe.confirmCardPayment with the client_secret
        
        // For demo purposes, we'll simulate a successful payment
        setTimeout(() => {
            // Simulate payment processing
            processOrder(shippingInfo);
        }, 2000);
        
        // Real Stripe implementation would look like this:
        /*
        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: getCartTotal() * 100, // Stripe uses cents
                currency: 'usd',
                cart: cart,
                shipping: shippingInfo
            })
        });
        
        const { clientSecret } = await response.json();
        
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
                    email: shippingInfo.email,
                    address: {
                        line1: shippingInfo.address,
                        city: shippingInfo.city,
                        state: shippingInfo.state,
                        postal_code: shippingInfo.zip
                    }
                }
            }
        });
        
        if (result.error) {
            throw new Error(result.error.message);
        }
        
        processOrder(shippingInfo, result.paymentIntent.id);
        */
        
    } catch (error) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('submit-payment').disabled = false;
        document.getElementById('card-errors').textContent = error.message;
    }
});

// Process order after successful payment
function processOrder(shippingInfo, paymentIntentId = 'demo_' + Date.now()) {
    // Update inventory
    cart.forEach(item => {
        decreaseStock(item.productId, item.quantity);
    });
    
    // Save order to localStorage (in real app, this would go to your database)
    const order = {
        orderId: paymentIntentId,
        date: new Date().toISOString(),
        items: cart.map(item => ({
            product: getProductById(item.productId),
            quantity: item.quantity
        })),
        shipping: shippingInfo,
        total: getCartTotal()
    };
    
    // Save to order history
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    clearCart();
    
    // Show success message
    document.getElementById('loading').style.display = 'none';
    document.getElementById('success-message').style.display = 'block';
    document.getElementById('checkout-form').style.display = 'none';
    document.getElementById('card-element').style.display = 'none';
    document.getElementById('submit-payment').style.display = 'none';
    
    // Send confirmation email (in real app)
    console.log('Order confirmed:', order);
    
    // Redirect to home page after 5 seconds
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 5000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    displayOrderSummary();
});

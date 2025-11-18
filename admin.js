// Admin authentication
const ADMIN_PASSWORD = 'admin123'; // Change this to a secure password!

// Check if already authenticated
window.addEventListener('DOMContentLoaded', function() {
    const isAuthenticated = sessionStorage.getItem('adminAuth') === 'true';
    if (isAuthenticated) {
        showAdminPanel();
    }
});

// Check password
function checkPassword() {
    const password = document.getElementById('admin-password').value;
    const errorElement = document.getElementById('password-error');
    
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminAuth', 'true');
        errorElement.textContent = '';
        showAdminPanel();
    } else {
        errorElement.textContent = 'Incorrect password. Please try again.';
    }
}

// Allow Enter key to submit password
document.getElementById('admin-password')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

// Logout
function logout() {
    sessionStorage.removeItem('adminAuth');
    location.reload();
}

// Show admin panel
function showAdminPanel() {
    document.getElementById('password-prompt').style.display = 'none';
    document.getElementById('admin-content').style.display = 'block';
    loadAdminData();
}

// Load all admin data
function loadAdminData() {
    updateStatistics();
    loadInventoryTable();
    loadOrders();
}

// Update statistics
function updateStatistics() {
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    document.getElementById('total-products').textContent = totalProducts;
    document.getElementById('total-stock').textContent = totalStock;
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('total-revenue').textContent = '$' + totalRevenue.toFixed(2);
}

// Load inventory table
function loadInventoryTable() {
    const tbody = document.getElementById('inventory-table-body');
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>
                <strong>${product.name}</strong>
            </td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>
                <span style="color: ${product.stock === 0 ? '#c0392b' : product.stock <= 2 ? '#e67e22' : '#27ae60'}; font-weight: 600;">
                    ${product.stock}
                </span>
            </td>
            <td>
                <input type="number" 
                       id="stock-${product.id}" 
                       class="stock-input" 
                       value="${product.stock}" 
                       min="0" 
                       max="999">
            </td>
            <td>
                <button class="update-btn" onclick="updateStock(${product.id})">Update</button>
            </td>
        </tr>
    `).join('');
}

// Update product stock
function updateStock(productId) {
    const newStock = parseInt(document.getElementById(`stock-${productId}`).value);
    
    if (isNaN(newStock) || newStock < 0) {
        alert('Please enter a valid stock quantity (0 or greater)');
        return;
    }
    
    if (updateProductStock(productId, newStock)) {
        showSuccessMessage('Stock updated successfully!');
        updateStatistics();
        loadInventoryTable();
    } else {
        alert('Failed to update stock');
    }
}

// Load orders
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const container = document.getElementById('orders-container');
    
    if (orders.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No orders yet</p>';
        return;
    }
    
    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = `
        <table class="orders-table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                ${orders.map(order => {
                    const date = new Date(order.date);
                    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
                    const customerName = `${order.shipping.firstName} ${order.shipping.lastName}`;
                    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                    
                    return `
                        <tr>
                            <td><code>${order.orderId.substring(0, 15)}...</code></td>
                            <td>${formattedDate}</td>
                            <td>${customerName}</td>
                            <td>${itemCount} item${itemCount > 1 ? 's' : ''}</td>
                            <td style="font-weight: 600;">$${order.total.toFixed(2)}</td>
                            <td>
                                <button class="update-btn" onclick="viewOrderDetails('${order.orderId}')">View</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

// View order details
function viewOrderDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.orderId === orderId);
    
    if (!order) {
        alert('Order not found');
        return;
    }
    
    const itemsList = order.items.map(item => 
        `${item.product.name} x ${item.quantity} - $${(item.product.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const details = `
Order ID: ${order.orderId}
Date: ${new Date(order.date).toLocaleString()}

Customer Information:
${order.shipping.firstName} ${order.shipping.lastName}
${order.shipping.email}
${order.shipping.phone || 'No phone provided'}

Shipping Address:
${order.shipping.address}
${order.shipping.city}, ${order.shipping.state} ${order.shipping.zip}

Order Items:
${itemsList}

Total: $${order.total.toFixed(2)}
    `;
    
    alert(details);
}

// Show success message
function showSuccessMessage(message) {
    const banner = document.getElementById('success-banner');
    banner.textContent = message;
    banner.style.display = 'block';
    
    setTimeout(() => {
        banner.style.display = 'none';
    }, 3000);
}

// Bulk update - set all products to a specific stock level
function bulkUpdateStock(stockLevel) {
    products.forEach(product => {
        updateProductStock(product.id, stockLevel);
    });
    showSuccessMessage('All products updated to ' + stockLevel + ' in stock');
    updateStatistics();
    loadInventoryTable();
}

// Export data functions
function exportOrders() {
    const orders = localStorage.getItem('orders') || '[]';
    const blob = new Blob([orders], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    URL.revokeObjectURL(url);
}

function exportInventory() {
    const inventory = localStorage.getItem('products') || '[]';
    const blob = new Blob([inventory], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    URL.revokeObjectURL(url);
}

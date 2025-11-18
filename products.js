// Product inventory management
const products = [
    {
        id: 1,
        name: "Diamond Stud Earrings",
        description: "Classic diamond stud earrings featuring brilliant cut diamonds in 14k white gold settings. Perfect for any occasion.",
        price: 299.99,
        stock: 5,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop",
        category: "Earrings"
    },
    {
        id: 2,
        name: "Pearl Necklace",
        description: "Elegant freshwater pearl necklace with sterling silver clasp. Timeless beauty that complements any outfit.",
        price: 189.99,
        stock: 5,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop",
        category: "Necklaces"
    },
    {
        id: 3,
        name: "Gold Bangle Bracelet",
        description: "Stunning 18k gold bangle bracelet with intricate design. A statement piece that adds elegance to any look.",
        price: 449.99,
        stock: 5,
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop",
        category: "Bracelets"
    },
    {
        id: 4,
        name: "Sapphire Ring",
        description: "Beautiful sapphire ring set in platinum with diamond accents. A truly special piece for special moments.",
        price: 599.99,
        stock: 5,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop",
        category: "Rings"
    },
    {
        id: 5,
        name: "Silver Charm Bracelet",
        description: "Versatile sterling silver charm bracelet with five beautiful charms. Add your own to make it uniquely yours.",
        price: 129.99,
        stock: 5,
        image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&h=500&fit=crop",
        category: "Bracelets"
    },
    {
        id: 6,
        name: "Emerald Drop Earrings",
        description: "Exquisite emerald drop earrings in 14k yellow gold. These eye-catching earrings bring color and sophistication.",
        price: 379.99,
        stock: 5,
        image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&h=500&fit=crop",
        category: "Earrings"
    },
    {
        id: 7,
        name: "Rose Gold Watch",
        description: "Elegant rose gold watch with mother of pearl dial and leather strap. Fashion meets function beautifully.",
        price: 259.99,
        stock: 5,
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&h=500&fit=crop",
        category: "Watches"
    }
];

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Load products from localStorage
function loadProducts() {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        // Update the products array
        products.length = 0;
        products.push(...parsed);
    } else {
        // Initialize with default products
        saveProducts();
    }
}

// Get product by ID
function getProductById(id) {
    return products.find(p => p.id === id);
}

// Update product stock
function updateProductStock(productId, newStock) {
    const product = getProductById(productId);
    if (product) {
        product.stock = newStock;
        saveProducts();
        return true;
    }
    return false;
}

// Check if product is in stock
function isInStock(productId) {
    const product = getProductById(productId);
    return product && product.stock > 0;
}

// Decrease stock when item is purchased
function decreaseStock(productId, quantity = 1) {
    const product = getProductById(productId);
    if (product && product.stock >= quantity) {
        product.stock -= quantity;
        saveProducts();
        return true;
    }
    return false;
}

// Initialize products on page load
loadProducts();

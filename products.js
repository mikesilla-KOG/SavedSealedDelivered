// Product inventory management
const products = [
    {
        id: 1,
        name: "SUPERNOVA Necklace",
        description: "A star is etched at the center of this necklace with a sparkling cubic zirconia. Wear it proudly as a symbol that at the center of your being is your faith, Christ in you the hope of glory! Snake chain 16\"+2\" extension. Stainless steel 18k gold plated with cubic zirconia gemstone.",
        price: 40.00,
        originalPrice: 54.00,
        stock: 71,
        images: [
            "pics/SUPERNOVA-necklace.jpg",
            "pics/SUPERNOVA-necklace2.jpg",
            "pics/SUPERNOVA-necklace3.jpg",
            "pics/Supernova-necklace-box.jpg"
        ],
        image: "pics/SUPERNOVA-necklace.jpg",
        category: "Necklaces"
    },
    {
        id: 2,
        name: "ESTELLA Pendant",
        description: "Just like God spoke the stars into existence HE speaks light into your heart. \"Let there be light\" Gen 1:3 is laser engraved on the back of this pendant. Wear this necklace as a reminder that you shine His light wherever you go! Link chain 16\"+2\" extension. Stainless steel 18K gold plated with cubic zirconia gemstone.",
        price: 42.00,
        stock: 0,
        images: [
            "pics/pendant 1.jpg",
            "pics/pendant 2.jpg",
            "pics/pendant 3.jpg"
        ],
        image: "pics/pendant 1.jpg",
        category: "Necklaces"
    },
    {
        id: 3,
        name: "ORION Bangle Bracelet",
        description: "Ten etched stars each with a delicate cubic zirconia in the center adorn this golden bangle. In the first chapter of Genesis the phrase \"God said\" appears 10 times… the first time God said, \"Let there Be light\". Wear this bangle as a reminder of God's ability to speak light into existence! 60mm diameter. Stainless steel 18K gold plated with cubic zirconia gemstone.",
        price: 39.00,
        stock: 0,
        images: [
            "pics/orion-bangle-1.jpg",
            "pics/orion-bangle-3.jpg",
            "pics/orion-bangle-back.jpg"
        ],
        image: "pics/orion-bangle-1.jpg",
        category: "Bracelets"
    },
    {
        id: 4,
        name: "HELIOS Mini Hoop",
        description: "These everyday little hoops with four delicate etched stars signifying the 4th day when God created the stars and seven sparkly cubic zirconia stones all around. Seven the number of perfection. Wear these hoops as a reminder that every perfect gift is from above, coming down from the Father of lights! Stainless steel 18K gold plated with cubic zirconia gemstone.",
        price: 25.00,
        originalPrice: 35.00,
        stock: 25,
        images: [
            "pics/HELIOSminihoop1.jpg",
            "pics/HELIOSminihoop2.jpg",
            "pics/HELIOSminihoop3.jpg"
        ],
        image: "pics/HELIOSminihoop1.jpg",
        category: "Earrings"
    },
    {
        id: 5,
        name: "NORTH STAR Dangle Earrings",
        description: "These cute dangle earrings are perfect for everyday wear, with a single star etched in the center and a brilliant cluster of delicate cubic zirconia gemstone. A perfect reminder that you can hear his still small voice guiding you every step of the way! Brass 18K gold plated with cubic zirconia gemstone.",
        price: 25.00,
        originalPrice: 32.00,
        stock: 10,
        images: [
            "pics/dangle earrings1 .jpg"
        ],
        image: "pics/dangle earrings1 .jpg",
        category: "Earrings"
    },
    {
        id: 6,
        name: "BRILLIANT STAR Ring",
        description: "A signet ring with a single etched star and vibrant cubic zirconia gemstone in the center. The signet ring has been around since the days of the old testament, when it was used as a seal or signature representing an individual's identity. Wear it proudly knowing that you have been created in God's image and you bare the seal of his identity! Stainless steel 18K gold plated with cubic zirconia gemstone.",
        price: 30.00,
        originalPrice: 46.00,
        stock: 45,
        sizes: [
            { size: '6', stock: 18 },
            { size: '7', stock: 14 },
            { size: '8', stock: 13 }
        ],
        images: [
            "pics/ring1.jpg",
            "pics/ring2.jpg",
            "pics/ring3.jpg"
        ],
        image: "pics/ring1.jpg",
        category: "Rings"
    }
];

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('productsVersion', '6.0'); // Version to track updates
}

// Load products from localStorage
function loadProducts() {
    const savedVersion = localStorage.getItem('productsVersion');
    const savedProducts = localStorage.getItem('products');
    
    // If version doesn't match or no saved products, use default products
    if (savedVersion !== '6.0' || !savedProducts) {
        // Clear old data and save new products
        localStorage.removeItem('products');
        localStorage.removeItem('productsVersion');
        saveProducts();
    } else {
        const parsed = JSON.parse(savedProducts);
        // Update the products array
        products.length = 0;
        products.push(...parsed);
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

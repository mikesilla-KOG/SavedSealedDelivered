# Saved Sealed Delivered - E-commerce Website

A beautiful, fully-functional jewelry e-commerce website with inventory management, shopping cart, and payment integration.


## 🌐 Live Storefront (GitHub Pages)

**Share this link:** https://mikesilla-kog.github.io/SavedSealedDelivered/

The site is a static storefront (catalog, cart, checkout hooks, admin). Stripe keys remain placeholders until you add your own — see Payment Integration below.

## 🌟 Features

- **Product Catalog**: Display 7 jewelry items with images, descriptions, and pricing
- **Inventory Management**: Real-time stock tracking with visual indicators
- **Shopping Cart**: Add/remove items, adjust quantities, view cart total
- **Checkout System**: Integrated with Stripe for secure payments
- **Admin Panel**: Password-protected interface to manage inventory and view orders
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile devices
- **Local Storage**: Persistent cart and order history

## 📁 Project Structure

```
SavedSealedDelivered/
├── index.html          # Main storefront page
├── checkout.html       # Checkout and payment page
├── admin.html          # Admin panel for inventory management
├── styles.css          # All styling
├── products.js         # Product data and inventory management
├── cart.js             # Shopping cart functionality
├── app.js              # Main application logic
├── checkout.js         # Payment processing logic
├── admin.js            # Admin panel functionality
└── README.md           # This file
```

## 🚀 Getting Started

### Quick Start (Local Development)

1. **Open the website**:
   - Simply open `index.html` in a web browser
   - Or use a local server (recommended):
     ```bash
     # Using Python
     python3 -m http.server 8000
     
     # Using Node.js (http-server)
     npx http-server
     ```
   - Visit `http://localhost:8000` in your browser

2. **Access the admin panel**:
   - Navigate to `admin.html` or click the admin link
   - Default password: `admin123`
   - ⚠️ **Important**: Change the password in `admin.js` for security!

### Customizing the Store

#### Update Product Information

Edit the `products` array in `products.js`:

```javascript
{
    id: 1,
    name: "Your Product Name",
    description: "Product description",
    price: 299.99,
    stock: 5,
    image: "https://your-image-url.com/image.jpg",
    category: "Category Name"
}
```

#### Change Store Branding

1. The store name is set to "Saved Sealed Delivered" throughout the site
2. Modify colors in `styles.css` (search for color codes like `#667eea`)
3. Update contact information in the footer

## 💳 Payment Integration

### Stripe Setup (Recommended)

This site is pre-configured for Stripe integration:

1. **Create a Stripe account**: [https://stripe.com](https://stripe.com)

2. **Get your API keys**:
   - Go to Stripe Dashboard → Developers → API Keys
   - Copy your Publishable Key and Secret Key

3. **Update the frontend**:
   - Open `checkout.js`
   - Replace `pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE` with your actual publishable key

4. **Set up a backend** (required for production):
   - Stripe requires a server to create payment intents securely
   - See the "Backend Setup" section below

### Backend Setup for Stripe

You'll need a backend server to process payments securely. Here's a simple Node.js example:

```javascript
// server.js
const express = require('express');
const stripe = require('stripe')('sk_test_YOUR_SECRET_KEY');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/create-payment-intent', async (req, res) => {
    const { amount, currency, cart, shipping } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        metadata: {
            cart: JSON.stringify(cart),
            shipping: JSON.stringify(shipping)
        }
    });
    
    res.json({ clientSecret: paymentIntent.client_secret });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

## 🏪 Alternative: Marketplace Integration

For easier payment and shipping management, consider listing your products on established marketplaces:

### Amazon Handmade
- **Pros**: Huge audience, trusted brand, handles payments & shipping
- **Cons**: 15% referral fee, strict requirements
- **Best for**: Handmade or unique jewelry items
- **Link**: [https://services.amazon.com/handmade/handmade.html](https://services.amazon.com/handmade/handmade.html)

### Etsy
- **Pros**: Perfect for jewelry, easy to set up, creative community
- **Cons**: $0.20 listing fee + 6.5% transaction fee
- **Best for**: Unique, handcrafted, or vintage jewelry
- **Link**: [https://www.etsy.com/sell](https://www.etsy.com/sell)

### eBay
- **Pros**: Large audience, flexible pricing (auction or fixed)
- **Cons**: Final value fees (~12-15%), more competition
- **Best for**: Both new and pre-owned jewelry
- **Link**: [https://www.ebay.com/sl/sell](https://www.ebay.com/sl/sell)

### Facebook Marketplace / Instagram Shopping
- **Pros**: Free, direct connection with buyers, social proof
- **Cons**: No payment protection (unless using Checkout), local pickup focus
- **Best for**: Local sales, building community
- **Link**: [https://www.facebook.com/marketplace](https://www.facebook.com/marketplace)

### Shopify (Full E-commerce Platform)
- **Pros**: Professional, handles everything, many integrations
- **Cons**: Monthly fee ($29+), learning curve
- **Best for**: Serious sellers planning to scale
- **Link**: [https://www.shopify.com](https://www.shopify.com)

## 🔧 Admin Panel Features

Access at `admin.html` (password: `admin123`)

- **Dashboard Statistics**: Total products, stock levels, orders, and revenue
- **Inventory Management**: Update stock quantities in real-time
- **Order Management**: View all orders with customer details
- **Order Details**: Click "View" to see full order information

### Security Note

⚠️ **Important**: The admin panel uses a simple password check for demonstration. For production:

1. Change the password in `admin.js`
2. Implement proper backend authentication
3. Use HTTPS for all admin access
4. Consider adding user roles and permissions

## 📦 Deployment Options

### Option 1: GitHub Pages (Free)

1. Create a GitHub repository
2. Push your code
3. Go to Settings → Pages
4. Select your branch and save
5. Your site will be live at `https://yourusername.github.io/your-repo-name`

### Option 2: Netlify (Free)

1. Create account at [netlify.com](https://netlify.com)
2. Drag and drop your folder
3. Your site is live instantly
4. Custom domain available

### Option 3: Vercel (Free)

1. Create account at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Deploy with one click
4. Automatic HTTPS and custom domains

### Option 4: Traditional Web Hosting

Upload all files to any web host via FTP:
- Bluehost, HostGator, GoDaddy, etc.
- Make sure `index.html` is in the root directory

## 📧 Email Notifications

To receive order notifications:

1. **Use EmailJS** (Free tier available):
   - Sign up at [emailjs.com](https://www.emailjs.com)
   - Add their JavaScript library
   - Configure email templates
   - Update `checkout.js` to send emails

2. **Backend Email Service**:
   - Use SendGrid, Mailgun, or AWS SES
   - Send confirmation emails from your server

## 🛠️ Advanced Customization

### Adding More Products

1. Open `products.js`
2. Add new objects to the `products` array
3. Follow the existing format
4. Images can be:
   - External URLs (Unsplash, Imgur, etc.)
   - Local files in an `images/` folder
   - Base64 encoded images

### Changing Colors and Fonts

Edit `styles.css`:
- Primary color: Search for `#667eea`
- Secondary color: Search for `#764ba2`
- Gold accent: Search for `#e8b923`
- Fonts: Update `font-family` declarations

### Adding New Features

Suggested enhancements:
- Product reviews and ratings
- Wishlist functionality
- Product filtering by category
- Search functionality
- Email newsletter signup
- Live chat support
- Multi-currency support

## 📱 Mobile Optimization

The site is fully responsive with:
- Flexible grid layouts
- Touch-friendly buttons
- Optimized images
- Mobile-first navigation

## 🔒 Security Best Practices

Before going live:

1. **Change admin password** in `admin.js`
2. **Use HTTPS** (automatic with Netlify/Vercel/GitHub Pages)
3. **Never expose API keys** in client-side code
4. **Implement backend authentication** for admin functions
5. **Add rate limiting** for API calls
6. **Validate all user inputs**
7. **Use environment variables** for sensitive data

## 🐛 Troubleshooting

### Cart not persisting
- Check browser localStorage is enabled
- Clear cache and reload

### Payment not working
- Verify Stripe API key is correct
- Check browser console for errors
- Ensure backend server is running

### Images not loading
- Check image URLs are accessible
- Try using absolute URLs instead of relative
- Verify CORS settings if using external images

### Admin panel not loading
- Check JavaScript console for errors
- Verify password is correct
- Clear sessionStorage and try again

## 📞 Support and Questions

For questions or issues:
1. Check the browser console for error messages
2. Verify all files are in the correct location
3. Test in a different browser
4. Review this README carefully

## 📄 License

This project is provided as-is for personal and commercial use.

## 🎯 Next Steps

1. **Customize** the products with your actual jewelry items
2. **Add real product images** (professional photos recommended)
3. **Set up Stripe** account and API keys
4. **Change admin password** for security
5. **Test thoroughly** before launching
6. **Deploy** to your preferred hosting platform
7. **Consider marketplace integration** for easier management

Good luck with your jewelry business! 💎✨

# Spice Haven - Masala Business Website

A professional, modern, and responsive 5-page website for a Masala business with backend integration.

## 🌶️ Features

- **5 Complete Pages:**
  - Home (Hero section with call-to-action)
  - Products (Menu with 6 masala products)
  - About Us (Company story and statistics)
  - Gallery (Visual showcase)
  - Contact/Order (Form with WhatsApp integration)

- **Design:**
  - Warm color palette (turmeric, chili red, cumin)
  - Fully responsive (mobile-friendly)
  - Modern animations and transitions
  - Floating WhatsApp button for direct customer chat

- **Backend:**
  - Node.js + Express server
  - Supabase database integration
  - Form validation and submission handling
  - RESTful API endpoints

## 📁 File Structure

```
/workspace
├── index.html      # Main HTML file (all 5 pages in one)
├── style.css       # Complete styling
├── script.js       # Frontend JavaScript
├── server.js       # Backend Node.js server
├── package.json    # Node.js dependencies
├── .env.example    # Environment variables template
└── README.md       # This file
```

## 🚀 Quick Start

### Option 1: Static Site (No Backend)

Simply open `index.html` in your browser:

```bash
# On Mac
open index.html

# On Windows
start index.html

# On Linux
xdg-open index.html
```

The form will automatically fallback to WhatsApp for order submission.

### Option 2: Full Stack (With Backend)

1. **Install Node.js dependencies:**

```bash
npm init -y
npm install express cors dotenv @supabase/supabase-js
```

2. **Set up environment variables:**

Create a `.env` file in the root directory:

```env
PORT=3000
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_key_here
```

3. **Start the server:**

```bash
node server.js
```

4. **Open in browser:**

Navigate to `http://localhost:3000`

## 🗄️ Supabase Setup

To enable database storage for orders:

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor and run:

```sql
CREATE TABLE orders (
  id BIGINT PRIMARY KEY DEFAULT NOW()::BIGINT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  product TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending'
);
```

4. Copy your Project URL and anon/public key to `.env`

## 🎨 Color Palette

| Color | Hex Code | Usage |
|-------|----------|-------|
| Turmeric | #F4A300 | Primary buttons, highlights |
| Turmeric Light | #FFC107 | Hover states |
| Chili Red | #C41E3A | Headings, accents |
| Chili Dark | #8B0000 | Hover states |
| Cumin | #8B4513 | Gradients, backgrounds |
| Cream | #FFF8E7 | Page background |

## 📱 WhatsApp Integration

The floating WhatsApp button is configured to: `+91 98765 43210`

To change the number, update these files:
- `index.html` (line ~330): Change the `href` in the WhatsApp button
- `script.js` (line ~120): Update the fallback number in form submission

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/submit-order` | Submit order/inquiry |
| GET | `/api/orders` | Retrieve all orders |
| GET | `/health` | Health check |

### Example: Submit Order

```javascript
fetch('/api/submit-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 98765 43210',
    product: 'Garam Masala',
    message: 'I would like to order 5 units'
  })
});
```

## ✨ Features Breakdown

### Frontend
- ✅ Responsive navigation with mobile menu
- ✅ Smooth scroll animations
- ✅ Active navigation highlighting
- ✅ Product cards with hover effects
- ✅ Image placeholders with gradients
- ✅ Form validation
- ✅ Scroll-triggered animations
- ✅ Loading states

### Backend
- ✅ Express server setup
- ✅ CORS enabled
- ✅ JSON parsing
- ✅ Input validation
- ✅ Error handling
- ✅ Supabase integration
- ✅ In-memory fallback storage
- ✅ Graceful shutdown

## 🛠️ Customization

### Change Business Name
Update in `index.html`:
- Title tag
- Logo text (2 occurrences)
- Footer brand section

### Add More Products
Copy a product card in `index.html` and modify:
- `data-product` attribute
- Product name
- Description
- Price
- Gradient class for image placeholder

### Update Contact Information
Edit in `index.html`:
- Phone number
- Email address
- Physical address
- Social media links

## 📦 Deployment

### Static Hosting (Recommended for simple deployment)
- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages

Just upload the static files (`index.html`, `style.css`, `script.js`)

### Full Stack Deployment
- Heroku
- Railway
- Render
- DigitalOcean App Platform

Deploy with `server.js` and set environment variables.

---

**Made with ❤️ and lots of spices! 🌶️**
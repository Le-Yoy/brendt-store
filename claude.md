# BRENDT E-COMMERCE PLATFORM - COMPLETE REFERENCE FOR CLAUDE CODE

**Last Updated**: February 2026
**Live Site**: https://brendtshoes.com
**Domain**: brendtshoes.com (managed via Namecheap DNS)

---

## 🎯 PROJECT OVERVIEW

BRENDT is a luxury e-commerce platform specializing in Italian-crafted and Moroccan artisanal footwear and leather goods. Built with a MERN stack (Next.js + Express + MongoDB), the platform emphasizes sophisticated design, performance optimization, and mobile-first user experience.

### Business Model
- **Primary Market**: Morocco (MAD currency)
- **Language**: French (primary)
- **Product Categories**: Men's and Women's footwear (chaussures), accessories (accessoires), gifts (cadeaux)
- **Brand Identity**: Luxury, artisanal, Italian craftsmanship, traditional Moroccan techniques

---

## 🏗️ TECHNICAL ARCHITECTURE

### Technology Stack
```
Frontend: Next.js 15.1.5 + React 19
Backend: Node.js + Express.js
Database: MongoDB Atlas
Hosting:
  - Frontend: Vercel (brendtshoes.com)
  - Backend: Railway (brendt-store-production-d6ef.up.railway.app)
  - Database: MongoDB Atlas Cloud
Version Control: Git
CDN: Vercel Edge Network
Image Format: WebP (optimized from JPG)
```

### Project Root Structure
```
/Users/almostaphasmart/Desktop/brendt-project/
├── client/                    # Next.js Frontend
│   ├── public/
│   │   └── assets/
│   │       ├── images/
│   │       │   ├── products/brendt-new/  # Product images
│   │       │   │   ├── homme/            # Men's products
│   │       │   │   │   ├── chaussures/
│   │       │   │   │   │   ├── mocassins/
│   │       │   │   │   │   ├── boots/
│   │       │   │   │   │   ├── sneakers/
│   │       │   │   │   │   ├── derbies/
│   │       │   │   │   │   ├── babouches/
│   │       │   │   │   │   └── monkstraps/
│   │       │   │   │   └── accessoires/
│   │       │   │   └── femme/            # Women's products
│   │       │   │       ├── chaussures/
│   │       │   │       │   ├── mocassinos/  # Note: 'mocassinos' for women
│   │       │   │       │   ├── sandales/
│   │       │   │       │   └── babouches/
│   │       │   │       └── accessoires/
│   │       │   ├── logos/
│   │       │   │   └── brendt-complet-logo.svg  # Main brand logo
│   │       │   ├── trioimages/          # Hero carousel images (1.png-5.png)
│   │       │   └── section-3/           # Category showcase images
│   │       └── fonts/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.js
│   │   │   ├── page.js
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header/
│   │   │   │   ├── Footer/
│   │   │   │   └── ClientLayout.jsx
│   │   │   ├── home/
│   │   │   │   ├── Hero/
│   │   │   │   ├── FeaturedProducts/
│   │   │   │   └── CategoryGrid/
│   │   │   └── common/
│   │   │       ├── Button/
│   │   │       ├── Input/
│   │   │       ├── LoadingSpinner/
│   │   │       └── BackToTop/
│   │   ├── context/
│   │   │   └── CartContext.js
│   │   ├── hooks/
│   │   │   ├── useCart.js
│   │   │   └── useAuth.js
│   │   ├── services/
│   │   │   └── productService.js
│   │   └── styles/
│   │       └── utilities.css
│   ├── next.config.mjs
│   ├── package.json
│   └── .env.local
│
└── server/                    # Express Backend
    ├── controllers/
    │   └── productController.js
    ├── models/
    │   └── Product.js
    ├── routes/
    │   ├── products.js
    │   ├── orders.js
    │   └── users.js
    ├── scripts/
    │   ├── import-to-production.js
    │   ├── update-stock.js
    │   └── check-existing-products.js
    ├── data/
    │   └── products.json          # Product database source
    ├── .env
    ├── package.json
    └── server.js
```

---

## 🎨 DESIGN SYSTEM & BRAND IDENTITY

### Color Palette
```css
/* Primary Colors */
--color-white: #ffffff;        /* Background, cards */
--color-dark: #000000;         /* Text, headers */
--color-accent: #d4af37;       /* Gold - luxury accent, CTAs */

/* Grayscale */
--color-mid-gray: #666666;     /* Secondary text */
--color-light-gray: #f5f5f5;   /* Backgrounds, borders */
--color-secondary: #f8f8f8;    /* Alternate backgrounds */

/* Functional Colors */
--color-error: #dc2626;        /* Error states */
--color-success: #16a34a;      /* Success states */
```

### Typography
```css
/* Font Families */
--font-primary: 'Primary Font Family';  /* Main brand font */

/* Font Sizes (Fluid Typography) */
--font-size-xs: 0.75rem;      /* 12px - small labels */
--font-size-sm: 0.875rem;     /* 14px - body small */
--font-size-base: 1rem;       /* 16px - body text */
--font-size-lg: 1.125rem;     /* 18px - large body */
--font-size-xl: 1.25rem;      /* 20px - subheadings */
--font-size-2xl: 1.5rem;      /* 24px - headings */
--font-size-3xl: 1.875rem;    /* 30px - large headings */
--font-size-4xl: 2.25rem;     /* 36px - hero text */

/* Font Weights */
--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

/* Letter Spacing */
--letter-spacing-tight: -0.025em;
--letter-spacing-normal: 0;
--letter-spacing-wide: 0.025em;
--letter-spacing-wider: 0.05em;
--letter-spacing-widest: 0.1em;
```

### Spacing System
```css
/* 4px base scale */
--spacing-0: 0;
--spacing-1: 0.25rem;    /* 4px */
--spacing-2: 0.5rem;     /* 8px */
--spacing-3: 0.75rem;    /* 12px */
--spacing-4: 1rem;       /* 16px */
--spacing-5: 1.25rem;    /* 20px */
--spacing-6: 1.5rem;     /* 24px */
--spacing-8: 2rem;       /* 32px */
--spacing-10: 2.5rem;    /* 40px */
--spacing-12: 3rem;      /* 48px */
--spacing-16: 4rem;      /* 64px */
--spacing-20: 5rem;      /* 80px */
--spacing-24: 6rem;      /* 96px */
--spacing-32: 8rem;      /* 128px */
```

### Layout Constraints
```css
--container-2xl: 1400px;      /* Max content width */
--radius-sm: 4px;             /* Small border radius */
--radius-md: 8px;             /* Medium border radius */
--radius-lg: 12px;            /* Large border radius */
--radius-xl: 16px;            /* Extra large border radius */
```

### Responsive Breakpoints (Mobile-First)
```css
/* Mobile: < 640px (default, no media query) */

@media (min-width: 390px) {
  /* iPhone 14 Pro Max and similar */
}

@media (min-width: 640px) {
  /* Tablet portrait */
}

@media (min-width: 768px) {
  /* Tablet landscape */
}

@media (min-width: 1024px) {
  /* Desktop */
}

@media (min-width: 1280px) {
  /* Large desktop */
}
```

---

## 📊 DATABASE SCHEMA

### MongoDB Connection
```javascript
// Production Database (MongoDB Atlas)
const MONGODB_URI = "mongodb+srv://brendt-admin:m7Er0FjetgTKEpyW@ce-yoy.l3gz0br.mongodb.net/brendt?retryWrites=true&w=majority&appName=Ce-Yoy";

// Database: brendt
// Collections: products, users, orders, counters
```

### Product Schema
```javascript
{
  _id: ObjectId,                    // MongoDB auto-generated ID
  name: String,                     // Product name (e.g., "Tassel Loafers")
  price: Number,                    // Price in MAD (e.g., 1200)
  previousPrice: Number,            // Optional - for discounts
  discount: Number,                 // Percentage (0-100)
  category: String,                 // Lowercase (e.g., "chaussures", "accessoires")
  categoryName: String,             // Display name (e.g., "Chaussures")
  subcategory: String,              // Lowercase - IMPORTANT NOTES BELOW
  subcategoryName: String,          // Display name
  description: String,              // Product description
  details: [String],                // Array of detail points
  care: String,                     // Care instructions

  colors: [{
    name: String,                   // Color name (e.g., "Noir", "Marron")
    code: String,                   // Hex code (e.g., "#000000")
    images: [String],               // Array of image paths (min 1, max 5)
    inStock: Boolean,               // Per-color stock status
    stock: Number                   // Stock count (0+)
  }],

  materials: [String],              // Materials used

  sizes: [{
    name: String,                   // Size identifier (e.g., "40", "41")
    eu: String,                     // EU size
    uk: String,                     // UK size
    us: String,                     // US size
    available: Boolean              // Size availability
  }],

  rating: Number,                   // 0-5
  reviewCount: Number,              // Number of reviews
  inStock: Boolean,                 // Global stock status
  isNewArrival: Boolean,            // New product flag
  isBestseller: Boolean,            // Bestseller flag
  gender: String,                   // Required: "homme" or "femme"

  createdAt: Date,                  // Auto-generated
  updatedAt: Date                   // Auto-updated
}
```

### CRITICAL: Subcategory Gender Differences
```javascript
// Women's (femme) subcategories - SPELLED DIFFERENTLY
subcategory: "mocassinos"  // NOT "mocassins" for women
subcategory: "sandales"
subcategory: "babouches"

// Men's (homme) subcategories
subcategory: "mocassins"   // Standard spelling for men
subcategory: "boots"
subcategory: "sneakers"
subcategory: "derbies"
subcategory: "babouches"
subcategory: "monkstraps"

// Controller handles this mapping automatically
// Frontend URLs use standard spelling, backend maps to DB values
```

### Standard Size Charts
```javascript
// Men's Sizes
const HOMME_SIZES = [
  { name: "40", eu: "40", uk: "6.5", us: "7.5", available: true },
  { name: "41", eu: "41", uk: "7.5", us: "8.5", available: true },
  { name: "42", eu: "42", uk: "8", us: "9", available: true },
  { name: "43", eu: "43", uk: "9", us: "10", available: true },
  { name: "44", eu: "44", uk: "9.5", us: "10.5", available: true },
  { name: "45", eu: "45", uk: "10.5", us: "11.5", available: true }
];

// Women's Sizes
const FEMME_SIZES = [
  { name: "36", eu: "36", uk: "3", us: "5", available: true },
  { name: "37", eu: "37", uk: "4", us: "6", available: true },
  { name: "38", eu: "38", uk: "5", us: "7", available: true },
  { name: "39", eu: "39", uk: "6", us: "8", available: true },
  { name: "40", eu: "40", uk: "7", us: "9", available: true },
  { name: "41", eu: "41", uk: "8", us: "10", available: true }
];
```

---

## 🔧 DEVELOPMENT WORKFLOWS

### Environment Variables

**Frontend (.env.local)**
```bash
NEXT_PUBLIC_API_URL=https://brendt-store-production-d6ef.up.railway.app/api
```

**Backend (.env on Railway)**
```bash
MONGODB_URI=mongodb+srv://brendt-admin:m7Er0FjetgTKEpyW@ce-yoy.l3gz0br.mongodb.net/brendt?retryWrites=true&w=majority&appName=Ce-Yoy
NODE_ENV=production
PORT=3001
JWT_SECRET=your_generated_secret
```

### Working Directory Commands
```bash
# Frontend Development
cd /Users/almostaphasmart/Desktop/brendt-project/client
npm run dev              # Start dev server (localhost:3000)
npm run build            # Build for production
npm run start            # Start production server

# Backend Development
cd /Users/almostaphasmart/Desktop/brendt-project/server
npm start                # Start server (localhost:3001)
node update-stock.js     # Stock management commands
```

---

## 📦 PRODUCT MANAGEMENT

### Adding New Products

**Step 1: Prepare Product Images**
```bash
# Image naming convention
/assets/images/products/brendt-new/[gender]/[category]/[subcategory]/[Product Name]/[Color-Name]/[1-5].webp

# Example paths:
/assets/images/products/brendt-new/homme/chaussures/mocassins/Tassel Loafers/Marron/1.webp
/assets/images/products/brendt-new/homme/chaussures/mocassins/Tassel Loafers/Marron/2.webp
/assets/images/products/brendt-new/femme/chaussures/sandales/Summer Sandals/Blanc/1.webp

# Image Requirements:
- Format: .webp (optimized)
- Minimum: 1 image per color
- Maximum: 5 images per color
- Recommended size: 800x1000px
- File size: < 300KB per image
```

**Step 2: Edit products.json**
```javascript
// Location: /server/data/products.json

[
  {
    "name": "Penny Loafer",
    "price": 1200,
    "previousPrice": 1400,      // Optional for discounts
    "discount": 14,              // Percentage
    "category": "chaussures",
    "categoryName": "Chaussures",
    "subcategory": "mocassins",  // For homme
    "subcategoryName": "Mocassins",
    "description": "Elegant penny loafers crafted from premium leather.",
    "details": [
      "Premium Italian leather construction",
      "Hand-stitched details",
      "Leather sole with rubber heel"
    ],
    "care": "Clean with soft cloth. Use leather conditioner monthly.",
    "colors": [
      {
        "name": "Marron",
        "code": "#5D4037",
        "images": [
          "/assets/images/products/brendt-new/homme/chaussures/mocassins/Penny Loafer/Marron/1.webp",
          "/assets/images/products/brendt-new/homme/chaussures/mocassins/Penny Loafer/Marron/2.webp"
        ],
        "inStock": true,
        "stock": 10
      },
      {
        "name": "Noir",
        "code": "#000000",
        "images": [
          "/assets/images/products/brendt-new/homme/chaussures/mocassins/Penny Loafer/Noir/1.webp"
        ],
        "inStock": true,
        "stock": 8
      }
    ],
    "materials": [],
    "sizes": [
      { "name": "40", "eu": "40", "uk": "6.5", "us": "7.5", "available": true },
      { "name": "41", "eu": "41", "uk": "7.5", "us": "8.5", "available": true },
      { "name": "42", "eu": "42", "uk": "8", "us": "9", "available": true },
      { "name": "43", "eu": "43", "uk": "9", "us": "10", "available": true },
      { "name": "44", "eu": "44", "uk": "9.5", "us": "10.5", "available": false }
    ],
    "rating": 0,
    "reviewCount": 0,
    "inStock": true,
    "isNewArrival": true,
    "isBestseller": false,
    "gender": "homme"
  }
]
```

**Step 3: Import to Production Database**
```bash
cd /Users/almostaphasmart/Desktop/brendt-project/server

# Run import script
node import-to-production.js

# Expected output:
# ✓ Loaded X products from JSON file
# ✓ MongoDB connected successfully!
# ✓ Connected to database: brendt
# ✓ Cleared X existing products
# ✓ Imported X/X products
# ✓ Final product count in database: X
# ✓ Gender distribution - Homme: X, Femme: X
```

**Step 4: Deploy Backend**
```bash
# Still in /server directory
git add .
git commit -m "Added new products: [product names]"
git push

# Railway auto-deploys (2-3 minutes)
# Check deployment: https://brendt-store-production-d6ef.up.railway.app/api/products
```

**Step 5: Verify on Website**
```bash
# Visit category pages:
# https://brendtshoes.com/category/chaussures?gender=homme&subcategory=mocassins
# https://brendtshoes.com/category/chaussures?gender=femme&subcategory=sandales

# Check product appears correctly
# Verify images load
# Test color switching
# Confirm price displays
```

---

## 📊 INVENTORY MANAGEMENT

### Stock Management Terminal Commands

**Location**: Always run from `/server` directory
```bash
cd /Users/almostaphasmart/Desktop/brendt-project/server
```

### 1. View All Products
```bash
node update-stock.js list

# Output shows:
# ID: 682e1f0c0a1974760d2f9d1c
# Name: Trousse De Toilettes
# Category: accessoires / petite-maroquennerie
# Main Price: 210 MAD
# Stock: In Stock
# Colors:
#   - Marron: In Stock
#   - Noir: Out of Stock
# Sizes:
#   - Taille Unique: Available
```

### 2. Update Product Stock Status
```bash
# Make product OUT OF STOCK
node update-stock.js update-product [PRODUCT_ID] false

# Make product IN STOCK
node update-stock.js update-product [PRODUCT_ID] true

# Example:
node update-stock.js update-product 682e1f0c0a1974760d2f9d1c false
```

### 3. Update Color Stock
```bash
# Make specific color OUT OF STOCK
node update-stock.js update-color-stock [PRODUCT_ID] "[COLOR_NAME]" false

# Make specific color IN STOCK
node update-stock.js update-color-stock [PRODUCT_ID] "[COLOR_NAME]" true

# Examples:
node update-stock.js update-color-stock 682e1f434b01b80d1bcb5a95 "Beige" false
node update-stock.js update-color-stock 682e1f434b01b80d1bcb5a95 "Rose" true

# ⚠️ COLOR NAMES ARE CASE-SENSITIVE
```

### 4. Update Size Availability
```bash
# Make size UNAVAILABLE
node update-stock.js update-size [PRODUCT_ID] "[SIZE_NAME]" false

# Make size AVAILABLE
node update-stock.js update-size [PRODUCT_ID] "[SIZE_NAME]" true

# Examples:
node update-stock.js update-size 682e1f434b01b80d1bcb5a95 "36" false
node update-stock.js update-size 682e1f434b01b80d1bcb5a95 "42" true
```

### 5. Update Prices
```bash
# Update main product price
node update-stock.js update-price [PRODUCT_ID] [NEW_PRICE]

# Update color-specific price
node update-stock.js update-color-price [PRODUCT_ID] "[COLOR_NAME]" [NEW_PRICE]

# Examples (prices in MAD, no currency symbol):
node update-stock.js update-price 682e1f0c0a1974760d2f9d1c 250
node update-stock.js update-color-price 682e1f434b01b80d1bcb5a95 "Rose" 950
```

### 6. Deploy Changes
```bash
# ALWAYS deploy after inventory changes
git add .
git commit -m "Updated inventory - [describe changes]"
git push

# Examples of good commit messages:
# "Updated inventory - made 70% products out of stock"
# "Updated inventory - changed Babouches price to 900 MAD"
# "Updated inventory - made Rose color out of stock for all sandals"

# Wait 2-3 minutes for Railway deployment
```

### Common Inventory Workflows

**Make Multiple Products Out of Stock**
```bash
cd /Users/almostaphasmart/Desktop/brendt-project/server

node update-stock.js update-product 682e1f0c0a1974760d2f9d1c false
node update-stock.js update-product 682e1f0c0a1974760d2f9d1d false
node update-stock.js update-product 682e1f0c0a1974760d2f9d1e false

git add .
git commit -m "Made multiple products out of stock"
git push
```

**Seasonal Price Update**
```bash
cd /Users/almostaphasmart/Desktop/brendt-project/server

node update-stock.js update-price 682e1f434b01b80d1bcb5a95 750
node update-stock.js update-price 682e1f434b01b80d1bcb5a96 1150
node update-stock.js update-price 682e1f434b01b80d1bcb5a97 890

git add .
git commit -m "Applied seasonal discounts"
git push
```

**Limited Size Availability**
```bash
cd /Users/almostaphasmart/Desktop/brendt-project/server

node update-stock.js update-size 682e1f434b01b80d1bcb5a95 "36" false
node update-stock.js update-size 682e1f434b01b80d1bcb5a95 "37" false
node update-stock.js update-size 682e1f434b01b80d1bcb5a95 "40" false

git add .
git commit -m "Limited size availability for Babouches"
git push
```

---

## 🚀 DEPLOYMENT PROCESSES

### Backend Deployment (Railway)

**Automatic Deployment** (Recommended)
```bash
# From /server directory
cd /Users/almostaphasmart/Desktop/brendt-project/server

git add .
git commit -m "Your commit message"
git push

# Railway automatically detects push and deploys
# Deployment time: 2-3 minutes
# Live URL: https://brendt-store-production-d6ef.up.railway.app
```

**Manual Deployment via Railway CLI** (If needed)
```bash
# Install Railway CLI (one-time)
npm install -g @railway/cli

# Login to Railway
railway login

# From /server directory
cd /Users/almostaphasmart/Desktop/brendt-project/server

# Deploy
railway up

# Check status
railway status

# View logs
railway logs
```

**Railway Environment Variables**
```bash
# View current variables
railway variables

# Set new variable
railway variables set VARIABLE_NAME="value"

# Current production variables:
# MONGODB_URI=mongodb+srv://brendt-admin:m7Er0FjetgTKEpyW@ce-yoy.l3gz0br.mongodb.net/brendt?retryWrites=true&w=majority&appName=Ce-Yoy
# NODE_ENV=production
# PORT=3001
```

### Frontend Deployment (Vercel)

**Automatic Deployment** (Recommended)
```bash
# From /client directory
cd /Users/almostaphasmart/Desktop/brendt-project/client

git add .
git commit -m "Your commit message"
git push

# Vercel automatically detects push and deploys
# Deployment time: 1-2 minutes
# Live URL: https://brendtshoes.com
```

**Manual Deployment** (If needed)
```bash
# Install Vercel CLI (one-time)
npm install -g vercel

# Login to Vercel
vercel login

# From /client directory
cd /Users/almostaphasmart/Desktop/brendt-project/client

# Build for production
npm run build

# Deploy to production
vercel --prod

# Check deployment
vercel ls
```

**When to Deploy Frontend**
- Modified React components or pages
- Changed styles or CSS
- Updated frontend logic
- Changed environment variables
- Updated Next.js configuration

**When NOT to Deploy Frontend**
- Only changed stock/prices (backend only)
- Only added products to database (backend only)
- Only changed backend API logic

---

## 🔍 API ENDPOINTS

### Base URL
```
Production: https://brendt-store-production-d6ef.up.railway.app/api
Local Dev: http://localhost:3001/api
```

### Products Endpoints

**GET /api/products** - Get all products with filtering
```javascript
// Query parameters (all optional):
{
  category: "chaussures",
  subcategory: "mocassins",
  gender: "homme",
  minPrice: 500,
  maxPrice: 2000,
  colors: "Noir,Marron",        // Comma-separated
  sizes: "40,41,42",            // Comma-separated
  inStock: true,
  page: 1,
  limit: 20,
  sortBy: "createdAt",          // Options: createdAt, price, name, rating
  sortOrder: "desc"             // Options: asc, desc
}

// Example requests:
GET /api/products?gender=homme&subcategory=mocassins&limit=10
GET /api/products?category=chaussures&inStock=true&sortBy=price&sortOrder=asc
GET /api/products?minPrice=1000&maxPrice=2000
```

**GET /api/products/:id** - Get single product by ID
```javascript
GET /api/products/67d607dc033ca42b418411f8

// Response:
{
  "success": true,
  "product": {
    "_id": "67d607dc033ca42b418411f8",
    "name": "Product Name",
    "price": 1200,
    // ... full product object
  }
}
```

**GET /api/products/categories** - Get all categories
```javascript
GET /api/products/categories

// Response:
{
  "success": true,
  "categories": [
    {
      "_id": {
        "category": "chaussures",
        "categoryName": "Chaussures"
      },
      "genders": [
        {
          "gender": "homme",
          "subcategories": [
            {"subcategory": "mocassins", "subcategoryName": "Mocassins"},
            {"subcategory": "boots", "subcategoryName": "Boots"}
          ]
        },
        {
          "gender": "femme",
          "subcategories": [
            {"subcategory": "mocassinos", "subcategoryName": "Mocassins"},
            {"subcategory": "sandales", "subcategoryName": "Sandales"}
          ]
        }
      ]
    }
  ]
}
```

### Testing API Endpoints
```bash
# Test main endpoint
curl "https://brendt-store-production-d6ef.up.railway.app/api/products?limit=5"

# Test specific subcategory
curl "https://brendt-store-production-d6ef.up.railway.app/api/products?subcategory=mocassins&gender=homme"

# Test specific product
curl "https://brendt-store-production-d6ef.up.railway.app/api/products/[PRODUCT_ID]"

# Test categories
curl "https://brendt-store-production-d6ef.up.railway.app/api/products/categories"

# Pretty print JSON with jq (if installed)
curl "https://brendt-store-production-d6ef.up.railway.app/api/products?limit=1" | jq
```

---

## ⚡ PERFORMANCE OPTIMIZATION

### Current Performance Metrics (February 2026)
```
Load Time: 4.3s (improved from 14.4s - 70% faster)
LCP (Largest Contentful Paint): 4.3s
CLS (Cumulative Layout Shift): 0 (perfect - down from 0.708)
Performance Scores:
  - Homepage: 85/100
  - Product Pages: 85/100
  - Category Pages: 77-80/100
```

### Image Optimization
```javascript
// next.config.mjs
const nextConfig = {
  images: {
    domains: ['brendt-store-production-d6ef.up.railway.app'],
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256]
  },
  compress: true,
  poweredByHeader: false
};

// Image Component Usage
<Image
  src={displayImage}
  alt={name}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
  priority={false}  // Lazy load unless above fold
  onError={() => setImageError(true)}
/>

// Priority loading for hero/logo
<Image
  src="/assets/images/logos/brendt-complet-logo.svg"
  alt="Brendt"
  width={180}
  height={60}
  priority  // Load immediately
/>
```

### CSS Performance Patterns
```css
/* Use aspect-ratio to prevent CLS */
.imageContainer {
  aspect-ratio: 3/4;
  background-color: #f5f5f5;
  contain: layout style paint;
}

/* Hardware-accelerated animations */
.productCard:hover .productImage {
  transform: scale(1.05);
  transition: transform 0.6s cubic-bezier(0.25, 0.45, 0.45, 0.95);
}

.infoBox {
  will-change: transform;
  transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
}
```

### Preconnect Hints
```html
<!-- In layout.js <head> -->
<link rel="preconnect" href="https://connect.facebook.net" />
<link rel="preconnect" href="https://brendt-store-production-d6ef.up.railway.app" />
```

---

## 🎯 FRONTEND ARCHITECTURE

### Component Hierarchy
```
App
├── ClientLayout
│   ├── CartProvider (Context)
│   ├── Header
│   │   ├── Desktop Navigation
│   │   │   └── Mega Menus (Homme, Femme, Cadeaux)
│   │   ├── Mobile Navigation
│   │   │   └── Hamburger Menu
│   │   ├── Search Overlay
│   │   ├── Cart Widget
│   │   ├── Wishlist Widget
│   │   └── Account Widget
│   ├── Main Content (page-specific)
│   └── Footer
│       ├── Newsletter Form
│       ├── Links Grid
│       └── Social Links
```

### State Management

**Cart Context** (Global State)
```javascript
// src/context/CartContext.js
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product, quantity = 1) => {
    // Add or update item in cart
  };

  const removeFromCart = (productId) => {
    // Remove item from cart
  };

  const clearCart = () => {
    // Empty cart
  };

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      itemCount,
      isCartOpen,
      setCartOpen: setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Usage in components:
import { useCart } from '@/context/CartContext';

const Component = () => {
  const { cartItems, addToCart, itemCount } = useCart();
  // ...
};
```

**Authentication Hook**
```javascript
// src/hooks/useAuth.js
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    // Clear tokens, etc.
  };

  return {
    isAuthenticated,
    user,
    logout
  };
};
```

### Responsive Design Implementation

**Mobile-First Breakpoints**
```css
/* Default mobile styles */
.hero {
  height: 85dvh;
  margin-top: -50px;
}

.productGrid {
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

/* Tablet (640px+) */
@media (min-width: 640px) {
  .hero {
    margin-top: 0;
  }

  .productGrid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .hero {
    height: 70dvh;
    margin-top: -20px;
  }

  .productGrid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
}
```

**Responsive Images**
```css
/* Different aspect ratios per device */
.imageContainer {
  aspect-ratio: 215/301;  /* iPhone 14 Pro Max - default */
}

@media (min-width: 390px) {
  .imageContainer {
    aspect-ratio: 207/289;  /* iPhone XR */
  }
}

@media (min-width: 640px) {
  .imageContainer {
    aspect-ratio: 192/268;  /* iPad Air */
  }
}

@media (min-width: 1024px) {
  .imageContainer {
    aspect-ratio: 232/324;  /* Desktop */
  }
}
```

---

## 🛠️ KEY FEATURES & INTERACTIONS

### Hero Carousel
```javascript
// Auto-playing carousel with 5 images
// Location: src/components/home/Hero/Hero.jsx

const images = [
  '/assets/images/trioimages/1.png',
  '/assets/images/trioimages/2.png',
  '/assets/images/trioimages/3.png',
  '/assets/images/trioimages/4.png',
  '/assets/images/trioimages/5.png'
];

// Features:
// - Auto-advance every 5 seconds
// - Manual navigation (arrows, dots)
// - Zoom animation on active slide
// - Responsive height (85dvh mobile, 70dvh desktop)
```

### Product Card Hover System
```javascript
// Image switching on hover
const [hovered, setHovered] = useState(false);

const defaultImage = color.images?.[0];
const secondImage = color.images?.[1] || color.images?.[0];

const displayImage = hovered && secondImage ? secondImage : defaultImage;

// Features:
// - Primary to secondary image switch on hover
// - Info box slides up from bottom
// - Product labels (Nouveau, Bestseller)
// - Lazy loading for performance
```

### Mega Menu System
```javascript
// Hover-based navigation with delay
const menuWithDropdowns = ['homme', 'femme', 'cadeaux'];
const megaMenuTimeoutRef = useRef(null);

const handleMenuMouseEnter = (menuName) => {
  if (menuWithDropdowns.includes(menuName)) {
    clearTimeout(megaMenuTimeoutRef.current);
    setActiveMegaMenu(menuName);
  }
};

const handleMenuMouseLeave = () => {
  megaMenuTimeoutRef.current = setTimeout(() => {
    setActiveMegaMenu(null);
  }, 300);  // 300ms delay before closing
};
```

### Body Scroll Lock
```javascript
// Prevent scrolling when overlays are open
useEffect(() => {
  if (isMobileMenuOpen || activeMegaMenu || isCartOpen || isWishlistOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }

  return () => {
    document.body.style.overflow = '';
  };
}, [isMobileMenuOpen, activeMegaMenu, isCartOpen, isWishlistOpen]);
```

---

## 🔒 SECURITY & CORS

### CORS Configuration
```javascript
// server/server.js
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'https://brendt-store.vercel.app',
  'https://brendtshoes.com',
  'https://www.brendtshoes.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
```

### Adding New Domains
```javascript
// If deploying to a new domain:
// 1. Add to allowedOrigins array
// 2. Commit and push to Railway
// 3. Wait for auto-deployment

// Example:
const allowedOrigins = [
  // ... existing domains
  'https://new-domain.com'
];
```

---

## 🐛 TROUBLESHOOTING

### Common Issues & Solutions

**Issue: Products not displaying on website**
```bash
# Check API is accessible
curl "https://brendt-store-production-d6ef.up.railway.app/api/products?limit=1"

# If API works but products don't show:
# 1. Check browser console for CORS errors
# 2. Verify NEXT_PUBLIC_API_URL in Vercel
# 3. Clear browser cache
# 4. Check Network tab for failed requests
```

**Issue: Images not loading**
```bash
# Verify image paths are correct:
# 1. Check products.json image paths
# 2. Confirm files exist in public/assets/images/
# 3. Check Next.js Image domains in next.config.mjs
# 4. Clear Vercel cache and redeploy

# Test single image path:
# https://brendtshoes.com/assets/images/products/brendt-new/homme/chaussures/mocassins/[Product]/[Color]/1.webp
```

**Issue: Inventory changes not appearing**
```bash
# Verify deployment completed:
# 1. Check Railway logs: railway logs
# 2. Test API directly: curl API_URL/products/[ID]
# 3. Clear browser cache
# 4. Wait full 2-3 minutes for deployment

# Force redeploy if needed:
git commit --allow-empty -m "Force redeploy"
git push
```

**Issue: Build failures**
```bash
# Frontend build fails:
cd /Users/almostaphasmart/Desktop/brendt-project/client
npm run build

# Check for:
# - ESLint errors (can ignore with eslint.config.js)
# - Missing dependencies
# - Syntax errors in components

# Backend build fails:
cd /Users/almostaphasmart/Desktop/brendt-project/server
npm start

# Check for:
# - MongoDB connection issues
# - Missing environment variables
# - Syntax errors in controllers/models
```

**Issue: Database connection errors**
```bash
# Test MongoDB connection:
cd /Users/almostaphasmart/Desktop/brendt-project/server

node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://brendt-admin:m7Er0FjetgTKEpyW@ce-yoy.l3gz0br.mongodb.net/brendt')
  .then(() => console.log('✓ Connected'))
  .catch(err => console.error('✗ Error:', err.message));
"

# If fails:
# 1. Check MongoDB Atlas is online
# 2. Verify connection string is correct
# 3. Check IP whitelist in Atlas
# 4. Verify database user credentials
```

---

## 📝 COMMON DEVELOPMENT PATTERNS

### Adding a New Component
```javascript
// 1. Create component file
// components/product/ProductQuickView/ProductQuickView.jsx

'use client';  // Next.js 13+ client component

import { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/common/Button/Button';
import { useCart } from '@/context/CartContext';
import styles from './ProductQuickView.module.css';

const ProductQuickView = ({ product, isOpen, onClose }) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const { addToCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Component content */}
      </div>
    </div>
  );
};

export default ProductQuickView;
```

```css
/* 2. Create CSS Module */
/* ProductQuickView.module.css */

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
}

.modal {
  background: var(--color-white);
  border-radius: var(--radius-md);
  max-width: 800px;
}

/* Mobile-first responsive */
@media (max-width: 768px) {
  .modal {
    width: 95%;
    max-height: 85vh;
  }
}
```

### Error Handling Pattern
```javascript
// Defensive programming for data access
const {
  _id,
  name,
  price,
  colors = [],  // Default to empty array
  sizes = [],
  isNewArrival,
  isBestseller
} = product || {};

// Safe array access
const defaultColor = colors[0] || {};
const defaultImage = defaultColor.images?.[0] || '/assets/images/placeholder.jpg';

// Image error fallback
const [imageError, setImageError] = useState(false);

<Image
  src={imageError ? '/assets/images/placeholder.jpg' : displayImage}
  onError={() => setImageError(true)}
  alt={name}
/>
```

### Import Organization
```javascript
// External libraries first
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingBag, FiSearch } from 'react-icons/fi';

// Internal hooks and services
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import productService from '@/services/productService';

// Components (relative imports)
import Button from '../../common/Button/Button';
import ProductCard from '../ProductCard/ProductCard';

// Styles last
import styles from './Component.module.css';
```

---

## 📋 QUICK REFERENCE CHEAT SHEET

### File Locations
```bash
# Product images
/client/public/assets/images/products/brendt-new/

# Product data source
/server/data/products.json

# Stock management script
/server/update-stock.js

# Import script
/server/import-to-production.js

# Frontend components
/client/src/components/

# API controllers
/server/controllers/productController.js

# Database models
/server/models/Product.js
```

### Essential Commands
```bash
# View all products with IDs
cd /server && node update-stock.js list

# Update stock
node update-stock.js update-product [ID] [true/false]

# Update price
node update-stock.js update-price [ID] [PRICE]

# Import products
node import-to-production.js

# Deploy backend
git add . && git commit -m "message" && git push

# Deploy frontend
cd /client && vercel --prod

# Test API
curl "https://brendt-store-production-d6ef.up.railway.app/api/products?limit=5"
```

### URLs to Remember
```
Live Website: https://brendtshoes.com
Backend API: https://brendt-store-production-d6ef.up.railway.app/api
Vercel Frontend: https://brendt-store.vercel.app
Railway Dashboard: https://railway.app
Namecheap DNS: https://www.namecheap.com
MongoDB Atlas: https://cloud.mongodb.com
```

### Important Notes
```
1. ALWAYS work from correct directory (client/ or server/)
2. Women's mocassins use "mocassinos" in database, not "mocassins"
3. Color names and size names are CASE-SENSITIVE
4. Deploy backend after ALL inventory changes
5. Frontend deploy only needed for UI/code changes
6. Wait 2-3 minutes for Railway deployment
7. Product IDs are permanent - use 'list' command to find them
8. Prices are in MAD without currency symbol
9. Images must be .webp format < 300KB
10. Test on multiple browsers after deployment
```

---

## 🎓 PROJECT PHILOSOPHY & BEST PRACTICES

### Code Quality Standards
- **Mobile-first**: Always start with mobile styles, enhance for desktop
- **Performance-first**: Optimize images, lazy load, use proper caching
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
- **Error resilience**: Defensive programming, fallbacks, graceful degradation
- **Component reusability**: DRY principle, single responsibility
- **Consistent naming**: BEM-like CSS, clear variable names
- **Type safety**: PropTypes for components, schema validation for data

### Development Workflow
1. **Plan**: Understand requirements, check existing patterns
2. **Develop**: Follow established patterns, mobile-first
3. **Test**: Multiple browsers, devices, edge cases
4. **Review**: Self-review code, check performance
5. **Deploy**: Test in staging, verify production
6. **Monitor**: Check errors, performance metrics

### Git Commit Best Practices
```bash
# Good commit messages:
"Added Penny Loafer product with 3 color variants"
"Fixed CLS issue in ProductCard component"
"Updated inventory - made sandals out of stock"
"Optimized hero carousel images (70% size reduction)"

# Bad commit messages:
"update"
"fix"
"changes"
"test"
```

---

## 🚀 NEXT STEPS & FUTURE ENHANCEMENTS

### Planned Features
- [ ] Product quick view modal
- [ ] Advanced filtering (price range, multiple filters)
- [ ] Wishlist persistence (localStorage/database)
- [ ] Recently viewed products
- [ ] Product reviews and ratings
- [ ] Size guide modal
- [ ] Virtual try-on (AR)
- [ ] Gift wrapping option
- [ ] Order tracking page
- [ ] Admin dashboard enhancements

### Performance Improvements
- [ ] Implement service worker for offline capability
- [ ] Add progressive web app (PWA) features
- [ ] Optimize bundle size with code splitting
- [ ] Implement virtual scrolling for large lists
- [ ] Add image preloading for product pages

### UX Enhancements
- [ ] Touch gestures for carousel (swipe)
- [ ] Product comparison feature
- [ ] Save cart for later
- [ ] Guest checkout option
- [ ] One-click reorder
- [ ] Product recommendations
- [ ] Email notifications

---

## 📞 SUPPORT & RESOURCES

### Documentation Resources
- Next.js Docs: https://nextjs.org/docs
- React Docs: https://react.dev
- MongoDB Docs: https://docs.mongodb.com
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs

### Internal Documentation
- All Notion docs: Brendt-Project MERN Stack database
- Frontend docs: Complete FRONT-END documentation
- Backend docs: Product Import System Guide
- Deployment docs: Publishing BRENDT - part FINAL
- Optimization docs: BRENDT - Optimization - PERF - DOC

### Quick Debug Checklist
- [ ] Check Railway logs for backend errors
- [ ] Check Vercel logs for frontend errors
- [ ] Verify environment variables are set
- [ ] Test API endpoints directly with curl
- [ ] Clear browser cache
- [ ] Check Network tab in DevTools
- [ ] Verify database connection
- [ ] Check CORS configuration
- [ ] Test on multiple browsers
- [ ] Verify deployment completed successfully

---

## ✅ FINAL CHECKLIST FOR CLAUDE CODE

When working on BRENDT project, always:

- [ ] Understand which part of the system you're modifying (frontend/backend)
- [ ] Work from correct directory (/client or /server)
- [ ] Follow mobile-first responsive design
- [ ] Use established component patterns
- [ ] Test on multiple device sizes
- [ ] Optimize images and assets
- [ ] Handle errors gracefully
- [ ] Deploy to correct environment
- [ ] Verify changes in production
- [ ] Update this documentation if making significant changes

---

**This document contains the complete, up-to-date state of the BRENDT e-commerce platform as of February 2026. All information is accurate and reflects the current production environment at brendtshoes.com.**

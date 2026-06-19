# BRENDT — CLAUDE REFERENCE
**Updated**: March 2026 | **Live**: https://brendtshoes.com | **Git**: Le-Yoy/brendt-store

---

## STACK & URLS
```
Frontend : Next.js 15.1.5 + React 19 → Vercel (auto-deploy on push)
Backend  : Node.js + Express          → Railway (auto-deploy on push, 2-3 min)
Database : MongoDB Atlas              → brendt cluster
Node req : v20+ required for Next.js build (use nvm use 20)
```
```
API          : https://brendt-store-production-d6ef.up.railway.app/api
Live site    : https://brendtshoes.com
Git remote   : https://github.com/Le-Yoy/brendt-store.git
```

### Railway (backend host) — account & service details
```
Railway account : "Le-Yoy's Projects" (login = leboutaleb@gmail.com / Google)
Project name    : sublime-purpose   ← THIS is brendt (random Railway name; the other project "vigilant-determination" is NOT ours)
Environment     : production
Service         : brendt-store  (GitHub-linked → auto-deploys on push to main)
Public domain   : brendt-store-production-d6ef.up.railway.app
Plan            : Hobby — $5/mo (billed monthly via Stripe, Visa …3426)
```
**Suspension diagnostic (learned Jun 2026):** if the API returns `HTTP 404` with header
`x-railway-fallback: true`, the service is NOT running (no container bound) — almost
always a billing/trial issue, not a code bug. Frontend (Vercel) stays up, so the login
page loads but every API call fails with "Login failed". Fix: Railway dashboard →
sublime-purpose → brendt-store → ensure plan active + Redeploy. NOT a credentials problem.

**Build config & the `cd server` trap (learned Jun 2026):** The backend deploy is driven by
`railway.toml` at the REPO ROOT (NOT a dashboard build command):
```
[deploy] startCommand = "cd server 2>/dev/null; npm start"
[environments.production.build] buildCommand = "cd server 2>/dev/null; npm install"
```
Original config used a hard `cd server && …`, which ONLY works when Railway's **Root Directory
is the repo root**. After the suspension/GitHub-reconnect, Railway's *Root Directory got set to
`server`* → `cd server` then looked for `server/server` → **every build failed**
(`cd: server: No such file or directory`) and nothing deployed for days. Fix shipped: `cd server
2>/dev/null; …` cds into server/ only if that subdir exists, so it works whether Root Directory
is `""` or `server`. If backend deploys ever stop landing again, check Railway → brendt-store →
**Deployments** for a FAILED build, and **Settings → Source → Root Directory** + the GitHub
connection ("GitHub Repo not found" = reconnect the repo).

**Deploy-verification trick:** to confirm a backend deploy actually landed, hit a NEW route added
in that deploy. `/api/admin/*` returns 401 on old AND new builds (the `protect` middleware runs
before route matching), so it can't tell them apart. A brand-new top-level mount (e.g.
`/api/atelier/orders`) returns **404 on the old build, 401 on the new** — an unambiguous signal.
```
Root  : /Users/almostaphasmart/Desktop/brendt-project/
Client: /Users/almostaphasmart/Desktop/brendt-project/client/
Server: /Users/almostaphasmart/Desktop/brendt-project/server/
```

---

## TEAM, WORKSPACES & ROLES

### Claude workspaces (terminal shortcuts)
| Shortcut | Opens | Purpose |
|---|---|---|
| `brendt-admin` (or `brendt-project`) | `~/Desktop/brendt-project` | This code repo — engineering work |
| `brendt-ads` | `~/Desktop/brendt-ads` | Marketing / Meta ads strategy (no code) |

### People
- **Owner / admin**: Mohamed Houssam Boutaleb — `brendt.contact@gmail.com` (full admin).
- **Simo BALO** — *Atelier operator*. Runs the workshop (atelier) where the shoes are crafted
  (his father owns it; friend of the owner). In practice he handles nearly all operations:
  **crafts/prepares the merchandise, stocks it, manages stock, and ships orders** (owner sends
  the transport; Simo's team packages with their own packaging). He gets his own restricted
  account via a **self-signup invite link** (role `atelier`).

### Role permissions (target design)
**`atelier` (Simo)** can:
- See orders + amounts (amounts needed for COD cash collection).
- Advance order status: **confirm → prepare (packed) → ship** (with carrier + tracking number).
- Add **comments/notes** on orders.
- **Propose** stock changes — quantity edits AND new colors/products — which the **admin must
  approve (yes/no)** before they go live (uses the existing inventory-approval flow).
- See a **"stock to craft"** list (low/out-of-stock, sorted by sales velocity) and order urgency.

`atelier` **cannot**: see revenue/analytics dashboards, manage users, change prices, or delete
anything. All financial/business views stay admin-only.

### Planned workstreams (decided June 2026)
1. `atelier` role + Simo's focused operator view (action queue + stock-to-craft).
2. Stock-change approval queue (Simo proposes → admin confirms).
3. Notifications to Simo's iPhone (new order + urgent stock) — **Telegram bot** (easy/reliable) +
   in-app toast/sound when the app is open.
4. Self-signup invite link for the `atelier` role.
5. Later: PayPal/card checkout for EU/USA; Meta ads (in the `brendt-ads` workspace). Analytics
   already defines revenue as "delivered OR paid", so card/PayPal orders need no rework.

---

## CRITICAL LESSONS (read before touching anything)

### 1. The index.jsx trap — ALREADY FIXED, DO NOT RECREATE
The `ProductCard/` and `ProductGrid/` folders each had an **old broken `index.jsx`** that took import resolution priority over `index.js`. This caused:
- Category pages using synthetic color-variant IDs in URLs → "Produit non trouvé"
- Prices shown in € instead of MAD
- No hover/stock/color-variant logic

**Fix applied (March 2026):** Both old `index.jsx` files were deleted. Only `index.js` barrel exports remain, correctly pointing to the real components.

**Rule**: If you ever create a new component folder, use ONLY `index.js` for barrel exports, never `index.jsx`.

### 2. ALWAYS import ProductCard directly
```javascript
// CORRECT — always use this
import ProductCard from '@/components/products/ProductCard/ProductCard';
// or via barrel (index.js → ProductCard.jsx)
import ProductCard from '@/components/products/ProductCard';

// NEVER create an index.jsx in a component folder
```

### 3. Color variant URL construction
The category page expands multi-color products into synthetic objects for the grid:
```javascript
// In category/[categoryId]/page.jsx → expandProductsWithColorVariants()
{
  ...product,
  _id: `${product._id}-color-${colorName}-${index}`,  // SYNTHETIC — never use as URL
  isColorVariant: true,
  originalProductId: product._id,                      // REAL MongoDB ID
  displayImage: color.images[0],
  selectedColor: color,
  displayColorIndex: index
}
```
ProductCard detects `isColorVariant` and uses `originalProductId` for the URL:
```
/products/{originalProductId}?color={colorName}&colorIndex={index}
```
**Never pass synthetic `_id` to a URL.** If products break again, check this logic first.

### 4. Railway cold starts
Backend sleeps on inactivity. `layout.jsx` pings it every 10 min to prevent cold starts:
```javascript
fetch('https://brendt-store-production-d6ef.up.railway.app/api/products?limit=1').catch(()=>{})
```

### 5. Images must be committed to git
Static product images live in `client/public/assets/`. They deploy via Vercel only when committed. If images are missing on the live site, check `git status` — they may be untracked.

### 6. API response format asymmetry
```javascript
GET /api/products     → { data: [...], totalProducts, ... }   // array in .data
GET /api/products/:id → product object directly               // no wrapper
```
Handle both: `const product = response.data || response`

---

## KEY FILES MAP

```
client/src/
├── app/
│   ├── layout.jsx                          # Root layout, FB pixel, Railway ping
│   ├── page.jsx                            # Homepage
│   ├── category/[categoryId]/page.jsx      # Category grid + color expansion
│   └── products/[productId]/page.jsx       # Product detail page
├── components/
│   ├── layout/Header/
│   │   ├── Header.jsx                      # Main header
│   │   ├── MegaMenu.jsx                    # Desktop dropdown (fetches 5 products/subcategory)
│   │   ├── MobileMenu.jsx                  # Hamburger menu
│   │   └── menuData.js                     # Static category structure
│   ├── home/FeaturedProducts/
│   │   └── FeaturedProductCard.jsx         # Card used on homepage (different from ProductCard)
│   ├── products/
│   │   ├── ProductCard/
│   │   │   ├── ProductCard.jsx             # THE real card component (category pages)
│   │   │   ├── ProductCard.module.css
│   │   │   └── index.js                    # Barrel: export { default } from './ProductCard'
│   │   └── ProductGrid/
│   │       ├── ProductGrid.jsx             # Full grid with skeleton loading
│   │       └── index.js                    # Barrel: re-exports ProductGrid.jsx
│   └── product/
│       ├── ProductGallery.jsx              # Image gallery with touch gestures
│       ├── ProductInfo.jsx                 # Add to cart, size/color selection
│       └── ProductAdditionalInfo.jsx       # Details, care, shipping
├── contexts/CartContext.jsx                # Cart state + FB pixel tracking
├── hooks/useCart.js                        # Cart hook (wraps context)
├── services/productService.js             # API calls (no getMockProduct — removed)
└── utils/facebookPixel.js                 # FB Pixel helpers

server/
├── controllers/productController.js       # Maps femme mocassins→mocassinos
├── models/Product.js
├── data/products.json                     # Source of truth for product import
└── scripts/
    ├── import-to-production.js            # Reimports all from products.json
    └── update-stock.js                    # Stock/price management CLI
```

---

## DESIGN SYSTEM (quick ref)
```css
Fonts    : Cormorant (luxury headings) + Inter (body) — loaded in layout.jsx
Accent   : #d4af37  (gold)
Dark     : #000000
Error    : #dc2626
Currency : MAD (always — never €)
Language : French (all UI text)
Images   : .webp preferred, .jpg accepted, 800×1000px, <300KB
Breakpoints: 390 / 640 / 768 / 1024 / 1280px (mobile-first)
```

---

## DATABASE
```javascript
// MongoDB Atlas — brendt DB
URI: mongodb+srv://brendt-admin:m7Er0FjetgTKEpyW@ce-yoy.l3gz0br.mongodb.net/brendt

// ⚠️ SUBCATEGORY TRAP — femme uses different spelling
homme: "mocassins"    femme: "mocassinos"   // backend auto-maps from URL
homme: "boots"        femme: "sandales"
// Both: "babouches", "accessoires"

// Product price fields
price: Number         // Current price in MAD
previousPrice: Number // Old price (shown struck through if > price)

// Color variant structure
colors: [{ name, code, images: [String], inStock, stock }]
// Color names and size names are CASE-SENSITIVE
```

---

## IMAGE PATHS
```
Pattern: /assets/images/products/brendt-new/[Homme|Femme]/[category]/[subcategory]/[Product Name]/[Color-Name]/[1-5].webp

Examples:
/assets/images/products/brendt-new/Homme/chaussures/mocassins/Tarhazout/Anchor-Point/1.webp
/assets/images/products/brendt-new/Femme/chaussures/babouches/Beige/1.jpg

Note: Folder names use Title Case (Homme/Femme), some older products use lowercase.
      Check actual folder with ls before writing a path.
      ALL new image files must be git committed to appear on Vercel.
```

---

## DEPLOY

```bash
# Both frontend and backend deploy automatically on git push
git add [files]
git commit -m "description"
git push origin main
# Vercel: ~1-2 min | Railway: ~2-3 min

# Verify deploy worked
curl -s -o /dev/null -w "%{http_code}" "https://brendtshoes.com/category/chaussures?gender=femme"
curl -s "https://brendt-store-production-d6ef.up.railway.app/api/products?limit=1"

# Frontend build check (requires Node 20)
source ~/.nvm/nvm.sh && nvm use 20 && npm run build
# Working directory for build: /client
```

**Frontend deploy needed:** UI changes, component edits, new images, CSS, layout
**Backend deploy needed:** Stock changes, price changes, new products imported, API logic

---

## INVENTORY CLI
```bash
cd /Users/almostaphasmart/Desktop/brendt-project/server

node update-stock.js list                                          # all products + IDs
node update-stock.js update-product [ID] [true|false]             # in/out of stock
node update-stock.js update-color-stock [ID] "[Color]" [true|false]  # per color
node update-stock.js update-size [ID] "[Size]" [true|false]       # per size
node update-stock.js update-price [ID] [PRICE]                    # price in MAD
node update-stock.js update-color-price [ID] "[Color]" [PRICE]    # per-color price

node scripts/import-to-production.js   # reimport ALL from data/products.json (clears DB)
```
Always `git push` after inventory changes so Railway picks them up.

---

## TROUBLESHOOTING

| Symptom | First check |
|---|---|
| "Produit non trouvé" from category | ProductCard using synthetic `_id`? Check `isColorVariant && originalProductId` logic |
| Images broken on live site | Are files committed? `git status` → `git add` the images |
| Prices showing € | Old `index.jsx` shadowing the real component — delete it |
| API returns 502/timeout | Railway cold start — wait 30s and retry, or check railway logs |
| Build fails locally | Node version — run `nvm use 20` first |
| Products missing after import | Check `data/products.json` + run `node scripts/import-to-production.js` then push |
| CORS error in browser | Add new domain to `allowedOrigins` in `server/server.js` |

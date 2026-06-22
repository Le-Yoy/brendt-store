# BRENDT — International Expansion (EU + USA) — Engineering Plan
**Decided**: June 2026 | Status: PLANNING (no code yet — 2 blockers below)

Goal: sell to EU + USA alongside Morocco. One site, region-aware. Morocco stays COD/virement;
EU/USA get PayPal + correct currency + English.

## Locked decisions
- **Pricing**: manual price per currency (MAD base + explicit EUR + USD per product). NOT live FX.
  International prices must absorb shipping + duties + PayPal fees (DDP, see below).
- **Languages**: FR (default) + EN, via **next-intl** with locale-prefixed URLs (`/fr`, `/en`). Phased.
- **Payments**: PayPal only to start (PayPal JS SDK + server create/capture). Morocco never sees it.
- **Shipping**: **DDP** — all-in price, customer pays nothing at the door. Duties baked into EUR/USD price.

## 🔴 BLOCKERS — resolve before international checkout ships
1. **PayPal receive + withdraw from Morocco.** Confirm the "Jobebe" account can actually RECEIVE
   international payments AND withdraw to a usable bank. PayPal MA has historically been restricted.
   Make-or-break. Get API credentials (Client ID + Secret) from the "Identifiants API" section.
2. **Carrier + duty rates.** Pick carrier (DHL/UPS/Aramex), get per-zone shipping cost + duty/VAT
   estimates → these set the EUR/USD prices (DDP). Define the international delivery promise (days).

## Architecture (by area)
### Region detection
- Next.js middleware reads Vercel's `x-vercel-ip-country` → sets `region` cookie (MA/EU/US/OTHER).
- Header shows current region + manual switcher (overrides cookie). Currency derives from region.

### Currency & pricing
- Product model: add `priceEUR`, `priceUSD` (alongside MAD `price`); per-color override if needed.
- Admin UI: fields to set EUR/USD per product.
- Frontend: a Region/Currency context formats + picks the right price by region.

### Language (next-intl)
- Locale-prefixed routes `/fr` (default) + `/en`. Extract all FR strings → `messages/fr.json` + `en.json`.
- Region→language defaults: MA→FR, EU→FR|EN, US→EN. Manual language toggle (independent of currency).
- Phase by page: home → category → product → checkout → rest.

### Payments (region-gated)
- Checkout reads region: MA → COD + virement; EU/US → PayPal (covers guest cards too).
- Backend ENFORCES allowed method per region (never trust client). Store PayPal order ID on the order.

### Order model
- Add `currency` (MAD/EUR/USD) + `region` + `paymentReference`. Amounts stored in transacted currency.

### Analytics (must update)
- Current analytics sums `totalPrice` — mixing MAD+EUR+USD is invalid. Report per-currency (or
  convert to a base for a combined view). Pixel/CAPI must send correct value+currency.

### Sizing (US)
- Size schema already has `eu/uk/us`. Show US sizes to US visitors + a size guide. Easy trust win.

### Legal / trust
- EU VAT (IOSS for <€150), per-region returns policy, GDPR (cookie consent exists). Shipping/returns/
  duties clearly stated. Reviews + secure-checkout badges for cold Meta traffic.

## Meta / ads technical handoff (for brendt-ads)
- Meta Pixel + **Conversions API** firing `Purchase` with correct value+currency per region.
- **Product catalog feed** (EUR/USD prices, stock) for Advantage+/dynamic product ads.
- Domain verification, Aggregated Event Measurement, UTM convention.

## Build order (once blockers cleared)
1. Data model: multi-currency prices + order currency/region.
2. Region/currency context + edge geo middleware + header switcher (can start now with placeholder prices).
3. Region-gated payments + PayPal checkout.
4. next-intl FR/EN (phased).
5. Analytics multi-currency + Pixel/CAPI/catalog.

---

## PROGRESS LOG

### ✅ SHIPPED & LIVE (June 2026) — region-aware browsing
Steps 1 & 2 of the build order are deployed to production. Morocco experience is 100% unchanged.
- **Data model** (`server/models/Product.js`, `Order.js`): `priceEUR` / `priceUSD` (null default),
  order `currency` (MAD/EUR/USD, default MAD) + `region` (MA/EU/US/OTHER, default MA). Additive/backward-compatible.
- **Mock prices**: all 70 products have EUR/USD = round5(MAD × 0.275) / round5(MAD × 0.30) (e.g. 890 → €245/$265).
  These are PLACEHOLDERS — replace with real DDP prices later (see blocker #2).
- **Region engine**:
  - `client/src/middleware.js` — Vercel edge geo (`x-vercel-ip-country`) → sets `region` cookie. Verified live.
    (Next deprecation note: rename `middleware` → `proxy` convention in a cleanup; works as-is.)
  - `client/src/contexts/RegionContext.jsx` — `useRegion()` → `region`, `setRegion`, `priceOf(product)`,
    `format(amount)`, `formatProduct(product)`. MAD fallback when EUR/USD not set.
  - `client/src/utils/currency.js` — region→currency map, country→region, formatting.
  - Wired into `client/src/app/layout.jsx` (RegionProvider).
- **Header switcher** (`components/layout/Header/Header.jsx`) — 🇲🇦 MAD / 🇪🇺 EUR / 🇺🇸 USD select.
- **Region-aware price display**: `ProductCard`, `ProductPrice`, `FeaturedProductCard`, `ProductInfo`,
  `RelatedProducts`. MA = exact MAD + compare-at; EU/US = single regional price.

### ⏳ NOT YET DONE
- **Cart + checkout + PayPal** (step 3) — cart still MAD/COD. Built together so cart total == amount charged.
- **next-intl FR/EN** (step 4). **Analytics multi-currency + Meta Pixel/CAPI/catalog** (step 5).
- Replace mock EUR/USD prices with real DDP prices.

### PayPal — env vars to set (when we build checkout)
Account: business "Jobebe", cleared for live PayPal payments. Client IDs received (sandbox + live `BAAH…`).
We build/test on **Sandbox** first.
- **Railway (backend)**: `PAYPAL_ENV=sandbox` · `PAYPAL_CLIENT_ID=<sandbox client id>` · `PAYPAL_SECRET=<sandbox secret>`
- **Vercel (frontend)**: `NEXT_PUBLIC_PAYPAL_CLIENT_ID=<sandbox client id>`
- Go live later = swap the 3 values to the live app + set `PAYPAL_ENV=live`.
- Secrets ONLY in these dashboards, never in code/git.

### Owner TODO (operational, parallel — not blocking sandbox build)
1. Pick carrier (DHL/UPS/Aramex) + get shipping & duty rates → these set the REAL DDP EUR/USD prices.
2. Provide real EUR/USD prices when ready (mock ×3 live now).
3. (Optional, saves a step) pre-add the PayPal **sandbox** env vars above to Railway + Vercel.

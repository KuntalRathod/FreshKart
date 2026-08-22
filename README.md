# FreshKart - Online Grocery Store

A full-stack e-commerce platform for grocery delivery built with the MERN stack and TypeScript. Features AI-powered product management, Stripe payments, dual cart system (guest + authenticated), and a complete admin dashboard with analytics.

![Tech Stack](https://img.shields.io/badge/React_19-blue?style=flat&logo=react) ![Tech Stack](https://img.shields.io/badge/Express_5-black?style=flat&logo=express) ![Tech Stack](https://img.shields.io/badge/MongoDB-green?style=flat&logo=mongodb) ![Tech Stack](https://img.shields.io/badge/TypeScript-blue?style=flat&logo=typescript) ![Tech Stack](https://img.shields.io/badge/Stripe-purple?style=flat&logo=stripe) ![Tech Stack](https://img.shields.io/badge/Tailwind_CSS_4-cyan?style=flat&logo=tailwindcss)

---

## Tech Stack

### Backend
- **Runtime**: Node.js + TypeScript
- **Framework**: Express 5
- **Database**: MongoDB with Mongoose 9
- **Authentication**: Passport.js JWT (httpOnly cookie-based)
- **Validation**: Zod 4
- **Payments**: Stripe (Checkout Sessions + Webhooks)
- **Image Upload**: Cloudinary + Multer (memory storage, stream upload)
- **AI**: Google Gemini via Vercel AI SDK (product title/description generation)
- **Other**: bcryptjs, slugify, cookie-parser, CORS

### Frontend
- **Framework**: React 19 + Vite
- **State Management**: Zustand 5 (with persist middleware)
- **Server State**: TanStack React Query 5
- **Styling**: Tailwind CSS 4 + Radix UI + shadcn/ui
- **Forms**: React Hook Form + Zod resolver
- **Maps**: Leaflet + React Leaflet
- **Animations**: Motion (Framer Motion)
- **Other**: Axios, Embla Carousel, Sonner (toasts), cmdk (command palette), Lucide icons

---

## Features

### Customer Features
- **Product Browsing** — Browse by category, search with keyword, filter by price range/discount/stock status, sort by price/date/discount
- **Product Details** — Image carousel, related products, reviews with rating breakdown
- **Dual Cart System** — Works for both guests (cookie-based) and logged-in users. Guest cart automatically merges into user cart on login/registration
- **Optimistic Cart Updates** — Instant UI feedback with 500ms debounced server sync and automatic rollback on failure
- **Checkout** — Choose delivery address (with map-based picker), select payment method (Stripe card or Cash on Delivery)
- **Stripe Payments** — Redirects to Stripe Checkout, webhook confirms payment and triggers stock deduction
- **Order Tracking** — Full status lifecycle (Placed → Confirmed → Assigned → Packed → Out for Delivery → Delivered)
- **Reviews** — Rate and review delivered products (one review per purchased item, enforced by unique index)
- **Address Management** — Multiple saved addresses with Leaflet map integration for location selection
- **Dark/Light Mode** — Theme toggle via next-themes

### Admin Features
- **Analytics Dashboard** — Total sales, total orders, total users, total products, out-of-stock count
- **Product Management** — Create products with multi-image upload to Cloudinary, manage active/inactive status
- **AI-Powered Content** — Google Gemini generates Instacart-style product titles and descriptions from the admin panel
- **Order Management** — View all orders (paginated), update status with notes, full status history tracking
- **Role-Based Access** — Admin routes protected by JWT + role middleware

### Security & Architecture
- **httpOnly Cookie Auth** — JWT stored in httpOnly cookie (`instant_access_token`), preventing XSS token theft
- **Server-Side Price Calculation** — Totals (subtotal, tax, delivery fee) always computed from DB prices, never trusted from client
- **Stripe Webhook Verification** — Signature verification before processing payment events
- **Zod Validation** — All request bodies/queries validated before reaching services
- **Stock Management** — Deducted on order creation (COD) or on Stripe webhook confirmation (card)
- **Free Delivery Threshold** — Orders above $20 get free delivery, otherwise $4.99 fee
- **Tax Calculation** — 8% tax applied server-side

---

## Project Structure

```
FreshKart/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, Passport, Stripe, Cloudinary, env configs
│   │   ├── constants/       # Enums (order status, payment methods) & constants (tax rate, delivery fee)
│   │   ├── controllers/     # Route handlers wrapped in asyncHandler
│   │   ├── lib/ai/          # AI prompts for Gemini (title rephrase, description generation)
│   │   ├── middlewares/     # asyncHandler, errorHandler, multer upload, requireAdmin
│   │   ├── models/          # Mongoose schemas (User, Product, Category, Cart, Order, Address, Review)
│   │   ├── routes/          # Express route definitions
│   │   ├── seeds/           # Database seeders (categories, products)
│   │   ├── services/        # Business logic as plain async functions
│   │   ├── utils/           # Helpers (AppError, bcrypt, cart calc, cloudinary, cookies, price calc)
│   │   ├── validators/      # Zod schemas for request validation
│   │   ├── webhooks/        # Stripe webhook handler
│   │   └── index.ts         # App entry point
│   ├── .env.example
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/      # Reusable UI components (shadcn/ui based)
│   │   ├── constants/       # Frontend constants (address schema, checkout, order status labels)
│   │   ├── hooks/           # Custom hooks (use-cart, use-auth, use-user, use-debounce, use-mobile)
│   │   ├── layouts/         # App layout, account layout, admin layout
│   │   ├── lib/             # Axios client, API functions, utilities
│   │   ├── pages/           # Route pages
│   │   │   ├── home/        # Landing page (hero, categories, deals)
│   │   │   ├── products/    # Product listing with filters
│   │   │   ├── product-detail/  # Single product view
│   │   │   ├── search-results/  # Search results
│   │   │   ├── checkout/    # Checkout flow
│   │   │   ├── orders/      # Order list + detail
│   │   │   ├── account/     # Reviews, addresses
│   │   │   ├── admin/       # Dashboard, products, orders management
│   │   │   └── not-found/   # 404 page
│   │   ├── App.tsx          # Router + providers setup
│   │   └── index.css        # Global styles + Tailwind
│   └── package.json
└── README.md
```

---

## API Endpoints

### Auth (`/api/auth`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login with email/password |
| POST | `/logout` | Logout (clear auth cookie) |
| GET | `/status` | Get current authenticated user |

### Products (`/api/products`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | List products (paginated, filterable, sortable) |
| GET | `/deals` | Get top discounted products |
| GET | `/:slug` | Get product by slug + related products |
| GET | `/:slug/reviews` | Get product reviews with rating breakdown |

### Categories (`/api/categories`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | List all active categories |

### Cart (`/api/cart`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Get cart with server-calculated totals |
| POST | `/` | Upsert cart (full item array replace) |

### Addresses (`/api/addresses`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Get all user addresses |
| POST | `/` | Create new address |

### Orders (`/api/orders`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/` | Create order (from cart + address + payment method) |
| GET | `/` | List user's orders |
| GET | `/:id` | Get single order by ID |

### Reviews (`/api/reviews`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/` | Create review (requires delivered order item) |
| GET | `/` | Get user's reviews |
| GET | `/reviewable` | Get order items eligible for review |

### Admin (`/api/admin`)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/analytics` | Dashboard analytics |
| GET | `/orders` | List all orders (paginated) |
| PUT | `/orders/:id/status` | Update order status |
| GET | `/products` | List all products for admin |
| POST | `/products` | Create new product |
| POST | `/products/upload` | Upload product images to Cloudinary |
| POST | `/ai/generate` | AI title rephrase or description generation |

### Webhook (`/api/webhook`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/stripe` | Stripe webhook (payment confirmation) |

---

## Database Models

### User
| Field | Type | Notes |
|-------|------|-------|
| name | String | Required |
| email | String | Unique, required |
| password | String | Hashed with bcrypt, excluded from JSON |
| role | Enum | `user` or `admin` |
| phone | String | Optional |
| avatar | String | Optional |

### Product
| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId | Ref: User (creator) |
| categoryId | ObjectId | Ref: Category |
| name | String | Required |
| slug | String | Auto-generated from name (slugify) |
| description | String | Optional |
| images | String[] | Cloudinary URLs |
| originalPrice | Number | Required |
| salePrice | Number | Auto-calculated from originalPrice & discountPercent |
| discountPercent | Number | Default: 0 |
| discountLabel | String | e.g., "Save 34%" |
| unit | String | Default: "pc" (e.g., "1 kg", "500ml") |
| stockCount | Number | Default: 0 |
| ratingAverage | Number | Aggregated from reviews |
| reviewCount | Number | Aggregated from reviews |
| isActive | Boolean | Default: true |

### Category
| Field | Type | Notes |
|-------|------|-------|
| name | String | Required |
| slug | String | Auto-generated from name |
| imageUrl | String | Category image |
| description | String | Optional |
| isActive | Boolean | Default: true |

### Cart
| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId | Nullable (null for guest carts) |
| guestCartId | String | Nullable (null for authenticated carts) |
| items | Array | `[{ productId, quantity }]` |

### Order
| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId | Ref: User |
| orderNo | String | Auto-generated: "ORD-{timestamp}{random}" |
| items | Array | `[{ productId, name, image, originalPrice, discountPercent, salePrice, quantity, isReviewed }]` |
| shippingAddress | Object | Embedded: recipientName, phone, street, city, state, postalCode, country |
| paymentMethod | Enum | `card` or `cash_on_delivery` |
| paymentStatus | Enum | `pending`, `paid`, `failed`, `refunded` |
| status | Enum | `placed`, `confirmed`, `assigned`, `packed`, `out_for_delivery`, `delivered`, `cancelled` |
| statusHistory | Array | `[{ status, note, date }]` — full lifecycle tracking |
| subtotal | Number | Server-calculated |
| deliveryFee | Number | $0 if subtotal >= $20, else $4.99 |
| tax | Number | 8% of subtotal |
| total | Number | subtotal + deliveryFee + tax |

### Address
| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId | Ref: User |
| recipientName | String | Required |
| phone | String | Required |
| street | String | Required |
| city | String | Required |
| state | String | Required |
| postalCode | String | Required |
| country | String | Required |
| isDefault | Boolean | Default: false |

### Review
| Field | Type | Notes |
|-------|------|-------|
| userId | ObjectId | Ref: User |
| orderId | ObjectId | Ref: Order |
| orderItemId | ObjectId | Unique index (one review per order item) |
| productId | ObjectId | Ref: Product |
| rating | Number | 1-5 |
| comment | String | Optional |

---

## Cart Sync Mechanism

The cart uses an **optimistic update + debounced sync** pattern:

1. **Local state first** — All mutations (add, update, remove) immediately update Zustand store
2. **Snapshot for rollback** — Before any mutation, captures current items as rollback point
3. **Debounced server sync** — After 500ms of inactivity, sends full cart to `POST /api/cart`
4. **Server response** — On success, updates with server-calculated totals (subtotal, tax, delivery, total)
5. **Rollback on failure** — On error, reverts items to the pre-mutation snapshot
6. **Persistence** — Cart items persisted to localStorage via Zustand persist (key: `instant-cart`)
7. **Stock validation** — Client-side stock check before add/update; server validates and caps quantity

---

## Stripe Payment Flow

```
1. User clicks "Place Order" with card payment
2. Backend creates Stripe Checkout Session with line items + metadata (orderId)
3. User is redirected to Stripe-hosted checkout page
4. On payment success, Stripe sends webhook to POST /api/webhook/stripe
5. Backend verifies webhook signature
6. On "checkout.session.completed":
   - Sets paymentStatus → PAID
   - Sets order status → CONFIRMED
   - Adds to statusHistory
   - Clears user's cart
   - Deducts stock for each item
7. On "checkout.session.expired":
   - Sets paymentStatus → FAILED
   - Sets order status → CANCELLED
```

---

## AI Integration

The admin panel uses Google Gemini (via Vercel AI SDK) for:

- **Title Rephrase** — Converts plain product names into Instacart-style formatted titles (Brand, Count, Descriptors, Product Type, Size/Unit)
- **Description Generation** — Generates short, factual product descriptions highlighting freshness, quality, and uses

Triggered from the admin "Create Product" page via `POST /api/admin/ai/generate`.

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Stripe account (for payments)
- Cloudinary account (for image uploads)
- Google AI API key (for Gemini integration)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/KuntalRathod/FreshKart.git
cd FreshKart
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../client
npm install
```

4. **Set up environment variables**

Create `backend/.env`:
```env
NODE_ENV=development
PORT=8000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>

JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=7d

STRIPE_SECRET_KEY=sk_test_<your-stripe-secret-key>
STRIPE_WEBHOOK_SECRET=whsec_<your-stripe-webhook-secret>

FRONTEND_ORIGIN=http://localhost:5173

CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>

GOOGLE_GENERATIVE_AI_API_KEY=<your-google-ai-key>
```

Create `client/.env`:
```env
VITE_BASE_API_URL=http://localhost:8000/api/
```

5. **Seed the database** (optional)
```bash
cd backend
npm run seed:categories
npm run seed:products
```

6. **Run development servers**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Backend: `http://localhost:8000` | Frontend: `http://localhost:5173`

---

## Available Scripts

### Backend
| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with nodemon (hot reload) |
| `npm run build` | Build for production (tsup → dist/) |
| `npm start` | Run production build |
| `npm run seed:categories` | Seed 9 product categories |
| `npm run seed:products` | Seed sample products |

### Frontend
| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + Vite production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## Production Build

The backend builds with `tsup` to `dist/index.js`. In production mode, Express serves the React client's static build from `../../client/dist` and handles SPA routing by serving `index.html` for all non-API routes.

```bash
# Build both
npm install --prefix client && npm run build --prefix client
npm install --prefix backend && npm run build --prefix backend

# Run
node backend/dist/index.js
```

---

## Seed Data

### Categories (9 total)
Beverages, Snacks, Bakery, Baby Care, Frozen Foods, Fruits & Vegetables, Meat & Seafood, Pantry Staples, Personal Care

### Sample Products
- Fresh Apples (Fruits & Vegetables)
- Organic Bananas (Fruits & Vegetables)
- Whole Wheat Bread (Bakery)
- Orange Juice (Beverages)

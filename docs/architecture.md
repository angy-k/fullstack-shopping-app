# Architecture – Fullstack Shopping App

## Overview

This fullstack shopping app is built as a **monorepo** containing:

- `frontend/` — Vue 3 SPA using Vuetify + Pinia
- `backend/` — Laravel RESTful API with Sanctum authentication
- `docs/` — Diagrams, planning, architecture notes

It uses Docker to streamline the development environment.

---

## Folder Structure

fullstack-shopping-app/
├── backend/ # Laravel app
│ ├── app/Models
│ ├── routes/api.php
│ └── database/migrations/
├── frontend/ # Vue 3 + Vuetify SPA
│ ├── src/components
│ │ ├── global/     # Globally registered components
│ │ └── skeletons/  # Loading skeleton components
│ │     ├── auth/      # Auth-related skeletons
│ │     ├── ui/        # UI-related skeletons
│ │     └── common/    # Base skeleton components
│ ├── src/layouts    # Application layouts
│ ├── src/views
│ │ └── auth/      # Authentication views
│ ├── src/stores
│ ├── src/router
│ ├── src/utils
│ └── src/services
├── docs/ # Planning, diagrams
│ └── diagrams/
└── docker-compose.yml

---

## Database & Models

- `users` — Authenticated users (for cart sync and protected actions)
- `products` — Products imported from Fake Store API
- `categories` — Product categories
- `carts` — Shopping carts belonging to users (one active cart per user)
- `cart_items` — Items in user's cart with quantity and price at time of adding (expires after 3 days)
- `orders` — Confirmed checkouts with user info, status, and total price
- `order_items` — Items linked to an order with quantity and price at time of order

*See: `docs/diagrams/eer-model.png`*

---

## Auth Strategy

- Backend uses **Laravel Sanctum** for SPA authentication
- Frontend stores token via HttpOnly cookie
- Guests can use localStorage for cart; upon login, cart syncs to database

---

## 🔌 API Endpoints

### Product Endpoints

| Endpoint                    | Method | Auth? | Description                                |
|----------------------------|--------|-------|-----------------------------------------|
| `/api/products`            | GET    | No    | Fetch product list                         |
| `/api/products/{id}`       | GET    | No    | Get product details                        |
| `/api/products/{id}`       | PUT    | Yes   | Update product (title, price, image, etc.) |
| `/api/categories`          | GET    | No    | Fetch all categories                       |

### Cart Endpoints

| Endpoint                    | Method | Auth? | Description                                |
|----------------------------|--------|-------|-----------------------------------------|
| `/api/cart`                | GET    | Yes   | Get current user's cart                    |
| `/api/cart/items`          | POST   | Yes   | Add item to cart                           |
| `/api/cart/items/{id}`     | PATCH  | Yes   | Update cart item quantity                  |
| `/api/cart/items/{id}`     | DELETE | Yes   | Remove item from cart                      |
| `/api/cart`                | DELETE | Yes   | Clear entire cart                          |
| `/api/cart/merge`          | POST   | Yes   | Merge guest cart with user cart            |

### Order Endpoints

| Endpoint                    | Method | Auth? | Description                                |
|----------------------------|--------|-------|-----------------------------------------|
| `/api/orders`              | GET    | Yes   | Get all user orders                        |
| `/api/orders/{id}`         | GET    | Yes   | Get specific order details                 |
| `/api/orders`              | POST   | Yes   | Create a new order from cart               |
| `/api/orders/{id}/cancel`  | PATCH  | Yes   | Cancel an existing order                   |

---

## Data Flow Overview

### Product Import
1. Laravel command fetches from Fake Store API
2. Products are created/updated locally
3. Related categories are synced

### Cart System
- **Guest Users**:
  - Cart stored in `localStorage` using Pinia store
  - Items include product ID, title, price, image URL, and quantity
  - Cart persists across browser sessions

- **Authenticated Users**:
  - Cart stored in database (`carts` and `cart_items` tables)
  - Each user has one active cart with multiple cart items
  - Cart items store product reference, quantity, and price at time of adding
  - Old cart items (>3 days) automatically cleaned up via scheduled command

- **Cart Merging**:
  - When guest user logs in, their localStorage cart is merged with their database cart
  - Merging handled by `CartService` on backend and cart store on frontend
  - Duplicate items have quantities combined
  - After successful merge, localStorage cart is cleared

### Checkout & Order System
1. User reviews cart and proceeds to checkout (authenticated users only)
2. User provides shipping details on checkout page
3. Frontend calls `POST /api/orders` with shipping details
4. Backend within transaction:
   - Validates cart items and stock availability
   - Creates new order record with status "pending"
   - Transfers cart items to order items with current pricing
   - Clears the user's cart
   - Returns order confirmation with details
5. User can view order history and details in their account
6. Orders can be cancelled if they haven't been processed yet

---

## Design Decisions

- **Monorepo**: Simpler to manage Docker + CI/CD workflows
- **Vue + Vuetify**: Bootstrap-Vue is not compatible with Vue 3
- **Cart expiration**: DB items expire after 3 days via timestamp/cron logic
- **Stock**: Each product has a stock column to prevent over-purchase

## Frontend Architecture

### Component Organization

- **Feature-Based Structure**: Components are organized by domain/feature rather than type
- **Skeleton Loaders**: Centralized in `components/skeletons/` with domain-specific subfolders
- **Global Components**: Automatically registered from `components/global/` directory

### Layout System

- **Multiple Layouts**: 
  - `AppLayout`: Main application layout with navigation
  - `AuthLayout`: Minimal layout for authentication pages
  - `ErrorLayout`: Specialized layout for error pages
- **Dynamic Layout Rendering**: App.vue dynamically renders layouts based on route metadata
- **Route Protection**: Checkout route protected with `requiresAuth` meta flag to ensure only authenticated users can access it

### State Management

- **Pinia Stores**: Modular state management with Pinia
  - `auth.js`: Authentication state and user data
  - `cart.js`: Cart management for both guest and authenticated users
  - `product.js`: Product listing and filtering
  - `category.js`: Category management
  - `order.js`: Order creation and history

### API Services

- **Centralized API Client**: `api.js` service provides a unified interface for API calls
  - Automatic token handling for authenticated requests
  - CSRF protection
  - Consistent error handling
- **Feature-Specific Services**:
  - `cart.js`: Cart operations (get, add, update, remove, clear, merge)
  - `order.js`: Order operations (list, get, create, cancel)
  - `product.js`: Product operations (list, get, update)
  - `category.js`: Category operations (list)
  - `auth.js`: Authentication operations (login, register, logout)

### Dynamic Component Registration

- **Auto-Registration**: Global components are automatically discovered and registered
- **Implementation**: Uses Vite's `import.meta.glob` feature in `utils/globalComponents.js`
- **Benefits**: Reduces boilerplate, improves maintainability as the app grows

---

## Diagrams

- `/docs/diagrams/eer-model.png` → ER diagram
- `/docs/diagrams/SD-auth-login-flow.png` → Auth flow
- `/docs/diagrams/SD-cart-merge-guest-to-auth.png` → Cart merge flow
- `/docs/diagrams/SD-order-checkout-flow.png` → Order checkout flow
- `/docs/diagrams/SD-product-import-sync-command.png` → Product import flow
- `/docs/diagrams/SD-product-listing-add-to-cart.png` → Product listing flow
- `/docs/diagrams/SD-product-update-via-auth-API.png` → Product update flow

---

## Deployment

- **Frontend**: Deployed to [Vercel](https://vercel.com)
- **Backend**: Dockerized; deployable via VPS, Render.com, or similar
- **CI/CD**: GitHub Actions used to run tests and deploy both apps

---

## Testing Strategy

### Frontend Testing

- **Unit Tests**: Component-level tests using Vitest and Vue Test Utils
  - Shallow mounting for better Docker compatibility
  - Mocked Pinia stores and Vue Router
  - Mocked browser APIs (localStorage, fetch)
- **Integration Tests**: Auth flow tests covering login, logout, and error handling
- **Test Environment**: Configured for Docker compatibility

### Backend Testing

- **Feature Tests**: PHPUnit tests for API endpoints and authentication flows
  - Authentication: Login, logout, user profile access
  - Registration: Valid/invalid data handling, duplicate email detection
  - Password Reset: Email sending, token validation, password updating
  - Sanctum Token: Token validation, protected route access
  - CSRF Protection: Cookie setting, token validation
  - Product API: Listing, filtering, and detail retrieval
  - Category API: Listing all categories
  - Import Command: Product import from external sources

- **Unit Tests**: Focused tests for individual components
  - Repository Pattern: Testing data access layer functionality
  - Controllers: Testing request handling and response formatting
  - QueryParamsTransformer: Transforms user-friendly query parameters into Spatie QueryBuilder format

- **Test Attributes**: Using PHP 8 attributes for test methods instead of doc-comment annotations
- **Database**: Uses RefreshDatabase trait for clean test environment
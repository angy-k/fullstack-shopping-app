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
│ ├── src/stores
│ ├── src/views
│ └── src/services
├── docs/ # Planning, diagrams
│ └── diagrams/
└── docker-compose.yml

---

## Database & Models

- `users` — Authenticated users (for cart sync and protected actions)
- `products` — Products imported from Fake Store API
- `categories` — Product categories
- `cart_items` — Items in user's or guest's cart (expires after 3 days)
- `orders` — Confirmed checkouts
- `order_items` — Items linked to an order

*See: `docs/diagrams/eer-model.png`*

---

## Auth Strategy

- Backend uses **Laravel Sanctum** for SPA authentication
- Frontend stores token via HttpOnly cookie
- Guests can use localStorage for cart; upon login, cart syncs to database

---

## 🔌 API Endpoints

| Endpoint                    | Method | Auth? | Description                                |
|----------------------------|--------|-------|--------------------------------------------|
| `/api/products`            | GET    | No    | Fetch product list                         |
| `/api/products/{id}`       | PUT    | Yes   | Update product (title, price, image, etc.) |
| `/api/cart`                | GET    | Yes   | Get current user's cart                    |
| `/api/cart`                | POST   | Yes   | Add/update cart item                       |
| `/api/cart/{id}`           | DELETE | Yes   | Remove item from cart                      |
| `/api/orders`              | POST   | Yes   | Create a new order                         |

---

## Data Flow Overview

### Product Import
1. Laravel command fetches from Fake Store API
2. Products are created/updated locally
3. Related categories are synced

### Cart
- Guest: cart stored in `localStorage`
- Logged-in user: cart items stored in DB (`cart_items` table)

### Checkout
1. User clicks "checkout"
2. Frontend calls `POST /api/orders`
3. Backend validates stock, creates order, deducts stock

---

## Design Decisions

- **Monorepo**: Simpler to manage Docker + CI/CD workflows
- **Vue + Vuetify**: Bootstrap-Vue is not compatible with Vue 3
- **Cart expiration**: DB items expire after 3 days via timestamp/cron logic
- **Stock**: Each product has a stock column to prevent over-purchase

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
# Project Planning – Fullstack Shopping App

## Project Scope

This project is a demo fullstack shopping application built using Laravel (API/backend) and Vue 3 (frontend). The goal is to demonstrate solid practices in API design, database sync, state management, authentication, and user experience.

The application allows:
- Importing and managing products from the Fake Store API.
- Displaying products for users.
- A persistent cart and checkout experience.
- Auth-protected product updates.

---

## Features Breakdown

### Must-Have

- [ ] Product import command
- [ ] Sync with Fake Store API (prevent duplicates)
- [ ] Product listing page
- [ ] Cart with local persistence
- [ ] Checkout functionality
- [ ] Cart expiration (after 3 days)
- [ ] Auth-protected product update API

### Nice-to-Have

- [ ] Quantity management in cart
- [ ] Product stock and stock validation on checkout
- [ ] Guest cart and migration on login
- [ ] Auth UI (Login/Register)
- [ ] Order history

---

## Stack Decisions

| Area         | Choice               | Reasoning                                                |
|--------------|----------------------|-----------------------------------------------------------|
| Frontend     | Vue 3 + Vite         | Modern, fast build, and composables support               |
| UI Framework | Vuetify              | Well-supported alternative to Bootstrap-Vue (Vue 3)       |
| State Mgmt   | Pinia                | Official Vuex replacement, modular and simpler            |
| Backend      | Laravel              | Robust PHP framework with great DX and CLI tooling        |
| Auth         | Laravel Sanctum      | API token-based auth with SPA support                     |
| DB           | MySQL                | Standard relational DB, easy to use with Laravel          |
| Deployment   | Vercel + Render/Docker | Free tier for frontend (Vercel), flexible backend (Docker) |

---

## Estimated Timeline

| Feature                    | Estimate    |
|----------------------------|-------------|
| Repo, Docker, Setup        | 2 hours     |
| Database design + diagram  | 1.5 hours   |
| Product import command     | 2 hours     |
| API (CRUD, update auth)    | 3 hours     |
| Frontend structure/UI      | 2 hours     |
| Product listing + cart     | 3 hours     |
| Checkout + sync flow       | 3 hours     |
| Auth (basic login)         | 1.5 hours   |
| Testing + validation       | 2 hours     |
| Diagrams + docs            | 1 hour      |
| CI/CD                      | 1.5 hours   |

---

## ✅ Task Checklist

- [ ] Backend Laravel setup
- [ ] Product import command
- [ ] Product model + migration
- [ ] Cart model + logic
- [ ] Auth + Sanctum setup
- [ ] Product update endpoint (auth protected)
- [ ] Frontend Vue 3 + Vuetify setup
- [ ] Product listing UI
- [ ] Cart component + Pinia store
- [ ] Cart sync to backend (logged-in user)
- [ ] Checkout flow + order creation
- [ ] EER diagram
- [ ] Sequence diagrams
- [ ] Dockerization (BE & FE)
- [ ] GitHub Actions + deployment
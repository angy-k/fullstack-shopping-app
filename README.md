# Fullstack Shopping App

Demo fullstack shopping app with Laravel API &amp; Vue.js frontend, featuring product import, auth, cart, and checkout.

## Project Structure

```
fullstack-shopping-app/
├── backend/          # Laravel API backend
│   ├── app/         # Application code
│   ├── routes/      # API routes
│   ├── database/    # Database migrations
│   └── public/      # Public assets (Laravel)
├── frontend/        # Vue 3 SPA (Vite)
│   ├── src/         # App source (components, views, stores)
│   └── public/      # Static assets
├── docs/            # Project documentation
│   ├── diagrams/    # System architecture details
│   ├── architecture.md  # System architecture details
│   └── planning.md      # Project planning and roadmap
```

## Prerequisites

- PHP 8.3+
- MySQL 8.0+
- Composer
- Node.js 20+
- npm 10+

## Backend Setup

1. Install dependencies:
   ```bash
   cd backend
   composer install
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Generate application key:
   ```bash
   php artisan key:generate
   ```

4. Configure database in `.env`:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=shop
   DB_USERNAME=shop_user
   DB_PASSWORD=shop_password123
   ```

5. Run migrations:
   ```bash
   php artisan migrate
   ```

6. Start the development server:
   ```bash
   php artisan serve
   ```

The backend API will be available at `http://localhost:8000`

## Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

3. Lint & format code:
   ```bash
   npm run lint
   npm run format
   ```

### Frontend Tech Stack
- Vue 3 + Vite
- Pinia
- Vue Router
- Vuetify 3
- ESLint (Flat config) & Prettier

## Documentation

Detailed documentation about the project can be found in the `docs/` directory:

- [Architecture](./docs/architecture.md) - System design, component interactions, and technical decisions
- [Planning](./docs/planning.md) - Project roadmap, milestones, and development plans
- [Diagrams](./docs/diagrams/) - Visual representations including ER diagram and sequence diagrams

## API Documentation

The API structure is in progress. The following endpoints will be implemented:

- Authentication


## Security Notes

- The application uses Laravel Sanctum for API authentication
- All sensitive data is encrypted
- CSRF protection is enabled
- SQL injection prevention is implemented

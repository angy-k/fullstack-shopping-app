# Fullstack Shopping App

Demo fullstack shopping app with Laravel API &amp; Vue.js frontend, featuring product import, auth, cart, and checkout.

## Project Structure

This project is organized as a monorepo with three main directories:

- `backend/` - Laravel API backend
- `frontend/` - Vue 3 SPA with Vite
- `docs/` - Project documentation and diagrams

> For detailed project structure and architecture information, see [docs/architecture.md](docs/architecture.md)

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

## Docker Setup

### Quick Start

To quickly start all services with Docker:

```bash
docker compose up --build
```

This will build and start all containers. The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api
- MySQL Database: localhost:3306

To stop all containers:

```bash
docker compose down
```

To rebuild containers after changes:

```bash
docker compose up --build
```

### Docker Services

| Service   | Description                      | Port  | Environment Variables                   |
|-----------|----------------------------------|-------|----------------------------------------|
| `mysql`   | MySQL 8.0 database              | 3306  | MYSQL_DATABASE, MYSQL_USER, etc.       |
| `backend` | Laravel API with PHP 8.3        | 8000  | DB_HOST, APP_URL, etc.                 |
| `frontend`| Nginx-served Vue 3 application   | 5173  | VITE_API_URL                           |

### Environment Variables

#### Backend (.env)

Key environment variables for the backend:

```
DB_HOST=mysql  # Use 'mysql' as hostname when running in Docker
DB_PORT=3306
DB_DATABASE=shop
DB_USERNAME=shop
DB_PASSWORD=shop123
```

#### Frontend (.env)

Key environment variables for the frontend:

```
VITE_API_URL=http://localhost:8000/api  # URL for API requests
```

### Development vs Production

- **Development**: The setup includes volume mounts for live code changes
- **Production**: For production, you would want to modify the Dockerfiles to build optimized images

### Troubleshooting

- **Database Connection Issues**: Ensure the backend's .env file has `DB_HOST=mysql`
- **API Connection Issues**: Check that frontend's .env has the correct `VITE_API_URL`
- **Container Health**: Use `docker compose ps` to check container status
- **Logs**: Use `docker compose logs [service]` to view specific service logs

## Documentation

Detailed documentation about the project can be found in the `docs/` directory:

- [Architecture](./docs/architecture.md) - System design, component interactions, and technical decisions
- [Planning](./docs/planning.md) - Project roadmap, milestones, and development plans
- [Diagrams](./docs/diagrams/) - Visual representations including ER diagram and sequence diagrams

## API Documentation

The following API endpoints have been implemented:

### Authentication
- `POST /api/login` - Authenticate user and return token
- `POST /api/register` - Register new user and return token
- `POST /api/logout` - Invalidate user token (requires authentication)
- `GET /api/user` - Get authenticated user details (requires authentication)
- `GET /sanctum/csrf-cookie` - Get CSRF cookie for CSRF protection


## Security Notes

- The application uses Laravel Sanctum for API authentication with token-based auth
- SPA authentication is configured with stateful domains for secure cookie handling
- CSRF protection is enabled with dedicated endpoints for CSRF cookie generation
- Token-based API authentication with Bearer tokens for mobile/API clients
- Secure password hashing with bcrypt
- All sensitive data is encrypted
- SQL injection prevention through Laravel's query builder and Eloquent ORM

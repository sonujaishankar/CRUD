# 📦 Product Inventory — Full Stack

**React + Vite** frontend · **NestJS + Drizzle ORM + PostgreSQL** backend

---

## Tech Stack

| Layer    | Tech                              |
|----------|-----------------------------------|
| Frontend | React 18, Vite, TypeScript, Axios |
| Backend  | NestJS, TypeScript, Drizzle ORM   |
| Database | PostgreSQL                        |

---

## Database Schema

### `categories`
| Column      | Type        | Notes     |
|-------------|-------------|-----------|
| id          | serial PK   |           |
| name        | varchar(100)| unique    |
| description | text        | nullable  |
| created_at  | timestamp   |           |
| updated_at  | timestamp   |           |

### `products`
| Column      | Type          | Notes             |
|-------------|---------------|-------------------|
| id          | serial PK     |                   |
| name        | varchar(200)  |                   |
| description | text          | nullable          |
| price       | numeric(10,2) |                   |
| quantity    | integer       | default 0         |
| sku         | varchar(100)  | unique, nullable  |
| category_id | integer FK    | → categories(id)  |
| created_at  | timestamp     |                   |
| updated_at  | timestamp     |                   |

---

## API Endpoints

### Products (`/api/products`)
| Method | Endpoint            | Description          |
|--------|---------------------|----------------------|
| GET    | /api/products       | List all (+ search)  |
| GET    | /api/products/stats | Dashboard stats      |
| GET    | /api/products/:id   | Get one product      |
| POST   | /api/products       | Create product       |
| PUT    | /api/products/:id   | Update product       |
| DELETE | /api/products/:id   | Delete product       |

### Categories (`/api/categories`)
| Method | Endpoint              | Description     |
|--------|-----------------------|-----------------|
| GET    | /api/categories       | List all        |
| GET    | /api/categories/:id   | Get one         |
| POST   | /api/categories       | Create category |
| PUT    | /api/categories/:id   | Update category |
| DELETE | /api/categories/:id   | Delete category |

---

## Setup & Run

### Prerequisites
- Node.js 18+
- PostgreSQL running locally

### 1. Create the database
```sql
CREATE DATABASE product_inventory;
```

### 2. Backend setup
```bash
cd backend
cp .env.example .env
# Edit .env — set your DATABASE_URL
npm install
npm run db:generate   # Generate SQL migration files from schema
npm run db:migrate    # Apply migrations to the database
npm run start:dev     # Starts on http://localhost:3000
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev          # Starts on http://localhost:5173
```

### 4. Open the app
Go to **http://localhost:5173** in your browser.

---

## Project Structure

```
product-inventory/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.ts          ← DB connection (Drizzle)
│   │   │   ├── migrate.ts        ← Programmatic migration runner
│   │   │   └── schema.ts         ← Table definitions
│   │   ├── modules/
│   │   │   ├── products/
│   │   │   │   ├── products.controller.ts
│   │   │   │   ├── products.service.ts
│   │   │   │   ├── products.dto.ts
│   │   │   │   └── products.module.ts
│   │   │   └── categories/
│   │   │       ├── categories.controller.ts
│   │   │       ├── categories.service.ts
│   │   │       ├── categories.dto.ts
│   │   │       └── categories.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── drizzle.config.ts
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── client.ts         ← Axios instance
    │   │   ├── products.ts       ← Products API calls
    │   │   └── categories.ts     ← Categories API calls
    │   ├── pages/
    │   │   ├── ProductsPage.tsx  ← Full CRUD table
    │   │   └── CategoriesPage.tsx ← Category cards
    │   ├── App.tsx               ← Router + Navbar
    │   └── main.tsx
    ├── vite.config.ts
    └── package.json
```

---

## How the data flows

```
React Form
  → Axios POST /api/products
    → NestJS ProductsController
      → ProductsService
        → Drizzle ORM INSERT
          → PostgreSQL
            → Response back to React
```

---

## What you'll learn from this project

- **Drizzle ORM** schema definition + relations + queries + migrations
- **NestJS** modules, controllers, services, DTOs, validation
- **React** state management, forms, conditional rendering
- **Axios** API calls with error handling
- **React Router** for multi-page navigation
- **Full loop**: UI → HTTP → Controller → Service → DB → Response → UI

---

## Database Migration Workflow

When you change the schema (`src/db/schema.ts`), follow these steps:

```bash
# 1. Generate a new SQL migration file
npm run db:generate

# 2. Apply pending migrations to the database
npm run db:migrate
```

Migration files are stored in `drizzle/` and tracked in `drizzle/meta/_journal.json`.

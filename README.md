# POS System (GadgetBD)

A modern POS and inventory dashboard built with React and Vite. The UI focuses on fast operations for sales, customers, suppliers, products, and reporting.

## Highlights

- Product, customer, and supplier management flows
- Sales, purchase, and due tracking screens
- Dashboard and analytics views with charts
- Form validation with Zod + React Hook Form
- Clean, modular UI and route protection

## Stakeholders

- Store owner / Admin: overall control, reports, and settings
- Sales staff (POS operator): day-to-day selling and checkout

## Features (Short)

- POS flow: add items, manage cart, and complete sales
- Product catalog: create, edit, and track inventory
- Customer and supplier modules: profiles, dues, and payables
- Purchases and selling history for quick lookups
- Dashboard insights with charts and summaries
- Role-based route protection for private pages

## Screenshots and Demo (Admin View)

### Dashboard Screenshots
#### Main Dashboard
![Dashboard](https://i.postimg.cc/YS9nTYFy/main-dashboard.jpg)
#### Customer Analysis
[![customer-dashboard.jpg](https://i.postimg.cc/CKhT5RqH/customer-dashboard.jpg)](https://postimg.cc/jDFkkdvL)
#### Product Analysis
[![product-dashboard.jpg](https://i.postimg.cc/K8ZxkpXf/product-dashboard.jpg)](https://postimg.cc/nCw6Nkh9)
#### Financial Analysis
[![financial-dashboard.jpg](https://i.postimg.cc/15BbT9TK/financial-dashboard.jpg)](https://postimg.cc/GHBMT1bB)
#### Inventory Analysis
[![inventory-dashboard.jpg](https://i.postimg.cc/15bDyFbr/inventory-dashboard.jpg)](https://postimg.cc/8jB7H7p7)

### Customers Screenshots
#### Customers list
[![customers.jpg](https://i.postimg.cc/HxPVBDms/customers.jpg)](https://postimg.cc/JDZrzFt9)
#### Customer Profile
[![customer-profile.jpg](https://i.postimg.cc/3wtjpxL8/customer-profile.jpg)](https://postimg.cc/5HFFWbdT)

### Products Screenshots
[![products-card.jpg](https://i.postimg.cc/dVvGxypK/products-card.jpg)](https://postimg.cc/jLgWWLR8)

### Supplier Profile
[![supplier-profile.jpg](https://i.postimg.cc/L8X854Zt/supplier-profile.jpg)](https://postimg.cc/Yh5HyHR0)

### User Profile
[![user-profile.jpg](https://i.postimg.cc/HxGY6QvB/user-profile.jpg)](https://postimg.cc/R3RxFnBH)

## Tech Stack

- React 19 + Vite
- React Router
- Tailwind CSS
- Axios
- Zod, React Hook Form
- Recharts

## Project Structure

- src/api: API client and request helpers
- src/context: Auth context and hooks
- src/private: Protected pages and feature modules
- src/routes: Route config and guards
- src/forms: Zod schemas and form utilities
- src/ui: Reusable UI components
- public/data: Static JSON used for local data

## API and Environment

The API client is defined in [src/api/api.js](src/api/api.js#L1-L13). It uses a base URL from an environment variable and falls back to a local default.

- Create a .env.local file at the project root
- Set the API base URL

Example:

VITE_API_BASE_URL=https://your-api-domain.com/api

If this value is not set, the app uses http://localhost:3000/api.

## Getting Started

1. Install dependencies
   - npm install
2. Start the dev server
   - npm run dev
3. Build for production
   - npm run build
4. Preview production build
   - npm run preview

## Scripts

- npm run dev: Start Vite dev server
- npm run build: Production build
- npm run preview: Preview the build
- npm run lint: Run ESLint
- npm run format: Run Prettier

## Deployment (Netlify / Vercel)

Not deployed yet. You can use the notes below when you are ready.

Common build settings:

- Build command: npm run build
- Output directory: dist

Netlify:

- New site from Git
- Set build command and output directory as above
- Add environment variables in Site settings > Environment variables

Vercel:

- Import project
- Framework preset: Vite
- Add environment variables in Project Settings > Environment Variables

## Notes

- API configuration lives in src/api.
- Routes and access control are defined in src/routes.

## License

Private project. All rights reserved.

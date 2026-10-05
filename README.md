# Vending Machine

An Angular app that simulates a vending machine. It has two parts:

- **Vending machine** (`/vending`) – browse products, insert coins, buy, and get change.
- **Admin panel** (`/admin`) – manage products: add, edit, and remove items, and set price and stock.

## Tech stack

- Angular 22 (standalone components, signals, lazy-loaded routes)
- NgRx Signals for state (`ProductsStore`, `VendingStore`)
- Tailwind CSS 4, class-variance-authority, Angular CDK
- Vitest for unit tests, ESLint + Prettier

## Getting started

Requires Node.js (LTS) and npm.

```bash
npm install
```

To start a local development server, run:

```bash
ng serve
```

or `npm start`. Once the server is running, open `http://localhost:4200/` (redirects to `/vending`; the admin panel is at `/admin`). The app reloads automatically when you change source files.

## Scripts

| Command                | Description                   |
| ---------------------- | ----------------------------- |
| `npm start`            | Dev server with live reload   |
| `npm run build`        | Production build into `dist/` |
| `npm test`             | Unit tests (Vitest)           |
| `npm run lint`         | ESLint                        |
| `npm run format`       | Format code with Prettier     |
| `npm run format:check` | Check formatting              |

## Business rules

- Currency: EUR. Accepted coins: 0.10, 0.20, 0.50, 1.00, 2.00.
- Prices are multiples of 0.10 (so change can always be given), up to 30.00.
- Max stock per product: 15. Product title: 2–30 characters.
- Change is returned with the fewest coins (greedy algorithm).

Limits are configured in `src/app/core/config/vending.config.ts`.

## Project structure

```
src/app/
  core/      # API, config, models, utils, validators
  features/
    vending/ # vending machine UI (grid, payment, success modals)
    admin/   # admin panel (product cards, forms, confirm modals)
  shared/    # reusable UI, directives, pipes
  state/     # NgRx signal stores
public/
  mock-api/products.json   # initial product data
  assets/images/products/  # product images
```

## Notes

- Products are loaded from a static mock API (`public/mock-api/products.json`); there is no backend.
- State is kept in memory only, so changes made in the admin panel are lost on page reload.

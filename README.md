# TheMealDB Explorer (Finfactor Assignment)

Full‑stack sample that wraps [TheMealDB](https://www.themealdb.com/) behind an Express proxy (`server/`) and exposes a Vite + React dashboard (`client/`). The backend normalizes payloads, caches responses, and exposes a clean `/api/meals` surface so the UI can focus on search, categories, and recipe detail views without touching the public API directly.

```
.
├─ client/   # Vite React app (search, categories, random meal flows)
├─ server/   # Express proxy + caching + health checks
└─ Setup.txt # Original high-level handoff notes
```

## Prerequisites

- Node.js **20.19+** (Vite warns on lower versions; use current LTS for best DX)
- npm 10+ (bundled with Node 20)
- Internet access to reach TheMealDB unless you point `MEALDB_BASE_URL` to another source

## 1. Install dependencies

```powershell
cd server
npm install

cd ../client
npm install
```

> Tip: the repo already has `node_modules` ignored—run the installs even if the folders exist to ensure versions match `package-lock.json`.

## 2. Configure environment variables

Create `.env` files in each package root as needed. All values are optional because sensible defaults exist, but overriding them makes the deployment explicit.

### `server/.env`

| Name | Default | Purpose |
| ---- | ------- | ------- |
| `PORT` | `4000` | Port for the Express API. |
| `MEALDB_BASE_URL` | `https://www.themealdb.com/api/json/v1` | Base URL before the API key segment. |
| `MEALDB_API_KEY` | `1` | TheMealDB API key (use your paid key in production). |
| `CACHE_TTL_MS` | `300000` | In-memory cache TTL in milliseconds. |
| `CACHE_MAX_ENTRIES` | `100` | Max cached request count before LRU eviction. |

Example:

```
PORT=4000
MEALDB_API_KEY=1
CACHE_TTL_MS=600000
```

### `client/.env`

| Name | Default | Purpose |
| ---- | ------- | ------- |
| `VITE_API_BASE_URL` | `http://localhost:4000/api` | Points the UI at the proxy API. |

```
VITE_API_BASE_URL=http://localhost:4000/api
```

## 3. Run the stack locally

Use two terminals:

1. **Backend**
   ```powershell
   cd server
   npm run dev
   ```
   - Starts `ts-node-dev` with auto-reload, serves `http://localhost:4000`.
   - Health check: `GET /health` returns uptime JSON.

2. **Frontend**
   ```powershell
   cd client
   npm run dev
   ```
   - Vite prints the local URL (usually `http://localhost:5173`).
   - Ensure the backend is running first so API calls succeed.

Open the Vite URL in your browser and try:

- Search for meals (debounced form in the hero section).
- Browse categories grid, drill into meals, and open recipe detail.
- Click “I’m feeling hungry” for a random meal card.

## 4. Production builds

| Target | Command | Notes |
| ------ | ------- | ----- |
| Server | `npm run build` (inside `server/`) | Outputs ESM in `server/dist`; run with `npm start`. |
| Client | `npm run build` (inside `client/`) | Generates static assets in `client/dist`. |

Preview the client build locally after building:

```powershell
cd client
npm run preview
```

Deploy the backend wherever Node 20 is available and serve the `client/dist` folder via any static host (Netlify, Vercel, nginx, etc.) configured to proxy API calls to the backend URL.

## Available scripts

### Server
- `npm run dev` – hot-reload development server.
- `npm run build` – compile TypeScript to `dist`.
- `npm start` – run compiled output.

### Client
- `npm run dev` – Vite dev server with React Fast Refresh.
- `npm run build` – type-check + bundle for production.
- `npm run preview` – serve the production bundle locally.
- `npm run lint` – run ESLint over the client sources.

## API surface (`/api/meals`)

| Method & Path | Description |
| ------------- | ----------- |
| `GET /health` | Health probe used by infra / local smoke checks. |
| `GET /api/meals/categories` | Returns all meal categories. |
| `GET /api/meals/categories/:category` | Lists meals within a category. |
| `GET /api/meals/search?q=<term>` | Searches by meal name. |
| `GET /api/meals/:id` | Returns normalized detail for a meal. |
| `GET /api/meals/random` | Picks a random meal. |

Each endpoint applies centralized error handling and uses the in-memory cache (`server/src/utils/cache.ts`) to reduce upstream calls.

## Troubleshooting

- **Vite warns about Node version**: upgrade to Node ≥ 20.19. The client may still run on older versions, but the warning indicates unsupported configurations.
- **CORS / network errors**: confirm `VITE_API_BASE_URL` matches the backend URL (including `/api`). When deploying separately, allow the UI origin in Express `cors` middleware.
- **Empty search results**: TheMealDB can return `null`; the client already handles this, but log server responses when debugging.

## Next steps

- Finish the manual end-to-end testing noted in `Setup.txt`.
- Consider adding automated tests (unit for services, component tests for the dashboard) before shipping.



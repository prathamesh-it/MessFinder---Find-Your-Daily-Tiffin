# MessFinder Frontend

React + Plain CSS frontend for the MessFinder application.  
No Tailwind. No UI libraries. Plain CSS only.

## Tech Stack
- React 18 (JSX)
- Vite 5
- Plain CSS (no Tailwind, no CSS-in-JS)
- Google Fonts: Nunito + Plus Jakarta Sans

## Project Structure

```
messfinder/
├── index.html
├── main.jsx              ← Entry point
├── App.jsx               ← Router + auth state
├── vite.config.js        ← Dev proxy → localhost:8080
├── package.json
└── src/
    ├── styles/
    │   └── global.css    ← All CSS (design tokens + components)
    ├── services/
    │   └── api.js        ← All API calls (auth/public/owner/admin/reviews)
    ├── components/
    │   ├── Shared.jsx    ← Logo, Header, Icons, AnimatedBackground
    │   └── MessDetailPanel.jsx ← Slide panel for mess details + reviews
    └── pages/
        ├── LandingPage.jsx
        ├── AuthPage.jsx
        ├── HomePage.jsx
        ├── MapPage.jsx
        └── AdminDashboard.jsx
```

## Setup

```bash
npm install
npm run dev
```

Make sure your Spring Boot backend is running on `http://localhost:8080`.  
The Vite dev server proxies all `/api/*` calls to port 8080 automatically.

## API Routes Connected

### Auth
| Method | URL | Used in |
|--------|-----|---------|
| POST | `/api/v1/auth/signup` | AuthPage (signup) |
| POST | `/api/v1/auth/login` | AuthPage (login) |

### Public
| Method | URL | Used in |
|--------|-----|---------|
| GET | `/api/v1/public/messes` | HomePage, MapPage |
| GET | `/api/v1/public/messes/search?query=` | HomePage search |
| GET | `/api/v1/public/messes/featured` | HomePage |
| GET | `/api/v1/public/messes/{id}` | MessDetailPanel |
| GET | `/api/v1/public/messes/filter?isVeg=` | HomePage filter |
| GET | `/api/v1/public/messes/{messId}/reviews` | MessDetailPanel |

### Owner (JWT required)
| Method | URL | Used in |
|--------|-----|---------|
| POST | `/api/v1/owner/mess` | (Owner dashboard — extend) |
| PUT | `/api/v1/owner/mess` | (Owner dashboard — extend) |
| GET | `/api/v1/owner/mess` | (Owner dashboard — extend) |
| POST | `/api/v1/owner/mess/images` | (Owner dashboard — extend) |
| DELETE | `/api/v1/owner/mess/images/{id}` | (Owner dashboard — extend) |

### Admin (JWT required)
| Method | URL | Used in |
|--------|-----|---------|
| GET | `/api/v1/admin/stats` | AdminDashboard overview |
| GET | `/api/v1/admin/messes` | AdminDashboard mess list |
| GET | `/api/v1/admin/users` | AdminDashboard users |
| GET | `/api/v1/admin/owners` | AdminDashboard owners |
| PATCH | `/api/v1/admin/messes/{id}/toggle-active` | Mess listing actions |
| PATCH | `/api/v1/admin/messes/{id}/toggle-featured` | Mess listing actions |
| DELETE | `/api/v1/admin/messes/{id}` | Mess listing actions |

### Reviews
| Method | URL | Used in |
|--------|-----|---------|
| POST | `/api/v1/reviews/{messId}` | MessDetailPanel (add review) |

## Auth Flow
- After login/signup, the JWT token is stored in `localStorage` as `token`
- All protected requests automatically attach `Authorization: Bearer <token>`
- Role stored as `localStorage.role` — admin → redirect to `/admin`, else → `/home`

## Fallback Data
All pages gracefully fall back to sample data if the backend is unreachable,
so the UI is always visible during development.

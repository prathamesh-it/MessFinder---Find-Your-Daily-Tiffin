# 🍱 MessFinder — Find Your Daily Tiffin

> A full-stack web application that helps students new to Amravati discover nearby mess and tiffin services with ease.

<img width="1915" height="897" alt="image" src="https://github.com/user-attachments/assets/de364c62-7773-4ba9-8eff-effcb0e031a9" />


---

## 📌 About the Project

MessFinder solves a real problem — students moving to a new city struggle to find affordable, hygienic, home-cooked mess services nearby. This platform connects students with mess owners in Amravati, with a clean discovery experience, real reviews, and an AI-powered summary to help students decide faster.

---

## ✨ Features

### 👨‍🎓 For Students
- Browse and search mess services in Amravati
- Filter by **Veg / Non-Veg**
- Filter by **Price Range** (Budget to Premium)
- Sort by **Rating** or **Price**
- View mess details — address, meals, pricing, photos
- Submit reviews with star ratings
- **AI Review Summary** — one-line Gemini-powered summary of all reviews

### 🍱 For Mess Owners
- Signup as Mess Owner and get a dedicated dashboard
- Add your mess with full details — name, area, address, phone, price
- Upload up to **2 photos** via Cloudinary
- Set lunch and dinner menu
- Mark breakfast as included or not
- Edit mess details anytime

### 👑 For Super Admin
- Full dashboard overview — total messes, owners, users, avg rating
- View and manage all mess listings
- Activate / Deactivate any mess
- Mark messes as Featured (shown on home page)
- Delete messes
- View all registered owners and their messes

---

## 🛠️ Tech Stack

### Frontend
| Technology      | Purpose                        |
|-----------------|--------------------------------|
| React + Vite    | UI framework                   |
| Plain CSS       | Custom styling with CSS vars   |
| Axios / Fetch   | API calls to backend           |
| Lucide React    | Icons                          |

### Backend
| Technology         | Purpose                        |
|--------------------|--------------------------------|
| Spring Boot 3.2.5  | REST API framework             |
| Spring Security    | Authentication & authorization |
| JWT               | Stateless token-based auth     |
| Spring Data JPA    | Database ORM                   |
| PostgreSQL         | Relational database            |
| Cloudinary         | Image upload & storage         |
| Gemini API         | AI review summarization        |

---

## 🏗️ Architecture

```
React Frontend (Vite)
       ↕  REST API (HTTP + JWT)
Spring Boot Backend
       ↕
  PostgreSQL DB        Cloudinary (Images)
                       Gemini API (AI)
```

---

## 👥 Roles & Permissions

| Feature                  | Student | Mess Owner | Super Admin |
|--------------------------|---------|------------|-------------|
| Browse & search messes   | ✅      | ✅         | ✅          |
| View mess details        | ✅      | ✅         | ✅          |
| Submit reviews           | ✅      | ✅         | ✅          |
| Add / edit own mess      | ❌      | ✅         | ✅          |
| Upload mess photos       | ❌      | ✅         | ✅          |
| Admin dashboard          | ❌      | ❌         | ✅          |
| Feature / delete mess    | ❌      | ❌         | ✅          |
| View all owners & users  | ❌      | ❌         | ✅          |

---

## 🗄️ Database Schema

```
users         → id, name, email, password, role, is_active
messes        → id, owner_id, name, area, address, phone,
                price_per_month, is_veg, breakfast,
                lunch, dinner, avg_rating, total_reviews
mess_images   → id, mess_id, cloudinary_url, cloudinary_id
reviews       → id, mess_id, user_id, reviewer_name,
                rating, comment, is_approved
```

---

## 📁 Project Structure

```
messfinder/
├── backend/                          # Spring Boot
│   └── src/main/java/com/messfinder/
│       ├── config/                   # Security, CORS, Cloudinary
│       ├── security/                 # JWT filter & utilities
│       ├── entity/                   # JPA entities
│       ├── repository/               # Spring Data repositories
│       ├── dto/                      # Request & response DTOs
│       ├── service/                  # Business logic
│       ├── controller/               # REST controllers
│       └── exception/                # Global error handling
│
└── frontend/                         # React + Vite
    └── src/
        ├── pages/                    # LandingPage, HomePage,
        │                             # AuthPage, OwnerDashboard,
        │                             # AdminDashboard
        ├── components/               # Shared UI components
        └── services/                 # API layer (api.js)
```

---

## 🔌 API Endpoints

### Auth
```
POST /api/v1/auth/signup    → Register (Student / Mess Owner)
POST /api/v1/auth/login     → Login & get JWT token
```

### Public (No Auth)
```
GET  /api/v1/public/messes              → All active messes
GET  /api/v1/public/messes/search       → Search by name/area
GET  /api/v1/public/messes/featured     → Featured messes
GET  /api/v1/public/messes/{id}         → Mess detail
GET  /api/v1/public/messes/filter       → Filter veg/non-veg
GET  /api/v1/public/messes/{id}/reviews → Mess reviews
```

### Owner (JWT Required — MESS_OWNER role)
```
POST   /api/v1/owner/mess              → Create mess
GET    /api/v1/owner/mess              → Get own mess
PUT    /api/v1/owner/mess              → Update mess
POST   /api/v1/owner/mess/images       → Upload photo
DELETE /api/v1/owner/mess/images/{id}  → Delete photo
```

### Admin (JWT Required — SUPER_ADMIN role)
```
GET    /api/v1/admin/stats                      → Dashboard stats
GET    /api/v1/admin/messes                     → All messes
GET    /api/v1/admin/owners                     → All owners
DELETE /api/v1/admin/messes/{id}                → Delete mess
PATCH  /api/v1/admin/messes/{id}/toggle-active  → Activate/deactivate
PATCH  /api/v1/admin/messes/{id}/toggle-featured → Feature/unfeature
```

### AI
```
GET /api/v1/ai/summarize/{messId} → AI review summary (Gemini)
```

### Reviews
```
POST /api/v1/reviews/{messId} → Submit review (Auth required)
```

---

## ⚙️ Setup & Installation

### Prerequisites
```
Java 21
PostgreSQL
Node.js 18+
Cloudinary account (free)
Gemini API key (free)
```

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/prathamesh-nistane/messfinder.git
cd messfinder/backend

# Configure application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/messfinder
spring.datasource.username=postgres
spring.datasource.password=yourpassword

jwt.secret=your-secret-key
jwt.expiration=86400000

cloudinary.cloud-name=your_cloud_name
cloudinary.api-key=your_api_key
cloudinary.api-secret=your_api_secret

gemini.api.key=your_gemini_key

# Run
./mvnw spring-boot:run
```

### Frontend Setup

```bash
cd messfinder/frontend
npm install
npm run dev
```

### Create Super Admin

After running the backend, signup via Postman:

```json
POST /api/v1/auth/signup
{
  "name": "Admin",
  "email": "admin@messfinder.com",
  "password": "admin123",
  "role": "SUPER_ADMIN"
}
```


## 🔮 Future Improvements

-  **Interactive Map** — Leaflet + OpenStreetMap integration to show mess locations on a live map with pin markers
-  **WhatsApp Direct Contact** — One-tap WhatsApp button on mess detail page to contact owner directly
-  **Email Notifications** — Automated email to mess owner when a new review is submitted or when admin activates their listing
-  **Google OAuth** — Sign in with Google for faster onboarding of students and owners
-  **Mobile App** — React Native version for Android and iOS

---

## 👤 Author

**Prathamesh Nistane**



---

> Built with ❤️ to solve a real student problem in Amravati.

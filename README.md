# Blaze — Where Ideas Catch Fire

> A Confluence-inspired secure collaborative workspace for developers and IT teams to create, manage, and discuss documents — built as a learning project on **Google Antigravity**, using **Gemini** and **Claude Code** AI agents.

---

## Why I Built This

I wanted to explore and learn **Google Antigravity**, a next-generation development platform that lets developers build real applications by collaborating with AI agents. Using **Gemini** and **Claude Code** as my primary agents within the Antigravity environment, I challenged myself to build a full-stack web application from scratch — entirely through AI-assisted development.

For the project itself, I was inspired by tools like **Confluence** and **Notion** — platforms that help IT organizations, development teams, and groups of engineers maintain living documentation, share knowledge, and collaborate on ideas. **Blaze** is my take on that: a clean, modern, secure workspace where team members can write, edit, and manage documents together.

---

## What Blaze Does

Blaze is a **secure collaborative document workspace** with the following core features:

- **User Registration & Approval Workflow** — New users sign up and wait for admin approval before gaining access
- **JWT Authentication** — Secure, persistent login with token-based auth — stays signed in across sessions
- **Role-Based Access Control** — Admin and Developer roles with different permissions
- **Document Permissions (Google Docs style)** — Each document has an owner. Other users can request edit access; the owner approves or denies
- **Admin Panel** — Admins review and approve pending user registrations; full visibility across all users
- **Forgot Password via Email OTP** — 6-digit one-time code sent to registered email, expires in 10 minutes
- **Change Password** — Users can update their password from the profile dropdown
- **Team Presence Panel** — See which teammates are Online / Idle / Offline in real time on the workspace
- **Responsive UI** — Modern, animated interface with a cohesive design system and fiery Blaze branding

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 3.2.3 (Java 17) |
| Frontend | Angular 18 (Standalone Components) |
| Database | **PostgreSQL** (persistent, production-ready) |
| Auth | JWT (JJWT 0.12.5) + Spring Security |
| Email | Spring Mail + Gmail SMTP (OTP delivery) |
| Styling | Tailwind CSS |
| Animation | GSAP (GreenSock) |
| Build | Maven |
| Hosting | Railway (backend + DB) · Vercel (frontend) |

---

## Design System — "Organic Tech"

| Token | Color | Hex |
|-------|-------|-----|
| Moss | Primary | `#2E4036` |
| Clay | Accent | `#CC5833` |
| Cream | Background | `#F2F0E9` |
| Charcoal | Text | `#1A1A1A` |

**Fonts:** Plus Jakarta Sans (body), Cormorant Garamond (display), IBM Plex Mono (data)

---

## Getting Started (Run Locally)

### Prerequisites
- Java 17+
- Node.js 18+
- npm 9+
- **PostgreSQL 14+** running locally

### 1. Clone the Repository

```bash
git clone https://github.com/RajVamsee/blaze.git
cd blaze
```

### 2. Create the Database

In your PostgreSQL client:
```sql
CREATE DATABASE blaze;
```

### 3. Run the Backend

```bash
export PGHOST=localhost
export PGPORT=5432
export PGDATABASE=blaze
export PGUSER=postgres
export PGPASSWORD=postgres
export GMAIL_USERNAME=yourgmail@gmail.com
export GMAIL_APP_PASSWORD=your-app-password

mvn clean package -DskipTests
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

Backend starts at `http://localhost:8081`

On first boot, the seeder automatically creates:
- `admin` / `admin123` (Administrator)
- 2 sample documents

### 4. Run the Frontend

```bash
cd frontend
npm install
npm start
```

Frontend starts at `http://localhost:4200`

---

## Environment Variables (Production)

| Variable | Description |
|----------|-------------|
| `PGHOST` | PostgreSQL host |
| `PGPORT` | PostgreSQL port (default 5432) |
| `PGDATABASE` | Database name |
| `PGUSER` | Database user |
| `PGPASSWORD` | Database password |
| `PORT` | Server port (set automatically by Railway) |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `CORS_ALLOWED_ORIGINS` | Frontend URL (your Vercel deployment URL) |
| `GMAIL_USERNAME` | Gmail address used to send OTP emails |
| `GMAIL_APP_PASSWORD` | Gmail App Password (not your regular password) |

---

## API Overview

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login, receive JWT | No |
| POST | `/api/auth/change-password` | Change password | Yes |
| POST | `/api/auth/forgot-password/send-otp` | Send OTP to email | No |
| POST | `/api/auth/forgot-password/reset` | Reset password with OTP | No |
| GET | `/api/documents` | List all documents | Yes |
| POST | `/api/documents` | Create document | Yes |
| PUT | `/api/documents/{id}` | Update document | Owner / Approved / Admin |
| DELETE | `/api/documents/{id}` | Delete document | Owner / Admin |
| POST | `/api/documents/{id}/request-access` | Request edit access | Yes |
| GET | `/api/documents/{id}/permissions` | View access requests | Owner only |
| PUT | `/api/documents/{id}/permissions/{permId}/approve` | Approve request | Owner only |
| PUT | `/api/documents/{id}/permissions/{permId}/deny` | Deny request | Owner only |
| GET | `/api/admin/users` | List all users | Admin only |
| POST | `/api/admin/approve/{userId}` | Approve user | Admin only |
| POST | `/api/admin/reject/{userId}` | Reject user | Admin only |
| POST | `/api/presence/heartbeat` | Update online status | Yes |
| GET | `/api/presence/team` | Get team presence list | Yes |

---

## Project Structure

```
blaze/
├── src/main/java/com/blaze/backend/
│   ├── controller/        # REST API controllers
│   ├── service/           # Business logic
│   ├── entity/            # JPA entities (User, Document, Role, DocumentPermission, OtpToken)
│   ├── dto/               # Request/Response DTOs
│   ├── repository/        # Spring Data JPA repositories
│   ├── security/          # JWT filter, token provider
│   └── config/            # Security config, DataSeeder
├── frontend/
│   └── src/app/
│       ├── pages/         # Landing, Login, Register, Workspace, Admin
│       ├── components/    # Navbar, Footer
│       ├── services/      # Auth, Document, Admin, Presence services
│       ├── guards/        # Route protection
│       └── interceptors/  # JWT token injection
├── pom.xml
├── railway.toml
└── README.md
```

---

## Development Workflow

This project was built using **Google Antigravity** with AI agents:
- **Gemini** — Architecture decisions, feature planning, and code generation
- **Claude Code** — Implementation, debugging, refactoring, and code review

---

## Roadmap

- [x] Persistent database (PostgreSQL)
- [x] Document permission system (Google Docs style)
- [x] Admin approval workflow for new users
- [x] Change password
- [x] Forgot password via email OTP
- [x] Team presence panel (online/idle/offline)
- [x] Hosted deployment (Railway + Vercel)
- [ ] Rich text editor (Markdown/WYSIWYG)
- [ ] Real-time collaborative editing
- [ ] Document categories and tagging
- [ ] Comment threads on documents
- [ ] User profile pages
- [ ] Notifications (in-app + email)
- [ ] Test suite (unit + integration)

---

## License

MIT License — feel free to fork, learn, and build on top of this.

---

*Built with Google Antigravity · Gemini + Claude Code*

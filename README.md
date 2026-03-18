# Blaze — Where Ideas Catch Fire

> A Confluence-inspired secure collaborative workspace for developers and IT teams to create, manage, and discuss documents — built as a learning project on **Google Antigravity**, using **Gemini** and **Claude Code** AI agents.

---

## Why I Built This

I wanted to explore and learn **Google Antigravity**, a next-generation development platform that lets developers build real applications by collaborating with AI agents. Using **Gemini 3.1 High** and **Claude Code** as my primary agents within the Antigravity environment, I challenged myself to build a full-stack web application from scratch — entirely through AI-assisted development.

For the project itself, I was inspired by tools like **Confluence** and **Notion** — platforms that help IT organizations, development teams, and groups of engineers maintain living documentation, share knowledge, and collaborate on ideas. **Blaze** is my take on that: a clean, modern, secure workspace where team members can write, edit, and manage documents together.

This project represents the intersection of:
- Learning a cutting-edge AI development platform (Google Antigravity)
- Building something genuinely useful (a real team collaboration tool)
- Exploring AI-assisted full-stack development end-to-end

---

## What Blaze Does

Blaze is a **secure collaborative document workspace** with the following core features:

- **User Registration & Approval Workflow** — New users sign up and wait for admin approval before gaining access (like onboarding in a real org)
- **JWT Authentication** — Secure login/logout with token-based auth
- **Role-Based Access Control** — Admin and Developer roles with different permissions
- **Document Management** — Create, read, edit, and delete documents in a clean workspace
- **Admin Panel** — Admins can review and approve pending user registrations
- **Responsive UI** — Modern, animated interface with a cohesive design system

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 3.2.3 (Java 17) |
| Frontend | Angular 18.2.0 (Standalone Components) |
| Database | H2 (in-memory, dev) |
| Auth | JWT (JJWT 0.12.5) + Spring Security |
| Styling | Tailwind CSS 3.4.19 |
| Animation | GSAP (GreenSock) |
| Build | Maven 3.9.6 |

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

### 1. Clone the Repository

```bash
git clone https://github.com/RajVamsee/blaze.git
cd blaze
```

### 2. Run the Backend

```bash
# From the project root
./apache-maven-3.9.6/bin/mvn spring-boot:run
```

Backend starts at `http://localhost:8080`

> H2 console available at `http://localhost:8080/h2-console`
> JDBC URL: `jdbc:h2:mem:blazedb` | User: `sa` | Password: *(empty)*

### 3. Run the Frontend

```bash
cd frontend
npm install
ng serve
```

Frontend starts at `http://localhost:4200`

### 4. Default Admin Login

```
Username: admin
Password: admin123
```

---

## API Overview

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login, get JWT | No |
| GET | `/api/documents` | List all documents | Yes |
| POST | `/api/documents` | Create document | Yes |
| PUT | `/api/documents/{id}` | Update document | Yes (author) |
| DELETE | `/api/documents/{id}` | Delete document | Yes (author) |
| GET | `/api/admin/pending-users` | List pending users | Admin only |
| POST | `/api/admin/approve/{userId}` | Approve user | Admin only |

---

## Project Structure

```
blaze/
├── src/main/java/com/blaze/backend/
│   ├── controller/        # REST API controllers
│   ├── service/           # Business logic
│   ├── entity/            # JPA entities (User, Document, Role)
│   ├── dto/               # Request/Response DTOs
│   ├── repository/        # Spring Data JPA repositories
│   ├── security/          # JWT filter, UserDetails, token provider
│   └── config/            # Security config, DB seeder
├── frontend/
│   └── src/app/
│       ├── pages/         # Landing, Login, Register, Workspace, Admin
│       ├── components/    # Navbar, Footer
│       ├── services/      # Auth, Document, Admin services
│       ├── guards/        # Route protection
│       └── interceptors/  # JWT token injection
├── pom.xml
└── README.md
```

---

## Development Workflow

This project was built using **Google Antigravity** with AI agents:
- **Gemini 3.1 High** — Architecture decisions, feature planning, and code generation
- **Claude Code** — Implementation, debugging, refactoring, and code review

Every feature was built through natural language conversations with these agents, demonstrating the power of AI-assisted software development on the Antigravity platform.

---

## Roadmap

- [ ] Persistent database (PostgreSQL)
- [ ] Document categories and tagging
- [ ] Real-time collaborative editing
- [ ] Rich text editor (Markdown support)
- [ ] User profile pages
- [ ] Comment threads on documents
- [ ] Hosted deployment (CI/CD pipeline)
- [ ] Test suite (unit + integration)

---

## License

MIT License — feel free to fork, learn, and build on top of this.

---

*Built with Google Antigravity | Gemini 3.1 High + Claude Code*

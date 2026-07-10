# SkillSphere 🎨🤝

> **Peer-to-peer developer community built on the belief that technology is a fundamentally human, creative endeavor.**

SkillSphere rejects the corporate "straight-line" aesthetic in favor of a unique **Hand-Drawn Design System** — because sharing skills, finding collaborators, and learning should feel organic and personal, not transactional.

[![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=java)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.4-green?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Vite](https://img.shields.io/badge/Vite-latest-purple?style=flat-square&logo=vite)](https://vitejs.dev/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [GitHub OAuth Integration](#-github-oauth-integration)
- [Design Philosophy](#-design-philosophy)
- [Docker](#-docker)

---

## ✨ Features

### 1. 📓 The Notebook Feed
- A dynamic social feed where developers share updates, ask for help, or showcase open-source projects.
- Posts are tagged with rich contextual badges: `❓ #AskForHelp`, `🚀 #ShareProject`, `💡 #TIL`, and more.
- Engage via **Appreciate** (reactions), **Discuss** (threaded comments), or **Request Session** directly from a post.
- AI-powered post enhancement to help you write better, clearer content.

### 2. 🧭 Intent-Based Discovery
- The landing page prioritizes *why* people are here, not just who they are.
- Users declare active intents: **Open to Work**, **Open to Collaborate**, **Learning**, **Need Help**, **Building Startup**, **Side Projects**, **Open Source**, **Interview Prep**, and more.
- Filter and search developers by tech stack, intent, name, or company.

### 3. 👥 Follow & Network
- Build your developer circle by following others.
- The Feed dynamically filters to show posts from your curated network.
- Suggested connections sidebar on the Discover page.
- Real-time notifications (via SSE) when someone interacts with your content.

### 4. 💬 Real-time Messaging & Sessions
- Request 1-on-1 learning sessions directly from any post or profile.
- A full **Dashboard** to manage Incoming/Sent session requests (Accept, Reject, Pending).
- Integrated **ChatBox** for live messaging once a session is accepted.
- Conversation history persisted per user pair.

### 5. 🐙 GitHub Integration & Verified Skills
- OAuth-based GitHub account linking.
- Automatically syncs your public repositories and derives a **verified skill set** from your commit activity and repo languages.
- Skills displayed as a **Skill Radar Chart** (recharts) on your profile — visible to everyone.

### 6. 🤖 AI-Powered Features
- Post content enhancement via AI to improve clarity and engagement.
- Smart developer matching suggestions based on tech stack overlap.

### 7. 🔔 Real-time Notifications
- Server-Sent Events (SSE) stream for instant, push-based notifications.
- Unread badge counter on the bell icon in the navbar.
- One-click mark-as-read with live dismissal.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend Language** | Java 21 |
| **Backend Framework** | Spring Boot 3.2.4 |
| **Data Access** | Spring Data JPA / Hibernate |
| **Security** | Spring Security + JWT (JJWT 0.11.5) |
| **Database** | PostgreSQL |
| **Build Tool** | Maven |
| **API Docs** | SpringDoc OpenAPI (Swagger UI) |
| **Frontend Framework** | React 18 |
| **Frontend Build** | Vite |
| **Styling** | Vanilla CSS (custom hand-drawn design system) |
| **Icons** | Lucide React |
| **HTTP Client** | Axios |
| **Charts** | Recharts |
| **Containerization** | Docker (multi-stage build) |

---

## 🏗️ Architecture

```
SkillSphere/
├── src/                          # Spring Boot backend
│   └── main/java/com/skillsphere/
│       ├── config/               # CORS, Security, OpenAPI config
│       ├── controller/           # REST controllers
│       │   ├── AuthController    # Login, signup, GitHub OAuth
│       │   ├── UserController    # Profile, follow, discovery
│       │   ├── PostController    # Feed, reactions, comments
│       │   ├── SessionRequestController  # Session management
│       │   ├── MessageController # Chat messaging
│       │   ├── NotificationController   # SSE + read status
│       │   ├── GitHubController  # GitHub connect & skill sync
│       │   └── AiController      # AI enhancement & matching
│       ├── entity/               # JPA entities (User, Post, Message, etc.)
│       ├── service/              # Business logic
│       ├── repository/           # Spring Data JPA repositories
│       ├── dto/                  # Request/Response DTOs
│       ├── security/             # JWT filter, UserDetailsService
│       └── mapper/               # Entity <-> DTO mappers
│
├── frontend/                     # React + Vite frontend
│   └── src/
│       ├── api/                  # Axios API client (organized by domain)
│       ├── components/           # Reusable UI components
│       │   ├── Sketch.jsx        # Core SketchButton, SketchCard primitives
│       │   ├── ProfileModal.jsx  # User profile view
│       │   ├── ChatBox.jsx       # Live messaging UI
│       │   └── SkillRadarChart.jsx  # GitHub-synced skill radar
│       └── pages/
│           ├── DiscoverPage.jsx  # Landing + intent-based discovery
│           ├── FeedPage.jsx      # Network feed + post creation
│           ├── DashboardPage.jsx # Session requests + GitHub + profile edit
│           ├── OnboardingPage.jsx # Tech stack onboarding flow
│           └── GitHubCallback.jsx # GitHub OAuth callback handler
│
├── Dockerfile                    # Multi-stage Docker build
└── pom.xml                       # Maven dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 21** (Amazon Corretto recommended)
- **Node.js** v18+
- **PostgreSQL** running on port `2004`
- **Maven** 3.9+

### 1. Database Setup

Create the database in PostgreSQL:

```sql
CREATE DATABASE "SkillSphere";
```

> The app uses port `2004` by default. Update `src/main/resources/application.properties` if your setup differs.

### 2. Backend Setup

```bash
# From the project root
mvn spring-boot:run
```

The API server starts at **`http://localhost:8085`**.

Swagger UI is available at: **`http://localhost:8085/swagger-ui.html`**

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend starts at **`http://localhost:5173`**.

---

## 🔑 Environment Variables

### Backend (`application.properties`)

| Property | Description | Default |
|---|---|---|
| `spring.datasource.url` | PostgreSQL JDBC URL | `jdbc:postgresql://localhost:2004/SkillSphere` |
| `spring.datasource.username` | DB username | — |
| `spring.datasource.password` | DB password | — |
| `jwt.secret` | JWT signing secret | — |
| `github.client.id` | GitHub OAuth App Client ID | — |
| `github.client.secret` | GitHub OAuth App Client Secret | — |

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:8085/api
VITE_GITHUB_CLIENT_ID=your_github_oauth_app_client_id
```

---

## 📖 API Reference

All endpoints (except auth and public discovery) require a **Bearer JWT token** in the `Authorization` header.

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Login with email + password → returns JWT |
| `POST` | `/api/users` | Register a new user |
| `POST` | `/api/auth/github` | GitHub OAuth login (exchange code for JWT) |

### Users
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users` | Get all users (Discover page) |
| `GET` | `/api/users/{id}` | Get user by ID |
| `PUT` | `/api/users/{id}` | Update profile |
| `POST` | `/api/users/{id}/follow` | Toggle follow/unfollow |
| `POST` | `/api/users/{id}/github/connect` | Link GitHub account |
| `POST` | `/api/users/{id}/github/sync` | Sync verified skills from GitHub |
| `GET` | `/api/users/{id}/skills` | Get verified skills (public) |

### Posts & Feed
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/posts/feed` | Get feed posts (filtered by followed users) |
| `POST` | `/api/posts` | Create a new post |
| `DELETE` | `/api/posts/{id}` | Delete a post (owner only) |
| `POST` | `/api/posts/{id}/react?type=` | React to a post (`APPRECIATE`, `CURIOUS`, etc.) |
| `POST` | `/api/posts/{id}/comments` | Add a comment |
| `GET` | `/api/posts/{id}/comments` | Get all comments for a post |

### Session Requests
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/session-requests` | Request a session |
| `GET` | `/api/session-requests/sent` | Get your sent requests |
| `GET` | `/api/session-requests/incoming` | Get incoming requests |
| `PATCH` | `/api/session-requests/{id}/accept` | Accept a request |
| `PATCH` | `/api/session-requests/{id}/reject` | Reject a request |

### Messaging
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/messages` | Send a message |
| `GET` | `/api/messages/{userId}` | Get message history with a user |
| `GET` | `/api/messages/conversations` | Get all conversations |

### Notifications
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/notifications` | Get unread notifications |
| `PATCH` | `/api/notifications/{id}/read` | Mark notification as read |
| `GET` | `/api/notifications/stream` | SSE stream for real-time notifications |

### AI
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/enhance` | AI-enhance a post draft |
| `GET` | `/api/ai/matches` | Get AI-suggested developer matches |

---

## 🐙 GitHub OAuth Integration

SkillSphere supports GitHub as a login provider and a verified skill source.

**OAuth Flow:**
1. User clicks **"Continue with GitHub"** → redirected to GitHub authorization.
2. GitHub redirects to `/oauth/github/callback?code=...` on the frontend.
3. Frontend sends the `code` to `POST /api/auth/github`.
4. Backend exchanges the code with GitHub's token endpoint, fetches user info, and returns a JWT.
5. User can then sync repositories via the Dashboard, which triggers skill analysis.

**Setup:** Create a GitHub OAuth App at [github.com/settings/developers](https://github.com/settings/developers) with:
- **Homepage URL**: `http://localhost:5173`
- **Callback URL**: `http://localhost:5173/oauth/github/callback`

---

## 🎨 Design Philosophy

SkillSphere's UI is entirely custom and committed to the **Hand-Drawn Approach**. Every visual decision reinforces the idea that this is a human-first platform.

| Principle | Implementation |
|---|---|
| **No Straight Lines** | Every border uses irregular `border-radius` (e.g., `255px 15px 225px 15px / 15px 225px 15px 255px`) |
| **Paper Texture** | Subtle dot-grid background (`radial-gradient`) simulating notebook paper |
| **Authentic Decorations** | CSS-only masking tape, paper clips, and thumbtack effects on cards |
| **Human Typography** | *Kalam* (headings) & *Patrick Hand* (body) from Google Fonts |
| **Tactile Interactions** | Buttons physically compress and lose drop-shadow on click, simulating real pressure |
| **Dark Mode** | Chalkboard aesthetic — dark navy background, pastel chalk colors |

---

## 🐳 Docker

A multi-stage `Dockerfile` is provided for the backend:

```bash
# Build the image
docker build -t skillsphere-api .

# Run the container
docker run -p 8085:8085 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:2004/SkillSphere \
  -e SPRING_DATASOURCE_USERNAME=your_user \
  -e SPRING_DATASOURCE_PASSWORD=your_password \
  skillsphere-api
```

---

## 🤝 Contributing

Learning is better together! Feel free to:
- 🍴 Fork the repo and submit a PR
- 🐛 Open an issue for bugs or feature requests
- 💡 Suggest new "sketchy" UI components

---

**SkillSphere — Learn. Share. Build.**

# SkillSphere 🎨🤝 

**SkillSphere** is a peer-to-peer developer community built on the idea that technology is fundamentally a human, creative endeavor. It rejects the corporate "straight-line" aesthetic in favor of a unique **Hand-Drawn Design System**, emphasizing that sharing skills, finding collaborators, and learning is an organic, shared journey.

---

## 🚀 Key Features

### **1. The Notebook Feed**
- A dynamic feed where developers share updates, ask for help, or present open-source projects.
- Posts are tagged with rich contextual badges (e.g. `❓ #AskForHelp`, `🚀 #ShareProject`).
- Engage via "Appreciate", "Discuss" (threaded comments), or directly "Request Session".

### **2. Intent-Based Discovery**
- The Discover page is the main landing area, prioritizing *why* people are here.
- Users can toggle their current intents: **Open to Work, Collaborating, Learning, Need Help, Projects**.
- Easily filter developers based on their active intents and tech stack.

### **3. Follow & Network**
- Build your developer circle by following others.
- The Feed page dynamically filters to show posts specifically from your curated network.
- Dedicated section showcasing the active connections you follow.

### **4. Real-time Messaging & Sessions**
- Request 1-on-1 sessions directly from a post.
- A fully functional Dashboard to track Incoming/Sent requests.
- Integrated ChatBox for live messaging once a session is accepted.

---

## 🛠️ Tech Stack

- **Backend**: Java 21, Spring Boot 3.2, Spring Data JPA, Spring Security, JWT, PostgreSQL.
- **Frontend**: React 18, Vite, Vanilla CSS, Lucide Icons.
- **Design Language**: Custom CSS (No standard frameworks, everything is hand-drawn and sketchy).

---

## 🏗️ Getting Started

### **Prerequisites**
- **Java 21 (Amazon Corretto Recommended)**
- **Node.js** (v18+)
- **PostgreSQL** (Running on port `2004`)

### **1. Backend Setup**
1. Navigate to the root directory.
2. Ensure you have a database named `SkillSphere` in PostgreSQL (Port `2004`).
3. Run the application:
   ```bash
   # Make sure JAVA_HOME points to your JDK 21
   mvn spring-boot:run
   ```
   *The server will start on `http://localhost:8085`.*

### **2. Frontend Setup**
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   *The app will be live at `http://localhost:5173`.*

---

## 📖 API Architecture

SkillSphere utilizes a secure, JWT-authenticated REST API. 

### **Core Endpoints:**
- **Auth**: `POST /api/auth/login`, `POST /api/auth/register`
- **Users**: `GET /api/users` (Discover/Following), `POST /api/users/{id}/follow`
- **Posts**: `GET /api/posts/feed`, `POST /api/posts`, `POST /api/posts/{id}/react`
- **Sessions**: `POST /api/session-requests`, `PUT /api/session-requests/{id}/accept`

*To test manually via Postman, login to receive a Bearer token and include it in the `Authorization` header for subsequent requests.*

---

## 🎨 Design Philosophy

SkillSphere's UI is entirely custom and deeply committed to the **Hand-Drawn Approach**:
- **No Straight Lines**: Every border uses irregular `border-radius` (e.g. `border-radius: 255px 15px 225px 15px/15px 225px 15px 255px`).
- **Authentic Texture**: Subtle grid paper backgrounds with masking tape and paper clip decorations.
- **Human Touch**: Handwritten typography (*Kalam* & *Patrick Hand*).
- **Tactile Interaction**: Buttons physically compress and lose their shadow drop when clicked, simulating real pressure.

---

## 🤝 Contribution
Learning is better together! Feel free to fork the repo, create an issue, or suggest a new "sketchy" component.

**SkillSphere - Learn. Share. Draw.**

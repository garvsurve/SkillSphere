# SkillSphere 🎨🤝 

**SkillSphere** is a peer-to-peer skill exchange platform designed for an organic, human-centric experience. It rejects the corporate "straight-line" aesthetic in favor of a unique **Hand-Drawn Design System**, emphasizing that learning is a creative, shared human journey.

---

## 🚀 Features

### **Backend (Spring Boot)**
- **Secure Auth**: JWT-based authentication with BCrypt password hashing.
- **Skill Management**: Users can list skills they can teach and discover skills from others.
- **Request Flow**: A full lifecycle from `PENDING` → `ACCEPTED` → `SCHEDULED` → `COMPLETED`.
- **Session Scheduling**: Mentors can set meeting links and times for accepted requests.
- **Pagination & Search**: Efficient discovery with keyword search and paged responses.
- **API Docs**: Fully documented with Swagger/OpenAPI.

### **Frontend (React)**
- **Wobbly UI**: Totally custom CSS design system where nothing is perfectly straight.
- **Notebook Aesthetic**: Grid-dot paper background with warm paper tones.
- **Interactive Personality**: Buttons that "press flat", taped-on cards, and thumbtack decorations.
- **Real-time Search**: Instant filtering of the skill catalog.

---

## 🛠️ Tech Stack

- **Backend**: Java 21, Spring Boot 3.2, Spring Data JPA, Spring Security, JWT (JJWT), PostgreSQL.
- **Frontend**: React 18, Vite, Vanilla CSS, Lucide Icons, Axios.
- **API Documentation**: SpringDoc OpenAPI (Swagger UI).

---

## 🏗️ Getting Started

### **Prerequisites**
- **Java 21**
- **Node.js** (v18+)
- **PostgreSQL** (Running on port `2004` or updated in `application.properties`)

### **1. Backend Setup**
1. Navigate to the root directory.
2. Ensure you have a database named `SkillSphere` in PostgreSQL.
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   *The server will start on `http://localhost:8084`.*

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

## 📖 API Documentation
Once the backend is running, you can explore the interactive API docs at:
**[http://localhost:8084/swagger-ui/index.html](http://localhost:8084/swagger-ui/index.html)**

---

## 🎨 Design Philosophy
SkillSphere follows the **Hand-Drawn Approach**:
- **No Straight Lines**: Every border uses irregular `border-radius`.
- **Authentic Texture**: Subtle paper grain and marker highlights.
- **Human Touch**: Handwritten typography (*Kalam* & *Patrick Hand*).

---

## 🤝 Contribution
Learning is better together! Feel free to fork the repo, create an issue, or suggest a new "sketchy" component.

**SkillSphere - Learn. Share. Draw.**

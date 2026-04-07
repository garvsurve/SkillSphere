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

## 📖 API Documentation & Testing
Once the backend is running, you can explore the interactive API docs at:
**[http://localhost:8084/swagger-ui/index.html](http://localhost:8084/swagger-ui/index.html)**

### **Postman / Manual Testing Flow:**
1. **Register**: `POST /api/users` (Sends name, email, password, bio).
2. **Login**: `POST /api/auth/login` -> **Copy the token**.
3. **Authorize**: Add `Bearer <your_token>` to the `Authorization` header for all other calls.
4. **Create Skill**: `POST /api/skills?ownerId=<id>`.
5. **Explore**: `GET /api/skills/paged` or `GET /api/skills/search?query=...`.

---

## 🎨 Design Philosophy
SkillSphere follows the **Hand-Drawn Approach**:
- **No Straight Lines**: Every border uses irregular `border-radius`.
- **Authentic Texture**: Subtle paper grain and marker highlights.
- **Human Touch**: Handwritten typography (*Kalam* & *Patrick Hand*).
- **Interactive States**: Buttons that shift and flatten on click to simulate physical pressure.

---

## 🤝 Contribution
Learning is better together! Feel free to fork the repo, create an issue, or suggest a new "sketchy" component.

**SkillSphere - Learn. Share. Draw.**

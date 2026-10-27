# 🎓 SkillSwap — Student Peer-to-Peer Skill Exchange

An end-to-end full-stack web platform designed for university students to exchange skills for free (1-on-1 barter), teach paid peer mentoring sessions at an hourly rate in Indian rupees (**₹**), discover peers using **AI Smart Skill Maker**, and connect safely with prefilled **Gmail Compose** drafts and an integrated **Mail log**.

---

## 🌟 Key Features

### 1. 🤝 1-on-1 Peer Skill Barter (₹0 Free Swaps)
- Students can propose reciprocal 1-on-1 swaps: trade 1 hour of teaching a skill (e.g., *React & Next.js* or *Python*) for 1 hour of learning a skill (e.g., *UI/UX Figma Design* or *Acoustic Guitar*).
- ₹0 monetary cost — pure reciprocal knowledge barter.

### 2. ⏱️ Hourly Paid Mentoring Sessions (₹/hr)
- Mentors set their custom hourly tutoring rate in Indian rupees (e.g., `₹500/hr`, `₹800/hr`, `₹1,200/hr`), or set `₹0` for barter only.
- Duration selector (1 hr, 1.5 hrs, 2 hrs, 3 hrs) with automatic live total price calculation in ₹.
- Suggest a date/time with every booking or barter request.
- Auto-generates session details, agenda, and Google Meet integration.

### 3. 🧠 AI Smart Skill Maker (Dual 2-Way Match Engine)
- Placed beside **My swaps** in the main navigation.
- **Editable Skills Lists**: Displays and edits what you can teach and what you want to learn right on the page (supports one or several skills per field).
- **Match my skills** button runs a transparent, deterministic skill-name and category matching algorithm against real stored student profiles.
- Generates TWO distinct sets of matches:
  1. **Students who want to learn skills I can teach**
  2. **Students who can teach skills I want to learn**
- Highlights **100% Reciprocal Swaps** (peers where both directions match simultaneously!).
- Shows match name, school/university, matched skill, session type / hourly price in ₹, and 1-click contact actions.
- Explains clearly when no matches are found and offers suggested terms to update and retry.

### 4. 📬 "My swaps" Session Dashboard
- Track all sent and received swap proposals and paid tutoring appointments.
- Filter by: **All**, **Received (Incoming)**, **Sent (Outgoing)**, **Accepted**, and **Completed**.
- Incoming request actions: **Accept** or **Decline**.
- Active session actions: **Mark as Completed** and leave verified reviews with star ratings.
- 1-click Google Meet access and direct Gmail partner communication.

### 5. ✉️ Contact via Gmail & Mail Log
- **1-Click Browser Gmail Compose**: Formats web compose URLs (`https://mail.google.com/mail/?view=cm&fs=1&to=...&su=...&body=...`) with prefilled mentor email, subject, and message.
- **Never invokes Apple Mail or system default mail apps**.
- Prefilled message identifies student, relevant skill, and session intent (free barter vs paid tutoring at ₹/hr).
- No email sends automatically; students review and send inside Gmail.
- **Mail Log View**: Records every contact draft initiated from the site with mentor, skill, timestamp, subject, and draft opened status.
- Clear disclaimer: explains that SkillSwap tracks when browser drafts are opened, but cannot verify whether Gmail transmitted the email without full Gmail OAuth `gmail.send` API credentials.

### 6. 🌙 / ☀️ Light & Dark Mode with Warm Campus Design
- Dimensional 3D-inspired look with glassmorphism cards, glowing ambient orbs, and smooth transitions.
- Warm campus color palette (terracotta, amber, campus navy).
- Instant 🌙/☀️ toggle in navbar persisted in `localStorage`.
- Smooth scrolling and floating "Back to Top" button.

### 7. 👤 Student Profiles & Multi-Skill Setup
- During sign-in or profile registration, students specify:
  - *What skills can you teach?* (one or several skills via tag pills/chips)
  - *What skills do you want to learn?* (one or several skills via tag pills/chips)
  - Hourly rate in Indian rupees (₹)
  - University and major
- Students can edit these skill lists anytime in their profile, edit modal, or inside AI Smart Skill Maker.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS (with `darkMode: 'class'`), Lucide Icons, Canvas Confetti, Framer Motion.
- **Backend**: Node.js, Express, CORS, Morgan logger.
- **Database**:
  - **MySQL**: Full relational schema (`server/schema.sql`) for `students`, `skills_offered`, `skills_wanted`, `swap_requests`, `reviews`, `mail_logs`, and `notifications`.
  - **Persistent Local Demo Mode**: Transparent fallback to `server/data/db.json` with synchronous atomic persistence when MySQL is not configured.
  - Storage mode is clearly labeled in API health checks and in the UI badge.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
# Root & client & server
npm install
npm --prefix client install
npm --prefix server install
```

### 2. Configure Database (Optional MySQL or Local Demo)

#### Option A: Persistent Local Demo Mode (Default, Zero Config)
No setup required! If MySQL credentials are not set, the platform will automatically run in **Persistent Local Demo Mode** using `server/data/db.json`.

#### Option B: MySQL Database
To connect your local or cloud MySQL instance:
1. Create a `.env` file in the `server` directory (or export environment variables):
   ```env
   PORT=5001
   MYSQL_HOST=127.0.0.1
   MYSQL_PORT=3306
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password
   MYSQL_DATABASE=skillswap
   ```
2. The server will automatically connect to MySQL and execute `server/schema.sql` on startup to ensure all tables exist!

### 3. Run in Development Mode
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5001`

### 4. Build for Production
```bash
npm run build
```

### 5. Start Production Server
```bash
npm start
```
Open `http://localhost:5001` in your browser. Express serves both the REST API and the production React frontend build.

---

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health status, currency (₹), and storageMode (`mysql` vs `local_demo`) |
| `GET` | `/api/students` | List students with search, category, mode, rating, maxPrice in ₹ |
| `GET` | `/api/students/:id` | Get student details, reviews, and prefilled contact info |
| `POST` | `/api/students` | Register student profile with multiple teach/learn skills |
| `PUT` | `/api/students/:id` | Update profile, rates in ₹, and skills |
| `POST` | `/api/smart-skill-maker` | AI Smart Skill Maker dual-direction matching (want what I teach & teach what I want) |
| `GET` | `/api/match` | 2-way reciprocal barter matching |
| `GET` | `/api/requests` | List swap proposals & paid bookings (sent and received) |
| `POST` | `/api/requests` | Propose 1-on-1 barter (₹0) or book paid session in ₹ |
| `PATCH` | `/api/requests/:id` | Accept, decline, or mark a session completed |
| `GET` | `/api/reviews/:studentId`| Get verified reviews for a student |
| `POST` | `/api/reviews` | Submit a review and recalculate student rating |
| `GET` | `/api/mail-logs` | Get history of contact drafts initiated from the site |
| `POST` | `/api/mail-logs` | Record an opened Gmail contact draft |
| `GET` | `/api/notifications` | View Gmail notification feed |
| `POST` | `/api/reset` | Reset demo data to clean seed state |

---

## 🧪 Testing the Main Flows

1. **Multiple Teach/Learn Skills**: Click "Join / Sign In" or "Edit Profile". Add multiple skills (e.g. Python, Java, Data Analytics) to "What can you teach?" and multiple skills to "What do you want to learn?".
2. **AI Smart Skill Maker**: Click "AI Smart Skill Maker" in the navigation. Verify that both sets appear:
   - *Students who want to learn skills I can teach*
   - *Students who can teach skills I want to learn*
   - *100% Reciprocal Swaps*
3. **Contact via Gmail**: Click "Contact via Gmail" on any mentor card. Verify the modal opens with prefilled recipient email, subject (`SkillSwap: [skill name]`), and custom message. Click "Open in Gmail Web Compose" to launch `mail.google.com` in your browser.
4. **Mail Log**: Click "Mail log" in navigation. Verify the contact draft entry appears with mentor, skill, timestamp, subject, and "Draft Opened in Gmail" status badge.
5. **My swaps**: Propose a swap or book a paid session in ₹. Open "My swaps" to see incoming and sent requests, accept or decline incoming requests, or mark accepted sessions as completed.
6. **Dark Mode**: Click the 🌙/☀️ button in the top navigation to toggle seamlessly between warm campus light mode and dark mode.

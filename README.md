<div align="center">
  <img src="public/globe.svg" alt="ReviseFlow Logo" width="100"/>
  <h1>🧠 ReviseFlow</h1>
  <p><strong>A guilt-free Spaced Repetition engine & Deep Work environment designed to conquer the Ebbinghaus Forgetting Curve.</strong></p>
</div>

<br />

## 🚨 The Problem: The Forgetting Curve
In 1885, Hermann Ebbinghaus discovered the **Forgetting Curve**—a mathematical formula demonstrating that humans forget approximately **80% of newly learned information within 7 days** unless that information is actively recalled at specifically spaced intervals. 

Modern students attempt to solve this manually with messy Excel spreadsheets, physical calendars, or rigid flashcard apps that punish them (via broken streaks) if they miss a single day, leading to severe burnout and guilt.

## 💡 The Solution: ReviseFlow
**ReviseFlow** is built on the modern psychological principle of *Guilt-Free Spaced Repetition*. The application abstracts away the absolute complexity of scheduling. When a user studies a topic, they simply log it. ReviseFlow's background engine dynamically calculates the optimal neurological intervals (`+1 day`, `+2 days`, `+4 days`, `+8 days`, `+16 days`) for long-term memory retention.

If a user misses a day, the system **does not break their streak**. Instead, it gently queues the overdue topics chronologically into a "Today's Revision" list, ensuring learning remains a sustainable, stress-free habit.

---

## ✨ Core Features Designed for deeply-focused work.
- **🚀 Automated Spaced Repetition Engine**: Employs a Fibonacci-like interval scale to maximize retention without overwhelming the user.
- **📊 Interactive Memory Retention Timeline**: A beautiful chronological history `/history` dashboard exposing projected retention percentages and a visual array tracking your progression from R1 to R6.
- **⏳ Native Pomodoro Flow**: A seamless timer built with the native Web Audio API (`/pomodoro`), allowing customizable deep-work (Focus/Break) loops. Integrated strictly with ancient philosophical grounding (rotating Bhagavad Gita verses) to prevent doom-scrolling and encourage absolute mental presence.
- **🛡️ Secure Role-Based Administration**: JWT-secured sessions via Google OAuth, featuring a concealed `/admin` panel exclusively compiled for `ADMIN` database roles.

## 🛠️ Technical Architecture (The Stack)
ReviseFlow is engineered with an emphasis on zero-latency UI interactions and strict edge-compatible component rendering. 

* **Frontend**: Next.js 15 (App Router with Turbopack), React 19, Tailwind CSS v4.
* **Backend**: Next.js Server Actions & API Routes natively executing in Node.
* **Database**: MongoDB paired with Prisma ORM for strictly-typed NoSQL interactions.
* **Auth**: NextAuth.js (v4) utilizing Google Provider OAuth 2.0.
* **UI/UX**: Custom-built fully responsive components, optimized glassmorphism, native SVGs (Lucide-React), Next-Themes for seamless hardware-accelerated Dark/Light mode flipping.

## ⚙️ Local Setup & Deployment

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/reviseflow.git
   cd reviseflow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Rename `.env.example` to `.env` (or create one) and configure your secrets:
   ```env
   DATABASE_URL="mongodb+srv://<user>:<password>@cluster.mongodb.net/reviseflow"
   GOOGLE_CLIENT_ID="your-google-oauth-client-id"
   GOOGLE_CLIENT_SECRET="your-google-oauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-super-secret-hash"
   ```

4. **Initialize Database Schema:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the Development Server (Turbopack):**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000` to begin.

---
> *"Perform your duty equipoised, abandoning all attachment to success or failure."* — Bhagavad Gita 2.48

# Placement Test Platform

Full-stack coding test platform with anti-cheat, code execution, and admin dashboard.

## Tech Stack
- **Frontend**: React (deployed as Render Static Site)
- **Backend**: Node.js + Express (deployed as Render Web Service)
- **Database**: Neon (PostgreSQL)
- **Code Execution**: Piston API (free, no key needed)

---

## Project Structure

```
placement-test/
├── server/
│   ├── index.js          ← Express API server
│   ├── package.json
│   └── .env.example
├── client/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   ├── data/
│   │   │   └── questions.js   ← All 60 questions
│   │   └── pages/
│   │       ├── StartScreen.js
│   │       ├── TestScreen.js
│   │       ├── ResultScreen.js
│   │       └── AdminPage.js
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── .env.example
├── schema.sql            ← Neon DB setup
├── render.yaml           ← Render deployment config
└── README.md
```

---

## Step 1 — Set up Neon Database

1. Go to https://neon.tech and create a free account
2. Create a new project (e.g. `placement-test`)
3. Go to your project dashboard → **Connection Details**
4. Copy the connection string — it looks like:
   ```
   postgresql://user:password@ep-xxxx-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
5. (Optional) Open the **SQL Editor** in Neon and run `schema.sql` to pre-create tables

---

## Step 2 — Deploy Backend on Render

1. Push this project to a GitHub repository
2. Go to https://render.com → **New → Web Service**
3. Connect your GitHub repo
4. Set:
   - **Name**: `placement-test-api`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
5. Add Environment Variables:
   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Your Neon connection string |
   | `ADMIN_SECRET` | A strong password (e.g. `myschool@2024`) |
   | `NODE_ENV` | `production` |
6. Click **Deploy**
7. Copy the URL — e.g. `https://placement-test-api.onrender.com`

---

## Step 3 — Deploy Frontend on Render

1. Go to Render → **New → Static Site**
2. Connect same GitHub repo
3. Set:
   - **Name**: `placement-test-client`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
4. Add Environment Variable:
   | Key | Value |
   |-----|-------|
   | `REACT_APP_API_URL` | Your backend URL from Step 2 |
5. Click **Deploy**
6. Your app will be live at e.g. `https://placement-test-client.onrender.com`

---

## Accessing the Admin Dashboard

Visit: `https://your-frontend-url.onrender.com/admin`

Enter the `ADMIN_SECRET` password you set in Step 2.

The admin page shows:
- Stats summary (total students, scores, auto-submits)
- Full results table with filtering and search
- Per-student detail with their code and run history

---

## Features

### Student Test
- Unique question per student (seeded by name + date)
- 1 array manipulation + 1 pattern question
- Code editor with syntax support (Python, Java, C, C++, JavaScript)
- Live code execution via Piston API
- Output compared to expected — instant pass/fail

### Anti-Cheat
- **Fullscreen enforced** on test start
- **Warning 1**: Student exits fullscreen → overlay warning, forced back in
- **Warning 2**: Second exit → test auto-submitted immediately
- **Right-click disabled**
- **Text selection disabled** (prevents select → Google search)
- All warnings and auto-submits logged in DB

### Admin Dashboard
- Live result table with score, language, warnings, duration
- Filter by score (2/2, 1/2, 0/2, auto-submitted)
- Search by name
- Click any student to see their submitted code + full run history

---

## Local Development

```bash
# Terminal 1 — Backend
cd server
cp .env.example .env
# Fill in .env with your Neon DATABASE_URL and ADMIN_SECRET
npm install
npm run dev

# Terminal 2 — Frontend
cd client
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:4000
npm install
npm start
```

---

## Notes

- Piston API is free and requires no API key
- Neon free tier supports up to 0.5 GB — plenty for 50 students
- Render free tier may spin down after 15 min inactivity; first request after spindown takes ~30s
- To prevent spindown, upgrade to Render Starter ($7/mo) or use UptimeRobot to ping your API

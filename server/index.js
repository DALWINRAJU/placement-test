require("dotenv").config();
process.removeAllListeners("warning");
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    process.env.FRONTEND_URL || "",
  ],
  methods: ["GET", "POST"],
}));
app.use(express.json());

// Proxy code execution through backend to avoid CORS issues with Piston
app.post("/api/execute", async (req, res) => {
  const { language, version, files } = req.body;
  const code = files && files[0] ? files[0].content : "";
  if (!code) return res.json({ run: { stdout: "", stderr: "" } });

  const PISTON_VERSIONS = {
    python: { lang: "python", ver: "3.10.0" },
    c: { lang: "c", ver: "10.2.0" },
    java: { lang: "java", ver: "15.0.2" },
  };

  const cfg = PISTON_VERSIONS[language] || { lang: language, ver: version || "*" };

  try {
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: cfg.lang,
        version: cfg.ver,
        files: [{ content: code }],
      }),
    });

    const data = await response.json();
    
    // If Piston returns an error (like 400), it might contain a "message" field instead of "run"
    if (!data.run && data.message) {
      return res.json({
        run: { stdout: "", stderr: `Piston Error: ${data.message}` },
        compile: { stderr: "" }
      });
    }

    res.json(data);
  } catch (err) {
    console.error("Execution error:", err);
    res.json({
      run: { stdout: "", stderr: "Execution service unavailable: " + err.message },
      compile: { stderr: "" }
    });
  }
});

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set! Add it in Render Environment Variables.");
  process.exit(1);
}

// Suppress pg SSL warning for Neon compatibility
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ── DB INIT ──────────────────────────────────────────────────────────────────
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id SERIAL PRIMARY KEY,
      student_id TEXT NOT NULL,
      student_name TEXT NOT NULL,
      array_question_id TEXT NOT NULL,
      pattern_question_id TEXT NOT NULL,
      array_passed BOOLEAN DEFAULT FALSE,
      pattern_passed BOOLEAN DEFAULT FALSE,
      array_code TEXT,
      pattern_code TEXT,
      array_language TEXT,
      pattern_language TEXT,
      array_attempts INTEGER DEFAULT 0,
      pattern_attempts INTEGER DEFAULT 0,
      warning_count INTEGER DEFAULT 0,
      auto_submitted BOOLEAN DEFAULT FALSE,
      started_at TIMESTAMPTZ DEFAULT NOW(),
      submitted_at TIMESTAMPTZ,
      score INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS run_logs (
      id SERIAL PRIMARY KEY,
      session_id INTEGER REFERENCES sessions(id),
      question_id TEXT,
      language TEXT,
      code TEXT,
      output TEXT,
      passed BOOLEAN,
      ran_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log("DB initialized");
}

// ── ROUTES ───────────────────────────────────────────────────────────────────

// Create or resume session
app.post("/api/session/start", async (req, res) => {
  try {
    const { studentName, arrayQuestionId, patternQuestionId } = req.body;
    if (!studentName) return res.status(400).json({ error: "Name required" });

    // Check if already has a session today
    const existing = await pool.query(
      `SELECT * FROM sessions WHERE student_name ILIKE $1 AND DATE(started_at) = CURRENT_DATE ORDER BY id DESC LIMIT 1`,
      [studentName.trim()]
    );

    if (existing.rows.length > 0) {
      return res.json({ session: existing.rows[0], resumed: true });
    }

    const studentId = `S${Date.now().toString(36).toUpperCase()}`;
    const result = await pool.query(
      `INSERT INTO sessions (student_id, student_name, array_question_id, pattern_question_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [studentId, studentName.trim(), arrayQuestionId, patternQuestionId]
    );
    res.json({ session: result.rows[0], resumed: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Log a code run
app.post("/api/session/:id/run", async (req, res) => {
  try {
    const { id } = req.params;
    const { questionId, language, code, output, passed, questionType } = req.body;

    await pool.query(
      `INSERT INTO run_logs (session_id, question_id, language, code, output, passed)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, questionId, language, code, output, passed]
    );

    const field = questionType === "array" ? "array" : "pattern";
    await pool.query(
      `UPDATE sessions SET
        ${field}_passed = $1,
        ${field}_code = $2,
        ${field}_language = $3,
        ${field}_attempts = ${field}_attempts + 1
       WHERE id = $4`,
      [passed, code, language, id]
    );

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Log warning / auto-submit
app.post("/api/session/:id/warning", async (req, res) => {
  try {
    const { id } = req.params;
    const { autoSubmit } = req.body;

    if (autoSubmit) {
      await pool.query(
        `UPDATE sessions SET warning_count = warning_count + 1, auto_submitted = TRUE, submitted_at = NOW(),
         score = (CASE WHEN array_passed THEN 1 ELSE 0 END + CASE WHEN pattern_passed THEN 1 ELSE 0 END)
         WHERE id = $1`,
        [id]
      );
    } else {
      await pool.query(
        `UPDATE sessions SET warning_count = warning_count + 1 WHERE id = $1`,
        [id]
      );
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit test
app.post("/api/session/:id/submit", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      `UPDATE sessions SET submitted_at = NOW(),
       score = (CASE WHEN array_passed THEN 1 ELSE 0 END + CASE WHEN pattern_passed THEN 1 ELSE 0 END)
       WHERE id = $1`,
      [id]
    );
    const result = await pool.query(`SELECT * FROM sessions WHERE id = $1`, [id]);
    res.json({ session: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ADMIN ROUTES ─────────────────────────────────────────────────────────────

// Get all results (admin)
app.get("/api/admin/results", async (req, res) => {
  try {
    const { secret } = req.query;
    if (secret !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const result = await pool.query(`
      SELECT
        id, student_id, student_name,
        array_question_id, pattern_question_id,
        array_passed, pattern_passed,
        array_language, pattern_language,
        array_attempts, pattern_attempts,
        warning_count, auto_submitted,
        score,
        started_at, submitted_at,
        CASE WHEN submitted_at IS NOT NULL
          THEN EXTRACT(EPOCH FROM (submitted_at - started_at))/60
          ELSE NULL
        END AS duration_minutes
      FROM sessions
      ORDER BY submitted_at DESC NULLS LAST, started_at DESC
    `);
    res.json({ results: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get detail for one student (admin)
app.get("/api/admin/results/:id", async (req, res) => {
  try {
    const { secret } = req.query;
    if (secret !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const session = await pool.query(`SELECT * FROM sessions WHERE id = $1`, [req.params.id]);
    const logs = await pool.query(`SELECT * FROM run_logs WHERE session_id = $1 ORDER BY ran_at`, [req.params.id]);
    res.json({ session: session.rows[0], logs: logs.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stats summary
app.get("/api/admin/stats", async (req, res) => {
  try {
    const { secret } = req.query;
    if (secret !== process.env.ADMIN_SECRET) return res.status(401).json({ error: "Unauthorized" });

    const stats = await pool.query(`
      SELECT
        COUNT(*) AS total_students,
        COUNT(submitted_at) AS submitted,
        COUNT(*) FILTER (WHERE score = 2) AS full_score,
        COUNT(*) FILTER (WHERE score = 1) AS half_score,
        COUNT(*) FILTER (WHERE score = 0 AND submitted_at IS NOT NULL) AS zero_score,
        COUNT(*) FILTER (WHERE auto_submitted = TRUE) AS auto_submitted,
        ROUND(AVG(array_attempts),1) AS avg_array_attempts,
        ROUND(AVG(pattern_attempts),1) AS avg_pattern_attempts
      FROM sessions
    `);
    res.json(stats.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;

// Test DB connection first before starting
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    console.error("Check your DATABASE_URL environment variable in Render.");
    process.exit(1);
  }
  release();
  console.log("✅ Database connected");
  initDB()
    .then(() => {
      app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
    })
    .catch(err => {
      console.error("❌ DB init failed:", err.message);
      process.exit(1);
    });
});
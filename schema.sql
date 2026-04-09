-- ============================================================
--  Placement Test — Neon DB Schema
--  Run this once in Neon SQL Editor to set up tables
--  (The server also auto-creates these on first start)
-- ============================================================

CREATE TABLE IF NOT EXISTS sessions (
  id                  SERIAL PRIMARY KEY,
  student_id          TEXT NOT NULL,
  student_name        TEXT NOT NULL,
  array_question_id   TEXT NOT NULL,
  pattern_question_id TEXT NOT NULL,
  array_passed        BOOLEAN DEFAULT FALSE,
  pattern_passed      BOOLEAN DEFAULT FALSE,
  array_code          TEXT,
  pattern_code        TEXT,
  array_language      TEXT,
  pattern_language    TEXT,
  array_attempts      INTEGER DEFAULT 0,
  pattern_attempts    INTEGER DEFAULT 0,
  warning_count       INTEGER DEFAULT 0,
  auto_submitted      BOOLEAN DEFAULT FALSE,
  started_at          TIMESTAMPTZ DEFAULT NOW(),
  submitted_at        TIMESTAMPTZ,
  score               INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS run_logs (
  id          SERIAL PRIMARY KEY,
  session_id  INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
  question_id TEXT,
  language    TEXT,
  code        TEXT,
  output      TEXT,
  passed      BOOLEAN,
  ran_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_sessions_name    ON sessions(student_name);
CREATE INDEX IF NOT EXISTS idx_sessions_date    ON sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_runlogs_session  ON run_logs(session_id);

-- ── Useful admin queries ───────────────────────────────────────────────────

-- View all results
SELECT
  id, student_name, student_id,
  array_question_id, pattern_question_id,
  array_passed, pattern_passed,
  array_language, pattern_language,
  array_attempts, pattern_attempts,
  warning_count, auto_submitted,
  score,
  started_at,
  submitted_at,
  ROUND(EXTRACT(EPOCH FROM (submitted_at - started_at))/60, 1) AS duration_minutes
FROM sessions
ORDER BY submitted_at DESC NULLS LAST;

-- Score distribution
SELECT score, COUNT(*) AS students
FROM sessions
GROUP BY score
ORDER BY score DESC;

-- Auto-submitted students
SELECT student_name, warning_count, score, submitted_at
FROM sessions
WHERE auto_submitted = TRUE;

-- Most attempted questions
SELECT question_id, COUNT(*) AS total_runs, SUM(CASE WHEN passed THEN 1 ELSE 0 END) AS passes
FROM run_logs
GROUP BY question_id
ORDER BY total_runs DESC;

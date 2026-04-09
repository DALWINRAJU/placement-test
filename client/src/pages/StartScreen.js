import React, { useState } from "react";
import { ARRAY_QUESTIONS, PATTERN_QUESTIONS } from "../data/questions";

const API = process.env.REACT_APP_API_URL || "";

function seededRandom(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return ((h >>> 0) / 4294967296);
}

function assignQuestions(name) {
  const seed = name.toLowerCase().trim() + new Date().toDateString();
  const r1 = seededRandom(seed + "array");
  const r2 = seededRandom(seed + "pattern");
  const aq = ARRAY_QUESTIONS[Math.floor(r1 * ARRAY_QUESTIONS.length)];
  const pq = PATTERN_QUESTIONS[Math.floor(r2 * PATTERN_QUESTIONS.length)];
  return { aq, pq };
}

export default function StartScreen({ onStart }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStart() {
    const trimmed = name.trim();
    if (!trimmed) { setError("Please enter your name or roll number."); return; }
    setLoading(true);
    setError("");
    try {
      const { aq, pq } = assignQuestions(trimmed);
      const res = await fetch(`${API}/api/session/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: trimmed,
          arrayQuestionId: aq.id,
          patternQuestionId: pq.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onStart({ session: data.session, questions: [aq, pq], resumed: data.resumed });
    } catch (err) {
      setError(err.message || "Failed to start. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ textAlign: "center", padding: "2rem 0 1.5rem" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>💻</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Placement Test</h1>
        <p style={{ fontSize: 14, color: "#6b7280" }}>Loops · Patterns · Array Manipulation</p>
      </div>

      <div className="card">
        <p style={{ fontSize: 14, color: "#374151", marginBottom: "1rem", lineHeight: 1.6 }}>
          Enter your name or roll number. You will receive <strong>2 unique questions</strong> — one array manipulation and one pattern.
        </p>

        <label style={{ fontSize: 13, color: "#6b7280", display: "block", marginBottom: 4 }}>
          Your name / roll number
        </label>
        <input
          type="text"
          placeholder="e.g. Arun Kumar or 21CS045"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleStart()}
          autoFocus
        />

        {error && (
          <p style={{ color: "#dc2626", fontSize: 13, marginBottom: "0.75rem" }}>{error}</p>
        )}

        <button className="btn-primary" onClick={handleStart} disabled={loading}>
          {loading ? "Setting up..." : "Start Test →"}
        </button>
      </div>

      <div className="card" style={{ background: "#fffbeb", borderColor: "#fcd34d" }}>
        <p style={{ fontSize: 13, color: "#92400e", fontWeight: 600, marginBottom: 6 }}>Before you begin</p>
        <ul style={{ fontSize: 13, color: "#78350f", paddingLeft: "1.25rem", lineHeight: 1.8 }}>
          <li>The test will open in <strong>full screen</strong></li>
          <li>Leaving full screen gives <strong>1 warning</strong></li>
          <li>A second exit will <strong>auto-submit</strong> your test</li>
          <li>Text selection and right-click are <strong>disabled</strong></li>
          <li>Code in Python, Java, C, C++ or JavaScript</li>
          <li>Match the expected output exactly to pass</li>
        </ul>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef, useCallback } from "react";

const API = process.env.REACT_APP_API_URL || "";
const TOTAL_SECONDS = 10 * 60; // 10 minutes

const LANG_CONFIG = {
  python: { pistonLang: "python", pistonVer: "3.10.0", label: "Python", starter: "# Write your solution here\n\n" },
  c: { pistonLang: "c", pistonVer: "10.2.0", label: "C", starter: "#include <stdio.h>\n\nint main() {\n  // Write your solution here\n  return 0;\n}" },
  java: { pistonLang: "java", pistonVer: "15.0.2", label: "Java", starter: "import java.util.*;\n\npublic class Main {\n  public static void main(String[] args) {\n    // Write your solution here\n  }\n}" },
};

function matrixDisplay(matrix) {
  return matrix.map(row => "[" + row.join(", ") + "]").join("\n");
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function TestScreen({ sessionData, onFinish }) {
  const { session, questions } = sessionData;
  const [qIndex, setQIndex] = useState(0);
  const [codes, setCodes] = useState({ 0: LANG_CONFIG.python.starter, 1: LANG_CONFIG.python.starter });
  const [langs, setLangs] = useState({ 0: "python", 1: "python" });
  const [outputs, setOutputs] = useState({ 0: null, 1: null });
  const [passed, setPassed] = useState({ 0: false, 1: false });
  const [running, setRunning] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const autoSubmitRef = useRef(false);
  const timerRef = useRef(null);

  const currentQ = questions[qIndex];
  const currentLang = langs[qIndex];

  // ── Timer ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (!autoSubmitRef.current) {
            autoSubmitRef.current = true;
            doSubmit(true);
          }
          return 0;
        }
        if (prev === 120) setShowTimeWarning(true); // 2 min warning
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // ── Anti-cheat: disable right-click, text selection ──────────────────────
  useEffect(() => {
    const noContext = e => e.preventDefault();
    const noSelect = e => e.preventDefault();
    document.addEventListener("contextmenu", noContext);
    document.addEventListener("selectstart", noSelect);
    return () => {
      document.removeEventListener("contextmenu", noContext);
      document.removeEventListener("selectstart", noSelect);
    };
  }, []);

  // ── Anti-cheat: fullscreen ────────────────────────────────────────────────
  const requestFullscreen = useCallback(() => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
  }, []);

  const handleFSChange = useCallback(async () => {
    const isFull = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement
    );
    if (!isFull && !autoSubmitRef.current && !submitted) {
      const newCount = warningCount + 1;
      setWarningCount(newCount);
      await fetch(`${API}/api/session/${session.id}/warning`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autoSubmit: newCount >= 2 }),
      });
      if (newCount >= 2) {
        autoSubmitRef.current = true;
        doSubmit(true);
      } else {
        setShowWarning(true);
      }
    }
  }, [warningCount, submitted, session.id]);

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFSChange);
    document.addEventListener("webkitfullscreenchange", handleFSChange);
    document.addEventListener("mozfullscreenchange", handleFSChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFSChange);
      document.removeEventListener("webkitfullscreenchange", handleFSChange);
      document.removeEventListener("mozfullscreenchange", handleFSChange);
    };
  }, [handleFSChange]);

  useEffect(() => {
    setTimeout(requestFullscreen, 300);
  }, [requestFullscreen]);

  // ── Language change ───────────────────────────────────────────────────────
  function changeLang(newLang) {
    setLangs(prev => ({ ...prev, [qIndex]: newLang }));
    if (!codes[qIndex] || codes[qIndex] === LANG_CONFIG[currentLang]?.starter) {
      setCodes(prev => ({ ...prev, [qIndex]: LANG_CONFIG[newLang].starter }));
    }
  }

  // ── Run code via Piston API ───────────────────────────────────────────────
  async function runCode() {
    setRunning(true);
    setOutputs(prev => ({ ...prev, [qIndex]: { display: "Running...", raw: "" } }));
    const cfg = LANG_CONFIG[currentLang];
    const code = codes[qIndex] || "";
    try {
      const res = await fetch(`${API}/api/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: cfg.pistonLang,
          version: cfg.pistonVer,
          files: [{ content: code }],
        }),
      });
      const data = await res.json();
      const stdout = data.run?.stdout || "";
      const stderr = data.run?.stderr || "";
      const compileErr = data.compile?.stderr || "";

      let display = stdout;
      if (stderr) display += (display ? "\n" : "") + "[stderr]\n" + stderr;
      if (compileErr) display = "[compile error]\n" + compileErr + (display ? "\n" + display : "");
      if (!display) display = "(no output)";

      const trimmedOut = stdout.trim();
      const expected = currentQ.expected.trim();
      const isPassed = trimmedOut === expected && !compileErr;

      setOutputs(prev => ({ ...prev, [qIndex]: { display, raw: trimmedOut } }));
      setPassed(prev => ({ ...prev, [qIndex]: isPassed }));

      await fetch(`${API}/api/session/${session.id}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQ.id,
          language: currentLang,
          code,
          output: trimmedOut,
          passed: isPassed,
          questionType: currentQ.type,
        }),
      });
    } catch (err) {
      setOutputs(prev => ({ ...prev, [qIndex]: { display: "Network error: " + err.message, raw: "" } }));
    } finally {
      setRunning(false);
    }
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function doSubmit(isAuto = false) {
    if (submitted) return;
    clearInterval(timerRef.current);
    setSubmitted(true);
    try {
      const res = await fetch(`${API}/api/session/${session.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autoSubmit: isAuto }),
      });
      const data = await res.json();
      onFinish({ session: data.session, questions, passed, isAuto });
    } catch (err) {
      onFinish({ session, questions, passed, isAuto });
    }
  }

  function dismissWarning() {
    setShowWarning(false);
    requestFullscreen();
  }

  const progressPct = ((qIndex + 1) / questions.length) * 100;
  const timerColor = timeLeft <= 60 ? "#dc2626" : timeLeft <= 120 ? "#d97706" : "#059669";
  const isUrgent = timeLeft <= 60;

  return (
    <div>
      {/* Fullscreen warning overlay */}
      {showWarning && (
        <div className="warning-overlay">
          <div className="warning-box">
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "#dc2626" }}>
              Warning! ({warningCount}/2)
            </h2>
            <p style={{ fontSize: 14, color: "#374151", marginBottom: "1.25rem", lineHeight: 1.6 }}>
              You exited full screen. This is your <strong>warning {warningCount} of 2</strong>.
              Exiting again will <strong>auto-submit</strong> your test immediately.
            </p>
            <button className="btn-primary" onClick={dismissWarning}>
              Return to full screen
            </button>
          </div>
        </div>
      )}

      {/* 2-minute warning overlay */}
      {showTimeWarning && !submitted && (
        <div className="warning-overlay">
          <div className="warning-box">
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏰</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "#d97706" }}>
              2 minutes left!
            </h2>
            <p style={{ fontSize: 14, color: "#374151", marginBottom: "1.25rem", lineHeight: 1.6 }}>
              Only <strong>2 minutes</strong> remaining. Please submit your answers soon.
            </p>
            <button className="btn-primary" style={{ background: "#d97706" }}
              onClick={() => setShowTimeWarning(false)}>
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Top bar with timer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
          Placement Test
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {warningCount > 0 && (
            <span style={{ fontSize: 12, color: "#dc2626", fontWeight: 600 }}>
              ⚠ {warningCount}/2
            </span>
          )}
          {/* Timer */}
          <div style={{
            background: isUrgent ? "#fee2e2" : timeLeft <= 120 ? "#fef3c7" : "#f0fdf4",
            border: `1.5px solid ${timerColor}`,
            borderRadius: 8,
            padding: "4px 12px",
            fontFamily: "monospace",
            fontSize: 16,
            fontWeight: 700,
            color: timerColor,
            minWidth: 70,
            textAlign: "center",
            animation: isUrgent ? "pulse 1s infinite" : "none",
          }}>
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Question tab switcher */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.85rem" }}>
        {questions.map((q, i) => {
          const isActive = qIndex === i;
          const isPassed = passed[i];
          const hasOutput = !!(outputs[i]?.display && outputs[i].display !== "Running...");
          return (
            <button key={q.id} onClick={() => setQIndex(i)} style={{
              flex: 1, padding: "0.6rem 0.5rem", borderRadius: 10,
              border: isActive ? "2px solid #6d28d9" : "1px solid #e5e7eb",
              background: isActive ? "#ede9fe" : isPassed ? "#f0fdf4" : hasOutput ? "#fff7ed" : "#fff",
              color: isActive ? "#4c1d95" : isPassed ? "#065f46" : hasOutput ? "#92400e" : "#6b7280",
              fontWeight: isActive ? 700 : 500, fontSize: 13, cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            }}>
              <span style={{ fontSize: 11, opacity: 0.75 }}>Q{i + 1}</span>
              <span style={{ fontSize: 12 }}>{q.type === "array" ? "Array" : "Pattern"}</span>
              <span style={{ fontSize: 16 }}>{isPassed ? "✓" : hasOutput ? "✗" : "○"}</span>
            </button>
          );
        })}
      </div>

      <div className="progress-wrap">
        <div className="progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      {/* Question card */}
      <div className="card">
        <span className={`badge badge-${currentQ.type}`}>
          {currentQ.type === "array" ? "Array Manipulation" : "Pattern"}
        </span>
        <span className={`badge badge-${currentQ.difficulty}`}>{currentQ.difficulty}</span>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: "0.5rem" }}>{currentQ.title}</h2>
        <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.65, marginBottom: "0.75rem" }}>
          {currentQ.desc}
        </p>
        {currentQ.matrix && (
          <>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Input matrix:</div>
            <div className="code-block">{matrixDisplay(currentQ.matrix)}</div>
          </>
        )}
        {currentQ.input && (
          <>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Input:</div>
            <div className="code-block">{currentQ.input}</div>
          </>
        )}
        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Expected output:</div>
        <div className="code-block" style={{ color: "#065f46", background: "#f0fdf4", borderColor: "#bbf7d0" }}>
          {currentQ.expected}
        </div>
      </div>

      {/* Code editor card */}
      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
          Your solution
        </div>

        <select value={currentLang} onChange={e => changeLang(e.target.value)}>
          {Object.entries(LANG_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>

        <textarea
          className="code-editor"
          value={codes[qIndex] || ""}
          onChange={e => setCodes(prev => ({ ...prev, [qIndex]: e.target.value }))}
          onKeyDown={e => {
            if (e.key === "Tab") {
              e.preventDefault();
              const s = e.target.selectionStart;
              const val = codes[qIndex] || "";
              setCodes(prev => ({ ...prev, [qIndex]: val.slice(0, s) + "  " + val.slice(e.target.selectionEnd) }));
              setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = s + 2; }, 0);
            }
          }}
          spellCheck={false} autoCorrect="off" autoCapitalize="off"
        />

        <button className="btn-run" onClick={runCode} disabled={running}>
          {running ? "Running..." : "▶  Run Code"}
        </button>

        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: "0.4rem" }}>Output:</div>
        <div className="output-box">{outputs[qIndex]?.display || "—"}</div>

        {outputs[qIndex]?.display && outputs[qIndex].display !== "Running..." && (
          <div style={{ marginBottom: "0.75rem" }}>
            {passed[qIndex] ? (
              <span className="verdict-pass">✓ Correct! Output matches.</span>
            ) : (
              <div>
                <span className="verdict-fail">✗ Output does not match expected.</span>
                <div style={{ marginTop: "0.5rem", fontSize: 12 }}>
                  <div style={{ color: "#6b7280", marginBottom: 3 }}>Expected:</div>
                  <div style={{
                    background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6,
                    padding: "0.5rem", fontFamily: "monospace", fontSize: 12,
                    whiteSpace: "pre-wrap", color: "#065f46", marginBottom: "0.5rem"
                  }}>{currentQ.expected}</div>
                  <div style={{ color: "#6b7280", marginBottom: 3 }}>Your output:</div>
                  <div style={{
                    background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 6,
                    padding: "0.5rem", fontFamily: "monospace", fontSize: 12,
                    whiteSpace: "pre-wrap", color: "#9a3412"
                  }}>{outputs[qIndex]?.raw || "(no stdout)"}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", gap: "0.6rem", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #f3f4f6" }}>
          <button onClick={() => setQIndex(i => Math.max(0, i - 1))} disabled={qIndex === 0}
            style={{
              flex: 1, padding: "0.7rem", borderRadius: 10, border: "1px solid #d1d5db",
              background: qIndex === 0 ? "#f9fafb" : "#fff",
              color: qIndex === 0 ? "#d1d5db" : "#374151",
              fontWeight: 600, fontSize: 14, cursor: qIndex === 0 ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
            ← Previous
          </button>
          {qIndex < questions.length - 1 ? (
            <button onClick={() => setQIndex(i => Math.min(questions.length - 1, i + 1))}
              style={{
                flex: 1, padding: "0.7rem", borderRadius: 10,
                border: "2px solid #6d28d9", background: "#6d28d9", color: "#fff",
                fontWeight: 600, fontSize: 14, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
              Next →
            </button>
          ) : (
            <button onClick={() => doSubmit(false)} disabled={submitted}
              style={{
                flex: 1, padding: "0.7rem", borderRadius: 10, border: "none",
                background: submitted ? "#6ee7b7" : "#059669",
                color: "#fff", fontWeight: 700, fontSize: 14,
                cursor: submitted ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
              {submitted ? "Submitting..." : "Submit Test ✓"}
            </button>
          )}
        </div>

        {/* Dot indicators */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: "0.75rem" }}>
          {questions.map((_, i) => (
            <button key={i} onClick={() => setQIndex(i)} style={{
              width: 10, height: 10, borderRadius: "50%", border: "none", padding: 0,
              background: i === qIndex ? "#6d28d9" : passed[i] ? "#059669" : outputs[i]?.raw ? "#f59e0b" : "#d1d5db",
              cursor: "pointer", transition: "background 0.2s",
            }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
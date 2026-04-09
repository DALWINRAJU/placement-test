import React from "react";

export default function ResultScreen({ sessionData }) {
  const { session, questions, passed, isAuto } = sessionData;
  const score = (passed[0] ? 1 : 0) + (passed[1] ? 1 : 0);

  return (
    <div>
      <div style={{ textAlign: "center", padding: "2rem 0 1.5rem" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>
          {score === 2 ? "🎉" : score === 1 ? "👍" : "📝"}
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
          {isAuto ? "Test Auto-Submitted" : "Test Submitted!"}
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280" }}>
          {isAuto ? "You exited full screen twice. Your answers have been saved." : "Your answers have been recorded."}
        </p>
      </div>

      <div className="card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>Your score</div>
        <div style={{ fontSize: 48, fontWeight: 700, color: score === 2 ? "#065f46" : score === 1 ? "#92400e" : "#991b1b" }}>
          {score} / 2
        </div>
      </div>

      {questions.map((q, i) => (
        <div className="card" key={q.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span className={`badge badge-${q.type}`}>{q.type === "array" ? "Array" : "Pattern"}</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{q.title}</span>
            </div>
            {passed[i]
              ? <span className="verdict-pass">✓ Passed</span>
              : <span className="verdict-fail">✗ Failed</span>
            }
          </div>
        </div>
      ))}

      <div className="card" style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}>
        <p style={{ fontSize: 13, color: "#6b7280", textAlign: "center" }}>
          Your result has been saved. You may close this window.
        </p>
      </div>
    </div>
  );
}

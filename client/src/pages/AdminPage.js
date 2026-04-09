import React, { useState, useEffect } from "react";

const API = process.env.REACT_APP_API_URL || "";

function fmt(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" });
}

function dur(min) {
  if (!min) return "—";
  const m = Math.floor(min);
  const s = Math.round((min - m) * 60);
  return `${m}m ${s}s`;
}

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [stats, setStats] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  async function login() {
    setLoading(true); setError("");
    try {
      const [sr, rr] = await Promise.all([
        fetch(`${API}/api/admin/stats?secret=${secret}`),
        fetch(`${API}/api/admin/results?secret=${secret}`),
      ]);
      if (!sr.ok) throw new Error("Wrong password");
      const sd = await sr.json();
      const rd = await rr.json();
      setStats(sd);
      setResults(rd.results);
      setAuthed(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadDetail(id) {
    setSelected(id);
    const res = await fetch(`${API}/api/admin/results/${id}?secret=${secret}`);
    const data = await res.json();
    setDetail(data);
  }

  async function refresh() {
    const [sr, rr] = await Promise.all([
      fetch(`${API}/api/admin/stats?secret=${secret}`),
      fetch(`${API}/api/admin/results?secret=${secret}`),
    ]);
    setStats(await sr.json());
    setResults((await rr.json()).results);
  }

  const filtered = results.filter(r => {
    const matchFilter = filter === "all" || String(r.score) === filter || (filter === "auto" && r.auto_submitted);
    const matchSearch = r.student_name.toLowerCase().includes(search.toLowerCase()) || r.student_id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (!authed) {
    return (
      <div style={{ maxWidth: 400, margin: "4rem auto", padding: "1rem" }}>
        <div className="card">
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: "1rem", textAlign: "center" }}>Admin Login</h1>
          <input type="password" placeholder="Admin password" value={secret} onChange={e => setSecret(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} />
          {error && <p style={{ color: "#dc2626", fontSize: 13, marginBottom: "0.75rem" }}>{error}</p>}
          <button className="btn-primary" onClick={login} disabled={loading}>{loading ? "Checking..." : "Login"}</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>Admin Dashboard</h1>
          <p style={{ fontSize: 13, color: "#6b7280" }}>Placement Test Results</p>
        </div>
        <button className="btn-secondary" onClick={refresh}>↻ Refresh</button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="stat-grid">
          <div className="stat-card"><div className="stat-label">Total students</div><div className="stat-value">{stats.total_students}</div></div>
          <div className="stat-card"><div className="stat-label">Submitted</div><div className="stat-value">{stats.submitted}</div></div>
          <div className="stat-card"><div className="stat-label">Full score (2/2)</div><div className="stat-value" style={{ color: "#065f46" }}>{stats.full_score}</div></div>
          <div className="stat-card"><div className="stat-label">Half score (1/2)</div><div className="stat-value" style={{ color: "#92400e" }}>{stats.half_score}</div></div>
          <div className="stat-card"><div className="stat-label">Score 0/2</div><div className="stat-value" style={{ color: "#991b1b" }}>{stats.zero_score}</div></div>
          <div className="stat-card"><div className="stat-label">Auto-submitted</div><div className="stat-value" style={{ color: "#b45309" }}>{stats.auto_submitted}</div></div>
          <div className="stat-card"><div className="stat-label">Avg array attempts</div><div className="stat-value">{stats.avg_array_attempts}</div></div>
          <div className="stat-card"><div className="stat-label">Avg pattern attempts</div><div className="stat-value">{stats.avg_pattern_attempts}</div></div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <input type="text" placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 160, marginBottom: 0 }} />
        {["all","2","1","0","auto"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className="btn-secondary"
            style={{ background: filter === f ? "#6d28d9" : "", color: filter === f ? "#fff" : "", borderColor: filter === f ? "#6d28d9" : "" }}>
            {f === "all" ? "All" : f === "auto" ? "Auto-submitted" : `Score ${f}/2`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>ID</th>
              <th>Array Q</th>
              <th>Pattern Q</th>
              <th>Score</th>
              <th>Warnings</th>
              <th>Auto?</th>
              <th>Duration</th>
              <th>Submitted</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id}>
                <td style={{ color: "#9ca3af" }}>{i + 1}</td>
                <td style={{ fontWeight: 500 }}>{r.student_name}</td>
                <td style={{ fontFamily: "monospace", fontSize: 12 }}>{r.student_id}</td>
                <td>
                  <span style={{ fontSize: 11 }}>{r.array_question_id}</span>
                  {r.array_language && <span className="badge" style={{ background: "#ede9fe", color: "#4c1d95", marginLeft: 4 }}>{r.array_language}</span>}
                  {r.array_passed ? <span className="verdict-pass" style={{ fontSize: 11, padding: "2px 6px" }}>✓</span> : <span className="verdict-fail" style={{ fontSize: 11, padding: "2px 6px" }}>✗</span>}
                </td>
                <td>
                  <span style={{ fontSize: 11 }}>{r.pattern_question_id}</span>
                  {r.pattern_language && <span className="badge" style={{ background: "#d1fae5", color: "#064e3b", marginLeft: 4 }}>{r.pattern_language}</span>}
                  {r.pattern_passed ? <span className="verdict-pass" style={{ fontSize: 11, padding: "2px 6px" }}>✓</span> : <span className="verdict-fail" style={{ fontSize: 11, padding: "2px 6px" }}>✗</span>}
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: r.score === 2 ? "#065f46" : r.score === 1 ? "#92400e" : "#991b1b" }}>
                    {r.score ?? "—"}/2
                  </span>
                </td>
                <td>{r.warning_count > 0 ? <span style={{ color: "#dc2626" }}>{r.warning_count}</span> : 0}</td>
                <td>{r.auto_submitted ? <span style={{ color: "#b45309", fontWeight: 600 }}>Yes</span> : "No"}</td>
                <td>{dur(r.duration_minutes)}</td>
                <td style={{ fontSize: 12 }}>{fmt(r.submitted_at)}</td>
                <td>
                  <button className="btn-secondary" style={{ fontSize: 12, padding: "4px 10px" }} onClick={() => loadDetail(r.id)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={11} style={{ textAlign: "center", color: "#9ca3af", padding: "2rem" }}>No results found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      {selected && detail && (
        <div style={{ marginTop: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Student Detail — {detail.session?.student_name}</h2>
            <button className="btn-secondary" onClick={() => { setSelected(null); setDetail(null); }}>✕ Close</button>
          </div>
          <div className="card">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: 13, marginBottom: "1rem" }}>
              <div><span style={{ color: "#6b7280" }}>Student ID: </span>{detail.session?.student_id}</div>
              <div><span style={{ color: "#6b7280" }}>Score: </span><strong>{detail.session?.score}/2</strong></div>
              <div><span style={{ color: "#6b7280" }}>Array Q: </span>{detail.session?.array_question_id} — {detail.session?.array_passed ? "✓ Passed" : "✗ Failed"}</div>
              <div><span style={{ color: "#6b7280" }}>Pattern Q: </span>{detail.session?.pattern_question_id} — {detail.session?.pattern_passed ? "✓ Passed" : "✗ Failed"}</div>
              <div><span style={{ color: "#6b7280" }}>Warnings: </span>{detail.session?.warning_count}</div>
              <div><span style={{ color: "#6b7280" }}>Auto-submit: </span>{detail.session?.auto_submitted ? "Yes" : "No"}</div>
            </div>

            {detail.session?.array_code && (
              <>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Array solution ({detail.session.array_language}):</div>
                <pre style={{ background: "#1e1e2e", color: "#cdd6f4", padding: "0.75rem", borderRadius: 8, fontSize: 12, overflowX: "auto", marginBottom: "1rem" }}>{detail.session.array_code}</pre>
              </>
            )}
            {detail.session?.pattern_code && (
              <>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Pattern solution ({detail.session.pattern_language}):</div>
                <pre style={{ background: "#1e1e2e", color: "#cdd6f4", padding: "0.75rem", borderRadius: 8, fontSize: 12, overflowX: "auto", marginBottom: "1rem" }}>{detail.session.pattern_code}</pre>
              </>
            )}

            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: "0.5rem" }}>Run history ({detail.logs?.length} runs):</div>
            <div className="table-scroll">
              <table className="admin-table">
                <thead><tr><th>Q</th><th>Lang</th><th>Passed</th><th>Output (preview)</th><th>Time</th></tr></thead>
                <tbody>
                  {detail.logs?.map(l => (
                    <tr key={l.id}>
                      <td>{l.question_id}</td>
                      <td>{l.language}</td>
                      <td>{l.passed ? <span className="verdict-pass" style={{ fontSize: 11, padding: "2px 6px" }}>✓</span> : <span className="verdict-fail" style={{ fontSize: 11, padding: "2px 6px" }}>✗</span>}</td>
                      <td style={{ fontFamily: "monospace", fontSize: 11, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.output?.slice(0, 80)}</td>
                      <td style={{ fontSize: 11 }}>{fmt(l.ran_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

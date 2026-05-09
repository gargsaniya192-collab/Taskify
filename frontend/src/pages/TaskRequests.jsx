import { useEffect, useState } from "react";
import privateApi from "../services/privateApi";

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

export default function TaskRequests() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const width = useWindowWidth();
  const isMobile = width < 600;

  const fetchRequests = async () => {
    try {
      const res = await privateApi.get("/tasks/pending-requests");
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleApprove = async (id) => {
    try {
      await privateApi.patch(`/tasks/${id}/approve-status`);
      fetchRequests();
    } catch (err) { alert("Failed to approve"); }
  };

  const handleReject = async (id) => {
    try {
      await privateApi.patch(`/tasks/${id}/reject-status`);
      fetchRequests();
    } catch (err) { alert("Failed to reject"); }
  };

  if (loading) return (
    <div style={s.loader}>
      <div style={s.spinner}></div>
      <p>Loading requests...</p>
    </div>
  );

  return (
    <div style={{ ...s.page, padding: isMobile ? 12 : 24 }}>
      <h2 style={{ ...s.heading, fontSize: isMobile ? 18 : 22 }}>📌 Pending Task Requests</h2>

      {tasks.length === 0 ? (
        <p style={s.empty}>No pending requests</p>
      ) : (
        <div style={{ ...s.grid, gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {tasks.map((task) => (
            <div key={task.id} style={s.card}>
              <h3 style={s.taskTitle}>{task.title}</h3>
              <div style={s.badges}>
                <span style={s.badge}>
                  Current: <strong>{task.status}</strong>
                </span>
                <span style={{ ...s.badge, background: "#FEF9C3", color: "#854D0E" }}>
                  Requested: <strong>{task.statusRequest}</strong>
                </span>
              </div>
              <div style={{ ...s.btnBox, flexDirection: isMobile ? "column" : "row" }}>
                <button style={s.approve} onClick={() => handleApprove(task.id)}>✅ Approve</button>
                <button style={s.reject} onClick={() => handleReject(task.id)}>❌ Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  page: { background: "#f9fafb", minHeight: "100vh", fontFamily: "sans-serif", boxSizing: "border-box" },
  heading: { fontWeight: 700, marginBottom: 20, color: "#111" },
  grid: { display: "grid", gap: 16 },
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, boxShadow: "0 4px 10px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: 10 },
  taskTitle: { fontSize: 15, fontWeight: 600, margin: 0, color: "#1f2937" },
  badges: { display: "flex", flexWrap: "wrap", gap: 8 },
  badge: { fontSize: 12, background: "#F3F4F6", color: "#374151", padding: "4px 10px", borderRadius: 20 },
  btnBox: { display: "flex", gap: 8, marginTop: 4 },
  approve: { flex: 1, background: "#16A34A", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 },
  reject: { flex: 1, background: "#DC2626", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 },
  empty: { color: "#9ca3af", fontSize: 14, marginTop: 40, textAlign: "center" },
  loader: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 10, fontFamily: "sans-serif" },
  spinner: { width: 22, height: 22, borderRadius: "50%", border: "3px solid #ddd", borderTopColor: "#111", animation: "spin 0.8s linear infinite" },
};
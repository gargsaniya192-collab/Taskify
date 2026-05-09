import { useEffect, useState } from "react";
import privateApi from "../services/privateApi";
import { useParams } from "react-router-dom";

const STATUS = {
  todo: { label: "To Do", color: "#6B7280", bg: "#F3F4F6" },
  "in-progress": { label: "In Progress", color: "#2563EB", bg: "#DBEAFE" },
  done: { label: "Done", color: "#16A34A", bg: "#DCFCE7" },
};

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

export default function TaskBoard() {
  const [open, setOpen] = useState(false);
  const [selTask, setSelTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const { projectId } = useParams();
  const width = useWindowWidth();
  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 900;

  const [board, setBoard] = useState({ todo: [], "in-progress": [], done: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await privateApi.get(`/tasks/project/${projectId}/board`);
        setBoard(res.data.board);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, [projectId]);

  const openComments = async (task) => {
    setSelTask(task);
    setOpen(true);
    try {
      const res = await privateApi.get(`/comments/tasks/${task.id}/comments`);
      setComments(res.data);
    } catch (err) { console.log(err); }
  };

  const sendComment = async () => {
    if (!text.trim()) return;
    try {
      await privateApi.post(`/comments/tasks/${selTask.id}/comment`, { comment: text });
      setText("");
      const res = await privateApi.get(`/comments/tasks/${selTask.id}/comments`);
      setComments(res.data);
    } catch (err) { console.log(err); }
  };

  if (loading) return (
    <div style={s.loader}>
      <div style={s.spinner}></div>
      <p>Loading tasks...</p>
    </div>
  );

  const gridCols = isMobile ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(3,1fr)";

  return (
    <div style={s.page}>
      <h2 style={{ ...s.title, fontSize: isMobile ? 18 : 22 }}>📋 Task Board</h2>

      <div style={{ ...s.board, gridTemplateColumns: gridCols }}>
        {Object.keys(STATUS).map((col) => {
          const cfg = STATUS[col];
          return (
            <div key={col} style={s.column}>
              <div style={{ ...s.colHeader, background: cfg.bg, color: cfg.color }}>
                {cfg.label} ({board[col].length})
              </div>
              <div style={s.taskList}>
                {board[col].length === 0 ? (
                  <p style={s.empty}>No tasks</p>
                ) : (
                  board[col].map((task) => (
                    <div
                      key={task.id}
                      style={s.card}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.05)"; }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <h4 style={s.taskTitle}>{task.title}</h4>
                        <button onClick={() => openComments(task)} style={s.commentBtn}>💬</button>
                      </div>
                      <p style={s.desc}>{task.description || "No description"}</p>
                      <div style={s.meta}>
                        <span>👤 {task.user?.name || "Unknown"}</span>
                        <span>📅 {task.dueDate ? task.dueDate.slice(0, 10) : "No date"}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {open && (
        <div style={{ ...s.modalBg, ...(isMobile && { padding: 0, alignItems: "flex-end" }) }}>
          <div style={{ ...s.modal, ...(isMobile && { maxWidth: "100%", width: "100%", height: "100%", borderRadius: 0 }) }}>
            <div style={s.modalHeader}>
              <h3 style={{ ...s.modalTitle, fontSize: isMobile ? 13 : 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: isMobile ? "75vw" : 380 }}>
                💬 Comments — {selTask?.title}
              </h3>
              <button onClick={() => setOpen(false)} style={s.closeBtn}>✕</button>
            </div>

            <div style={s.chatBox}>
              {comments.length === 0 && <p style={{ color: "#aaa", fontSize: 12, textAlign: "center", marginTop: 20 }}>No comments yet.</p>}
              {comments.map((c) => (
                <div key={c.id} style={s.msg}>
                  <div style={s.msgHeader}>
                    <span style={s.sender}>{c.user?.name || "Unknown"}</span>
                    <span style={s.time}>{new Date(c.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <div style={s.msgText}>{c.comment}</div>
                </div>
              ))}
            </div>

            <div style={s.inputBox}>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendComment()}
                placeholder="Write a comment..."
                style={s.input}
              />
              <button onClick={sendComment} style={s.sendBtn}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { padding: 16, background: "#f9fafb", minHeight: "100vh", fontFamily: "sans-serif", boxSizing: "border-box" },
  title: { fontWeight: 600, marginBottom: 20, textAlign: "center" },
  board: { display: "grid", gap: 16 },
  column: { background: "#fff", borderRadius: 14, padding: 12, boxShadow: "0 6px 18px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", minHeight: 200 },
  colHeader: { fontSize: 13, fontWeight: 700, padding: "8px 12px", borderRadius: 10, marginBottom: 10, textAlign: "center" },
  taskList: { display: "flex", flexDirection: "column", gap: 10, maxHeight: "60vh", overflowY: "auto" },
  card: { background: "#fff", border: "1px solid #eee", borderRadius: 10, padding: 12, cursor: "pointer", transition: "all 0.2s ease", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" },
  taskTitle: { fontSize: 14, fontWeight: 600, margin: 0 },
  commentBtn: { background: "transparent", border: "none", cursor: "pointer", fontSize: 16, flexShrink: 0, marginLeft: 8 },
  desc: { fontSize: 12, color: "#555", marginTop: 6, marginBottom: 8 },
  meta: { fontSize: 11, color: "#777", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 4 },
  empty: { fontSize: 12, color: "#aaa", textAlign: "center", marginTop: 20 },
  loader: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 10 },
  spinner: { width: 22, height: 22, borderRadius: "50%", border: "3px solid #ddd", borderTopColor: "#111", animation: "spin 0.8s linear infinite" },
  modalBg: { position: "fixed", inset: 0, background: "rgba(15,14,13,0.35)", backdropFilter: "blur(6px)", display: "flex", justifyContent: "center", alignItems: "center", padding: 20, zIndex: 1000, boxSizing: "border-box" },
  modal: { width: "100%", maxWidth: 520, height: 600, background: "#faf8f4", borderRadius: 18, border: "1px solid #dedad2", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", overflow: "hidden", boxSizing: "border-box" },
  modalHeader: { padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #dedad2", background: "#f2efe9", flexShrink: 0 },
  modalTitle: { margin: 0, fontWeight: 600, color: "#3a3835" },
  closeBtn: { border: "none", background: "transparent", fontSize: 18, cursor: "pointer", color: "#7a776f", flexShrink: 0 },
  chatBox: { flex: 1, padding: 16, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, background: "#faf8f4", boxSizing: "border-box" },
  msg: { background: "#f0ede8", padding: 10, borderRadius: 10 },
  msgHeader: { display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4, color: "#7a776f" },
  sender: { fontWeight: 600, color: "#3a3835" },
  time: { fontSize: 10 },
  msgText: { fontSize: 13, color: "#3a3835" },
  inputBox: { display: "flex", gap: 8, padding: 12, borderTop: "1px solid #dedad2", background: "#f2efe9", boxSizing: "border-box", flexShrink: 0 },
  input: { flex: 1, padding: "10px 12px", borderRadius: 10, border: "1px solid #dedad2", outline: "none", background: "#fff", fontSize: 13, boxSizing: "border-box", minWidth: 0 },
  sendBtn: { padding: "10px 14px", borderRadius: 10, border: "none", background: "#c8873a", color: "#fff", cursor: "pointer", fontWeight: 500, whiteSpace: "nowrap", flexShrink: 0 },
};
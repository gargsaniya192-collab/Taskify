import { useEffect, useState } from "react";
import privateApi from "../services/privateApi";
import { useParams } from "react-router-dom";

const STATUS = {
  todo: { label: "To Do", color: "#6B7280", bg: "#F3F4F6" },
  "in-progress": { label: "In Progress", color: "#2563EB", bg: "#DBEAFE" },
  done: { label: "Done", color: "#16A34A", bg: "#DCFCE7" },
};

export default function TaskBoard() {
  //for comments
  const [open, setOpen] = useState(false);
  const [selTask, setSelTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const { projectId } = useParams();

  const [board, setBoard] = useState({
    todo: [],
    "in-progress": [],
    done: [],
  });

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

  if (loading) {
    return (
      <div style={styles.loader}>
        <div style={styles.spinner}></div>
        <p>Loading tasks...</p>
      </div>
    );
  }
  //for seeing the comments
  const openComments = async (task) => {
    setSelTask(task);
    setOpen(true);

    try {
      const res = await privateApi.get(`/comments/tasks/${task.id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  //for able to send the comments
  const sendComment = async () => {
    if (!text.trim()) return;

    try {
      await privateApi.post(`/comments/tasks/${selTask.id}/comment`, { comment: text });

      setText("");

      const res = await privateApi.get(`/comments/tasks/${selTask.id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>📋 Task Board</h2>

      <div style={styles.board}>
        {Object.keys(STATUS).map((col) => {
          const config = STATUS[col];

          return (
            <div key={col} style={styles.column}>
              {/* Column Header */}
              <div
                style={{
                  ...styles.columnHeader,
                  background: config.bg,
                  color: config.color,
                }}
              >
                {config.label} ({board[col].length})
              </div>

              {/* Tasks */}
              <div style={styles.taskList}>
                {board[col].length === 0 ? (
                  <p style={styles.empty}>No tasks</p>
                ) : (
                  board[col].map((task) => (
                    <div
                      key={task.id}
                      style={styles.card}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow =
                          "0 10px 20px rgba(0,0,0,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 10px rgba(0,0,0,0.05)";
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <h4 style={styles.taskTitle}>{task.title}</h4>

                        <button
                          onClick={() => openComments(task)}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "16px",
                          }}
                        >
                          💬
                        </button>
                      </div>
                      <p style={styles.desc}>
                        {task.description || "No description"}
                      </p>

                      <div style={styles.meta}>
                        <span>👤 {task.user?.name || "Unknown"}</span>
                        <span>
                          📅{" "}
                          {task.dueDate ? task.dueDate.slice(0, 10) : "No date"}
                        </span>
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
        <div style={styles.modalBg}>
          <div style={styles.modal}>
            {/* ===== HEADER ===== */}
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>💬 Comments - {selTask?.title}</h3>

              <button onClick={() => setOpen(false)} style={styles.closeBtn}>
                ✕
              </button>
            </div>

            {/* ===== CHAT BOX ===== */}
            <div style={styles.chatBox}>
              {comments.map((c) => (
                <div key={c.id} style={styles.msg}>
                  {/* sender + time */}
                  <div style={styles.msgHeader}>
                    <span style={styles.sender}>
                      {c.user?.name || "Unknown"}
                    </span>

                    <span style={styles.time}>
                      {new Date(c.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* message */}
                  <div style={styles.msgText}>{c.comment}</div>
                </div>
              ))}
            </div>

            {/* ===== INPUT BOX ===== */}
            <div style={styles.inputBox}>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a comment..."
                style={styles.input}
              />

              <button onClick={sendComment} style={styles.sendBtn}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: "16px",
    background: "#f9fafb",
    minHeight: "100vh",
    fontFamily: "sans-serif",
  },

  title: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 20,
    textAlign: "center",
  },

  board: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 16,
  },

  column: {
    background: "#fff",
    borderRadius: 14,
    padding: 12,
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    minHeight: 400,
  },

  columnHeader: {
    fontSize: 13,
    fontWeight: 700,
    padding: "8px 12px",
    borderRadius: 10,
    marginBottom: 10,
    textAlign: "center",
  },

  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    maxHeight: "65vh",
    overflowY: "auto",
  },

  card: {
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 10,
    padding: 12,
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },

  taskTitle: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 6,
  },

  desc: {
    fontSize: 12,
    color: "#555",
    marginBottom: 8,
  },

  meta: {
    fontSize: 11,
    color: "#777",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 4,
  },

  empty: {
    fontSize: 12,
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },

  loader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "60vh",
    gap: 10,
  },

  spinner: {
    width: 22,
    height: 22,
    borderRadius: "50%",
    border: "3px solid #ddd",
    borderTopColor: "#111",
    animation: "spin 0.8s linear infinite",
  },
  // ===== NEW STYLES =====

  modalBg: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 14, 13, 0.35)",
    backdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modal: {
  width: "100%",
  maxWidth: 520,
  height: 600,
  background: "#faf8f4",
  borderRadius: 18,
  border: "1px solid #dedad2",
  boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  boxSizing: "border-box",
},
  chatBox: {
  flex: 1,
  padding: 16,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: 10,
  background: "#faf8f4",
  boxSizing: "border-box",
},

  inputBox: {
  display: "flex",
  gap: 10,
  padding: 12,
  borderTop: "1px solid #dedad2",
  background: "#f2efe9",
  boxSizing: "border-box",
  width: "100%",
},
  input: {
  flex: 1,
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #dedad2",
  outline: "none",
  background: "#fff",
  fontSize: 13,
  boxSizing: "border-box",
},
  msg: {
    background: "#f9fafb",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  modalHeader: {
  padding: "12px 16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #dedad2",
  background: "#f2efe9",
},

modalTitle: {
  margin: 0,
  fontSize: 15,
  fontWeight: 600,
  color: "#3a3835",
},

closeBtn: {
  border: "none",
  background: "transparent",
  fontSize: 18,
  cursor: "pointer",
  color: "#7a776f",
},

msgHeader: {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 11,
  marginBottom: 4,
  color: "#7a776f",
},

sender: {
  fontWeight: 600,
  color: "#3a3835",
},

time: {
  fontSize: 10,
},

msgText: {
  fontSize: 13,
  color: "#3a3835",
},
sendBtn: {
  padding: "10px 14px",
  borderRadius: 10,
  border: "none",
  background: "#c8873a",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 500,
  whiteSpace: "nowrap",
},
};

import { useEffect, useState } from "react";
import privateApi from "../services/privateApi";
import { useParams } from "react-router-dom";

function CreateTask() {
  const { projectId } = useParams();

  const [members, setMembers] = useState([]);
  const [f, setF] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // fetch project members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await privateApi.get(
          `/project-members/${projectId}/members`
        );
        setMembers(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (projectId) fetchMembers();
  }, [projectId]);

  const h = (e) => {
    setF({ ...f, [e.target.name]: e.target.value });
  };

  const createTask = async () => {
    if (!f.title || !f.assignedTo) {
      return setMsg("Title and Assignee are required");
    }

    try {
      setLoading(true);
      setMsg("");

      await privateApi.post("/tasks/create-many", {
        tasks: [
          {
            title: f.title,
            description: f.description,
            projectId,
            assignedTo: f.assignedTo,
            dueDate: f.dueDate || null,
          },
        ],
      });

      setMsg("Task created successfully ✅");

      setF({
        title: "",
        description: "",
        assignedTo: "",
        dueDate: "",
      });
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Task</h2>

        <div style={styles.info}>
          Project ID: <b>{projectId}</b>
        </div>

        {/* Title */}
        <input
          style={styles.input}
          name="title"
          placeholder="Task Title"
          value={f.title}
          onChange={h}
        />

        {/* Description */}
        <textarea
          style={styles.textarea}
          name="description"
          placeholder="Task Description"
          value={f.description}
          onChange={h}
        />

        {/* Assign Member */}
        <select
          style={styles.input}
          name="assignedTo"
          value={f.assignedTo}
          onChange={h}
        >
          <option value="">Assign to member</option>

          {members.map((m) => (
            <option key={m.id} value={m.userId}>
              {m.User?.name} ({m.role})
            </option>
          ))}
        </select>

        {/* Due Date */}
        <input
          type="date"
          style={styles.input}
          name="dueDate"
          value={f.dueDate}
          onChange={h}
        />

        {/* Button */}
        <button
          onClick={createTask}
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Creating..." : "Create Task"}
        </button>

        {/* Message */}
        {msg && <p style={styles.msg}>{msg}</p>}
      </div>
    </div>
  );
}

export default CreateTask;

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: "40px 0",
    display: "flex",
    justifyContent: "center",
    background: "#fafafa",
    minHeight: "100vh",
    fontFamily: "sans-serif",
  },

  card: {
    width: 420,
    background: "#fff",
    padding: 24,
    borderRadius: 14,
    border: "1px solid #eee",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  },

  title: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 18,
  },

  info: {
    fontSize: 13,
    background: "#f4f4f4",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },

  input: {
    width: "100%",
    padding: "10px 12px",
    marginBottom: 10,
    borderRadius: 10,
    border: "1px solid #ddd",
    fontSize: 13,
  },

  textarea: {
    width: "100%",
    padding: "10px 12px",
    marginBottom: 10,
    borderRadius: 10,
    border: "1px solid #ddd",
    fontSize: 13,
    minHeight: 80,
  },

  button: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    border: "none",
    background: "#111",
    color: "#fff",
    fontSize: 14,
    marginTop: 8,
    cursor: "pointer",
  },

  msg: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 13,
  },
};
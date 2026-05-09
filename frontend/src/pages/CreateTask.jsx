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

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await privateApi.get(`/project-members/${projectId}/members`);
        setMembers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (projectId) fetchMembers();
  }, [projectId]);

  const h = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const createTask = async () => {
    if (!f.title || !f.assignedTo) return setMsg("Title and Assignee are required");
    try {
      setLoading(true);
      setMsg("");
      await privateApi.post("/tasks/create-many", {
        tasks: [{
          title: f.title,
          description: f.description,
          projectId,
          assignedTo: f.assignedTo,
          dueDate: f.dueDate || null,
        }],
      });
      setMsg("Task created successfully ✅");
      setF({ title: "", description: "", assignedTo: "", dueDate: "" });
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .ct-page {
          min-height: 100vh;
          background: #fafafa;
          font-family: sans-serif;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 40px 16px;
          box-sizing: border-box;
        }
        .ct-card {
          width: 100%;
          max-width: 420px;
          background: #fff;
          padding: 24px;
          border-radius: 14px;
          border: 1px solid #eee;
          box-shadow: 0 6px 18px rgba(0,0,0,0.06);
          box-sizing: border-box;
        }
        .ct-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 18px;
        }
        .ct-info {
          font-size: 13px;
          background: #f4f4f4;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 12px;
        }
        .ct-input, .ct-select {
          width: 100%;
          padding: 10px 12px;
          margin-bottom: 10px;
          border-radius: 10px;
          border: 1px solid #ddd;
          font-size: 13px;
          box-sizing: border-box;
          background: #fff;
        }
        .ct-textarea {
          width: 100%;
          padding: 10px 12px;
          margin-bottom: 10px;
          border-radius: 10px;
          border: 1px solid #ddd;
          font-size: 13px;
          min-height: 80px;
          box-sizing: border-box;
          resize: vertical;
        }
        .ct-btn {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: none;
          background: #111;
          color: #fff;
          font-size: 14px;
          margin-top: 8px;
          cursor: pointer;
        }
        .ct-btn:disabled { opacity: 0.7; }
        .ct-msg {
          margin-top: 12px;
          text-align: center;
          font-size: 13px;
        }

        @media (max-width: 480px) {
          .ct-page {
            padding: 20px 12px;
          }
          .ct-card {
            padding: 16px;
            border-radius: 12px;
          }
          .ct-title {
            font-size: 18px;
          }
          .ct-btn {
            padding: 10px;
            font-size: 13px;
          }
        }
      `}</style>

      <div className="ct-page">
        <div className="ct-card">
          <h2 className="ct-title">Create Task</h2>

          <div className="ct-info">
            Project ID: <b>{projectId}</b>
          </div>

          <input
            className="ct-input"
            name="title"
            placeholder="Task Title"
            value={f.title}
            onChange={h}
          />

          <textarea
            className="ct-textarea"
            name="description"
            placeholder="Task Description"
            value={f.description}
            onChange={h}
          />

          <select
            className="ct-select"
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

          <input
            type="date"
            className="ct-input"
            name="dueDate"
            value={f.dueDate}
            onChange={h}
          />

          <button
            onClick={createTask}
            disabled={loading}
            className="ct-btn"
          >
            {loading ? "Creating..." : "Create Task"}
          </button>

          {msg && <p className="ct-msg">{msg}</p>}
        </div>
      </div>
    </>
  );
}

export default CreateTask;
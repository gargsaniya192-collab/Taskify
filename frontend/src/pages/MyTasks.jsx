import { useEffect, useState } from "react";
import privateApi from "../services/privateApi";

const STATUS = {
  todo: { label: "To Do", color: "#6B7280", bg: "#F3F4F6" },
  "in-progress": { label: "In Progress", color: "#2563EB", bg: "#DBEAFE" },
  done: { label: "Done", color: "#16A34A", bg: "#DCFCE7" },
};

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await privateApi.get("/tasks/my-tasks");
      setTasks(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleStatusRequest = async (taskId, status) => {
    try {
      await privateApi.patch(`/tasks/${taskId}/request-status`, { status });
      alert("Status request sent successfully");
      fetchTasks();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="mt-loader">
        <h3>Loading your tasks...</h3>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .mt-page {
          padding: 24px 16px;
          background: #f9fafb;
          min-height: 100vh;
          box-sizing: border-box;
        }
        .mt-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .mt-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
        .mt-card {
          background: #fff;
          border-radius: 14px;
          padding: 18px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          border: 1px solid #eee;
          box-sizing: border-box;
        }
        .mt-task-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .mt-desc {
          color: #555;
          font-size: 14px;
          margin-bottom: 14px;
        }
        .mt-meta {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #777;
          margin-bottom: 14px;
          flex-wrap: wrap;
          gap: 6px;
        }
        .mt-status {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 12px;
        }
        .mt-pending {
          color: #d97706;
          font-weight: 600;
          margin-bottom: 12px;
        }
        .mt-btn-box {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .mt-btn {
          border: none;
          background: #111827;
          color: #fff;
          border-radius: 8px;
          padding: 8px 14px;
          cursor: pointer;
          font-size: 13px;
        }
        .mt-empty {
          text-align: center;
          margin-top: 60px;
          color: #888;
        }
        .mt-loader {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 60vh;
        }

        @media (max-width: 600px) {
          .mt-grid {
            grid-template-columns: 1fr;
          }
          .mt-title {
            font-size: 20px;
          }
        }

        @media (max-width: 400px) {
          .mt-page {
            padding: 16px 12px;
          }
          .mt-card {
            padding: 14px;
            border-radius: 10px;
          }
          .mt-task-title {
            font-size: 16px;
          }
          .mt-btn {
            padding: 7px 10px;
            font-size: 12px;
          }
        }
      `}</style>

      <div className="mt-page">
        <h2 className="mt-title">📝 Your Tasks</h2>

        {tasks.length === 0 ? (
          <div className="mt-empty">No tasks assigned</div>
        ) : (
          <div className="mt-grid">
            {tasks.map((task) => (
              <div key={task.id} className="mt-card">
                <h3 className="mt-task-title">{task.title}</h3>
                <p className="mt-desc">{task.description || "No description"}</p>

                <div className="mt-meta">
                  <span>👤 {task.user?.name || "Unknown"}</span>
                  <span>📅 {task.dueDate ? task.dueDate.slice(0, 10) : "No due date"}</span>
                </div>

                <div
                  className="mt-status"
                  style={{
                    background: STATUS[task.status]?.bg,
                    color: STATUS[task.status]?.color,
                  }}
                >
                  {STATUS[task.status]?.label}
                </div>

                {task.requestStatus === "pending" && (
                  <div className="mt-pending">⏳ Request Pending</div>
                )}

                {task.requestStatus !== "pending" && (
                  <div className="mt-btn-box">
                    {task.status !== "todo" && (
                      <button className="mt-btn" onClick={() => handleStatusRequest(task.id, "todo")}>
                        Todo
                      </button>
                    )}
                    {task.status !== "in-progress" && (
                      <button className="mt-btn" onClick={() => handleStatusRequest(task.id, "in-progress")}>
                        In Progress
                      </button>
                    )}
                    {task.status !== "done" && (
                      <button className="mt-btn" onClick={() => handleStatusRequest(task.id, "done")}>
                        Done
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
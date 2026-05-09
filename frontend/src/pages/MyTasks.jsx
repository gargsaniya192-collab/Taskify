
import { useEffect, useState } from "react";
import privateApi from "../services/privateApi";

const STATUS = {
  todo: {
    label: "To Do",
    color: "#6B7280",
    bg: "#F3F4F6",
  },

  "in-progress": {
    label: "In Progress",
    color: "#2563EB",
    bg: "#DBEAFE",
  },

  done: {
    label: "Done",
    color: "#16A34A",
    bg: "#DCFCE7",
  },
};

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch only logged in user's tasks
  const fetchTasks = async () => {
    try {

      const res = await privateApi.get(
        "/tasks/my-tasks"
      );

      setTasks(res.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Request status change
  const handleStatusRequest = async (
    taskId,
    status
  ) => {
    try {

      await privateApi.patch(
        `/tasks/${taskId}/request-status`,
        { status }
      );

      alert(
        "Status request sent successfully"
      );

      fetchTasks();

    } catch (error) {

      alert(
        error?.response?.data?.message ||
        "Failed to update status"
      );

    }
  };

  if (loading) {
    return (
      <div style={styles.loader}>
        <h3>Loading your tasks...</h3>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>
        📝 Your Tasks
      </h2>

      {tasks.length === 0 ? (
        <div style={styles.empty}>
          No tasks assigned
        </div>
      ) : (
        <div style={styles.grid}>
          {tasks.map((task) => (
            <div
              key={task.id}
              style={styles.card}
            >
              <h3 style={styles.taskTitle}>
                {task.title}
              </h3>

              <p style={styles.desc}>
                {task.description ||
                  "No description"}
              </p>

              <div style={styles.meta}>
                <span>
                  👤{" "}
                  {task.user?.name ||
                    "Unknown"}
                </span>

                <span>
                  📅{" "}
                  {task.dueDate
                    ? task.dueDate.slice(0, 10)
                    : "No due date"}
                </span>
              </div>

              {/* Current Status */}
              <div
                style={{
                  ...styles.status,
                  background:
                    STATUS[task.status]
                      ?.bg,
                  color:
                    STATUS[task.status]
                      ?.color,
                }}
              >
                {
                  STATUS[task.status]
                    ?.label
                }
              </div>

              {/* Pending Request */}
              {task.requestStatus ===
                "pending" && (
                <div style={styles.pending}>
                  ⏳ Request Pending
                </div>
              )}

              {/* Status Buttons */}
              {task.requestStatus !==
                "pending" && (
                <div style={styles.btnBox}>
                  {task.status !==
                    "todo" && (
                    <button
                      style={styles.btn}
                      onClick={() =>
                        handleStatusRequest(
                          task.id,
                          "todo"
                        )
                      }
                    >
                      Todo
                    </button>
                  )}

                  {task.status !==
                    "in-progress" && (
                    <button
                      style={styles.btn}
                      onClick={() =>
                        handleStatusRequest(
                          task.id,
                          "in-progress"
                        )
                      }
                    >
                      In Progress
                    </button>
                  )}

                  {task.status !==
                    "done" && (
                    <button
                      style={styles.btn}
                      onClick={() =>
                        handleStatusRequest(
                          task.id,
                          "done"
                        )
                      }
                    >
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
  );
}

const styles = {
  page: {
    padding: 24,
    background: "#f9fafb",
    minHeight: "100vh",
  },

  title: {
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 20,
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px,1fr))",
    gap: 20,
  },

  card: {
    background: "#fff",
    borderRadius: 14,
    padding: 18,
    boxShadow:
      "0 4px 12px rgba(0,0,0,0.06)",
    border: "1px solid #eee",
  },

  taskTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 8,
  },

  desc: {
    color: "#555",
    fontSize: 14,
    marginBottom: 14,
  },

  meta: {
    display: "flex",
    justifyContent:
      "space-between",
    fontSize: 13,
    color: "#777",
    marginBottom: 14,
  },

  status: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 12,
  },

  pending: {
    color: "#d97706",
    fontWeight: 600,
    marginBottom: 12,
  },

  btnBox: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },

  btn: {
    border: "none",
    background: "#111827",
    color: "#fff",
    borderRadius: 8,
    padding: "8px 14px",
    cursor: "pointer",
    fontSize: 13,
  },

  empty: {
    textAlign: "center",
    marginTop: 60,
    color: "#888",
  },

  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "60vh",
  },
};
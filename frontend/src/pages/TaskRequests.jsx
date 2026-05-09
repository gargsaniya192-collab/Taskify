import { useEffect, useState } from "react";
import privateApi from "../services/privateApi";

export default function TaskRequests() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch pending requests
  const fetchRequests = async () => {
    try {
      const res = await privateApi.get(
        "/tasks/pending-requests"
      );
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 2. Approve request
  const handleApprove = async (id) => {
    try {
      await privateApi.patch(
        `/tasks/${id}/approve-status`
      );

      fetchRequests(); // refresh UI
    } catch (err) {
      alert("Failed to approve");
    }
  };

  // 3. Reject request
  const handleReject = async (id) => {
    try {
      await privateApi.patch(
        `/tasks/${id}/reject-status`
      );

      fetchRequests(); // refresh UI
    } catch (err) {
      alert("Failed to reject");
    }
  };

  if (loading) {
    return <h3>Loading requests...</h3>;
  }

  return (
    <div style={styles.page}>
      <h2>📌 Pending Task Requests</h2>

      {tasks.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id} style={styles.card}>
            <h3>{task.title}</h3>

            <p>
              Current: <b>{task.status}</b>
            </p>

            <p>
              Requested: <b>{task.statusRequest}</b>
            </p>

            <div style={styles.btnBox}>
              <button
                style={styles.approve}
                onClick={() => handleApprove(task.id)}
              >
                Approve
              </button>

              <button
                style={styles.reject}
                onClick={() => handleReject(task.id)}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: 20,
  },

  card: {
    border: "1px solid #ddd",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },

  btnBox: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },

  approve: {
    background: "green",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
  },

  reject: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
  },
};
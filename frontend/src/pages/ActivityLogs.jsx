import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import privateApi from "../services/privateApi";

export default function ActivityLogs() {

  const { projectId } = useParams();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch activity logs
  const fetchLogs = async () => {

    try {

      const res =
        await privateApi.get(
          `/activity/project/${projectId}`
        );

      setLogs(res.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchLogs();
  }, [projectId]);

  if (loading) {
    return (
      <div style={styles.loader}>
        <h2>Loading Activity Logs...</h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      <h2 style={styles.heading}>
        📜 Activity Timeline
      </h2>

      {logs.length === 0 ? (

        <div style={styles.empty}>
          No activity found
        </div>

      ) : (

        <div style={styles.timeline}>

          {logs.map((log) => (

            <div
              key={log.id}
              style={styles.card}
            >

              {/* Action */}
              <div style={styles.action}>
                {log.action}
              </div>

              {/* Details */}
              <div style={styles.details}>
                {log.details}
              </div>

              {/* Time */}
              <div style={styles.time}>
                {new Date(
                  log.createdAt
                ).toLocaleString()}
              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

const styles = {

  page: {
    padding: "24px",
    minHeight: "100vh",
    background: "#f9fafb",
  },

  heading: {
    fontSize: "26px",
    fontWeight: "600",
    marginBottom: "24px",
  },

  timeline: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderLeft: "5px solid #111827",
    borderRadius: "12px",
    padding: "18px",
  },

  action: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#2563EB",
    marginBottom: "8px",
  },

  details: {
    fontSize: "15px",
    color: "#111827",
    marginBottom: "10px",
  },

  time: {
    fontSize: "12px",
    color: "#6b7280",
  },

  empty: {
    textAlign: "center",
    marginTop: "80px",
    color: "#888",
  },

  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "60vh",
  },

};
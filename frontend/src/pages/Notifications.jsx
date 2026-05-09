import { useEffect, useState } from "react";
import privateApi from "../services/privateApi";

export default function Notifications() {

  const [
    notifications,
    setNotifications
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {

      const res =
        await privateApi.get(
          "/notifications"
        );

      setNotifications(res.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Mark notification as read
  const markAsRead = async (id) => {
    try {

      await privateApi.patch(
        `/notifications/${id}/read`
      );

      // Refresh notifications
      fetchNotifications();

    } catch (error) {

      console.log(error);

    }
  };

  if (loading) {
    return (
      <div style={styles.loader}>
        <h2>Loading Notifications...</h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>
        🔔 Notifications
      </h2>

      {notifications.length === 0 ? (
        <div style={styles.empty}>
          No notifications yet
        </div>
      ) : (
        <div style={styles.list}>
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (!n.isRead) {
                  markAsRead(n.id);
                }
              }}
              style={{
                ...styles.card,

                background:
                  n.isRead
                    ? "#fff"
                    : "#eef4ff",

                border:
                  n.isRead
                    ? "1px solid #eee"
                    : "1px solid #2563EB",
              }}
            >
              <div style={styles.message}>
                {n.message}
              </div>

              <div style={styles.footer}>
                <span>
                  {new Date(
                    n.createdAt
                  ).toLocaleString()}
                </span>

                {!n.isRead && (
                  <span style={styles.badge}>
                    New
                  </span>
                )}
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
    padding: 24,
    minHeight: "100vh",
    background: "#f9fafb",
  },

  heading: {
    fontSize: 26,
    fontWeight: 600,
    marginBottom: 24,
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  card: {
    padding: 18,
    borderRadius: 12,
    cursor: "pointer",
    transition: "0.2s ease",
  },

  message: {
    fontSize: 15,
    fontWeight: 500,
    marginBottom: 10,
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
    color: "#666",
  },

  badge: {
    background: "#2563EB",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: 8,
    fontSize: 11,
  },

  empty: {
    textAlign: "center",
    color: "#777",
    marginTop: 80,
  },

  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "60vh",
  },
};
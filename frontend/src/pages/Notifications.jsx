import { useEffect, useState } from "react";
import privateApi from "../services/privateApi";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await privateApi.get("/notifications");
      setNotifications(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAsRead = async (id) => {
    try {
      await privateApi.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="nf-loader">
        <h2>Loading Notifications...</h2>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .nf-page {
          padding: 24px 16px;
          min-height: 100vh;
          background: #f9fafb;
          box-sizing: border-box;
        }
        .nf-heading {
          font-size: 26px;
          font-weight: 600;
          margin-bottom: 24px;
        }
        .nf-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 700px;
        }
        .nf-card {
          padding: 18px;
          border-radius: 12px;
          cursor: pointer;
          transition: 0.2s ease;
          box-sizing: border-box;
        }
        .nf-message {
          font-size: 15px;
          font-weight: 500;
          margin-bottom: 10px;
        }
        .nf-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #666;
          flex-wrap: wrap;
          gap: 6px;
        }
        .nf-badge {
          background: #2563EB;
          color: #fff;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 11px;
          white-space: nowrap;
        }
        .nf-empty {
          text-align: center;
          color: #777;
          margin-top: 80px;
        }
        .nf-loader {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 60vh;
        }

        @media (max-width: 600px) {
          .nf-heading {
            font-size: 22px;
          }
          .nf-card {
            padding: 14px;
            border-radius: 10px;
          }
          .nf-message {
            font-size: 14px;
          }
        }

        @media (max-width: 400px) {
          .nf-page {
            padding: 16px 12px;
          }
          .nf-heading {
            font-size: 20px;
          }
        }
      `}</style>

      <div className="nf-page">
        <h2 className="nf-heading">🔔 Notifications</h2>

        {notifications.length === 0 ? (
          <div className="nf-empty">No notifications yet</div>
        ) : (
          <div className="nf-list">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="nf-card"
                onClick={() => { if (!n.isRead) markAsRead(n.id); }}
                style={{
                  background: n.isRead ? "#fff" : "#eef4ff",
                  border: n.isRead ? "1px solid #eee" : "1px solid #2563EB",
                }}
              >
                <div className="nf-message">{n.message}</div>
                <div className="nf-footer">
                  <span>{new Date(n.createdAt).toLocaleString()}</span>
                  {!n.isRead && <span className="nf-badge">New</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
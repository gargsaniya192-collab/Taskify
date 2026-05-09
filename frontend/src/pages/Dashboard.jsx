import { useEffect, useState } from "react";
import privateApi from "../services/privateApi";

const ROLE = {
  admin: { bg: "#FEE2E2", color: "#991B1B" },
  manager: { bg: "#DBEAFE", color: "#1E40AF" },
  member: { bg: "#DCFCE7", color: "#166534" },
};

const STATUS = {
  pending: { bg: "#FEF3C7", color: "#92400E" },
  approved: { bg: "#DCFCE7", color: "#166534" },
};

function UserCard({ u, onAssign }) {
  return (
    <div
      className="db-card"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.06)";
      }}
    >
      <div className="db-top">
        <div>
          <h3 className="db-name">{u.name}</h3>
          <p className="db-meta">ID: {u.id}</p>
        </div>
        <span
          className="db-status"
          style={{
            background: STATUS[u.status]?.bg,
            color: STATUS[u.status]?.color,
          }}
        >
          {u.status}
        </span>
      </div>

      <div className="db-row">
        <span className="db-label">Role</span>
        <span
          className="db-role"
          style={{
            background: ROLE[u.role || "member"]?.bg,
            color: ROLE[u.role || "member"]?.color,
          }}
        >
          {u.role || "member"}
        </span>
      </div>

      <div className="db-actions">
        <button className="db-btn-manager" onClick={() => onAssign(u.id, "manager")}>
          Manager
        </button>
        <button className="db-btn-member" onClick={() => onAssign(u.id, "member")}>
          Member
        </button>
      </div>
    </div>
  );
}

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await privateApi.get("/admin/pending-users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const assignRole = async (id, role) => {
    try {
      await privateApi.patch(`/admin/assign-role/${id}`, { role });
      fetchUsers();
    } catch (err) {
      alert("Failed to assign role");
    }
  };

  return (
    <>
      <style>{`
        .db-page {
          padding: 24px 16px;
          font-family: sans-serif;
          background: #fafafa;
          min-height: 100vh;
          box-sizing: border-box;
        }
        .db-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .db-title {
          font-size: 20px;
          font-weight: 600;
          margin: 0;
        }
        .db-logout {
          padding: 7px 12px;
          border-radius: 8px;
          border: none;
          background: #111;
          color: #fff;
          cursor: pointer;
          font-size: 13px;
        }
        .db-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 14px;
        }
        .db-card {
          background: #fff;
          border-radius: 14px;
          padding: 1rem 1.2rem;
          border: 1px solid #eee;
          box-shadow: 0 6px 18px rgba(0,0,0,0.06);
          transition: all 0.2s ease;
          box-sizing: border-box;
        }
        .db-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
          gap: 8px;
        }
        .db-name {
          font-size: 15px;
          font-weight: 600;
          margin: 0;
        }
        .db-meta {
          font-size: 12px;
          color: #888;
          margin: 0;
        }
        .db-status {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 999px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .db-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          align-items: center;
        }
        .db-label {
          font-size: 12px;
          color: #666;
        }
        .db-role {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 999px;
        }
        .db-actions {
          display: flex;
          gap: 8px;
        }
        .db-btn-manager {
          flex: 1;
          padding: 7px 10px;
          font-size: 12px;
          border-radius: 8px;
          border: none;
          background: #1E40AF;
          color: #fff;
          cursor: pointer;
        }
        .db-btn-member {
          flex: 1;
          padding: 7px 10px;
          font-size: 12px;
          border-radius: 8px;
          border: 1px solid #ddd;
          background: #fff;
          cursor: pointer;
        }
        .db-center {
          text-align: center;
          padding: 3rem;
          color: #666;
        }
        .db-empty {
          text-align: center;
          padding: 3rem;
          color: #777;
        }

        @media (max-width: 600px) {
          .db-grid {
            grid-template-columns: 1fr;
          }
          .db-title {
            font-size: 18px;
          }
        }

        @media (max-width: 400px) {
          .db-page {
            padding: 16px 12px;
          }
          .db-card {
            padding: 12px;
            border-radius: 10px;
          }
          .db-actions {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="db-page">
        <div className="db-header">
          <h2 className="db-title">Admin Dashboard</h2>
          <button
            className="db-logout"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>

        {loading ? (
          <div className="db-center">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="db-empty">No users found</div>
        ) : (
          <div className="db-grid">
            {users.map((u) => (
              <UserCard key={u.id} u={u} onAssign={assignRole} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
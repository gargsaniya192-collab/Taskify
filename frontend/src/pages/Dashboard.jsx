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
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.06)";
      }}
    >
      {/* Top */}
      <div style={styles.top}>
        <div>
          <h3 style={styles.name}>{u.name}</h3>
          <p style={styles.meta}>ID: {u.id}</p>
        </div>

        <span
          style={{
            ...styles.status,
            background: STATUS[u.status]?.bg,
            color: STATUS[u.status]?.color,
          }}
        >
          {u.status}
        </span>
      </div>

      {/* Role */}
      <div style={styles.row}>
        <span style={styles.label}>Role</span>

        <span
          style={{
            ...styles.role,
            background: ROLE[u.role || "member"]?.bg,
            color: ROLE[u.role || "member"]?.color,
          }}
        >
          {u.role || "member"}
        </span>
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <button
          style={styles.btnManager}
          onClick={() => onAssign(u.id, "manager")}
        >
          Manager
        </button>

        <button
          style={styles.btnMember}
          onClick={() => onAssign(u.id, "member")}
        >
          Member
        </button>
      </div>
    </div>
  );
}

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 fetch ALL users (not just pending)
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

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔥 assign role API call
  const assignRole = async (id, role) => {
    try {
      await privateApi.patch(`/admin/assign-role/${id}`, {
        role,
      });

      fetchUsers(); // refresh UI
    } catch (err) {
      alert("Failed to assign role");
    }
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Admin Dashboard</h2>

        <button
          style={styles.logout}
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div style={styles.center}>Loading users...</div>
      ) : users.length === 0 ? (
        <div style={styles.empty}>No users found</div>
      ) : (
        <div style={styles.grid}>
          {users.map((u) => (
            <UserCard key={u.id} u={u} onAssign={assignRole} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: "24px 0",
    fontFamily: "sans-serif",
    background: "#fafafa",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 20,
    fontWeight: 600,
    margin: 0,
  },

  logout: {
    padding: "7px 12px",
    borderRadius: 8,
    border: "none",
    background: "#111",
    color: "#fff",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 14,
  },

  card: {
    background: "#fff",
    borderRadius: 14,
    padding: "1rem 1.2rem",
    border: "1px solid #eee",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
    transition: "all 0.2s ease",
  },

  top: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  name: {
    fontSize: 15,
    fontWeight: 600,
    margin: 0,
  },

  meta: {
    fontSize: 12,
    color: "#888",
    margin: 0,
  },

  status: {
    fontSize: 11,
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: 999,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  label: {
    fontSize: 12,
    color: "#666",
  },

  role: {
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: 999,
  },

  actions: {
    display: "flex",
    gap: 8,
  },

  btnManager: {
    flex: 1,
    padding: "7px 10px",
    fontSize: 12,
    borderRadius: 8,
    border: "none",
    background: "#1E40AF",
    color: "#fff",
    cursor: "pointer",
  },

  btnMember: {
    flex: 1,
    padding: "7px 10px",
    fontSize: 12,
    borderRadius: 8,
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
  },

  center: {
    textAlign: "center",
    padding: "3rem",
    color: "#666",
  },

  empty: {
    textAlign: "center",
    padding: "3rem",
    color: "#777",
  },
};
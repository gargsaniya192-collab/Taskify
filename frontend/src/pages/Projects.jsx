import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const user = JSON.parse(localStorage.getItem("user"));
const STATUS_STYLES = {
  active: { label: "Active", bg: "#DCFCE7", color: "#166534" },
  paused: { label: "Paused", bg: "#FEF3C7", color: "#92400E" },
  done: { label: "Done", bg: "#DBEAFE", color: "#1E40AF" },
};

const AVATAR_COLORS = [
  { bg: "#EDE9FE", color: "#4C1D95" },
  { bg: "#DCFCE7", color: "#14532D" },
  { bg: "#FFE4E6", color: "#881337" },
];

function Avatar({ initials, index }) {
  const { bg, color } = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <div
      style={{
        width: 26,
        height: 26,
        borderRadius: "50%",
        background: bg,
        color,
        fontSize: 11,
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid #fff",
        marginLeft: index === 0 ? 0 : -6,
      }}
    >
      {initials}
    </div>
  );
}

function ProjectCard({ project, onClick }) {
  const navigate = useNavigate();

  const status = STATUS_STYLES[project.status] || STATUS_STYLES.active;
  const members = project.members || [];

  return (
    <div
      style={styles.card}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.06)";
      }}
    >
      <div style={styles.cardTop}>
        <h3 style={styles.cardTitle}>{project.title}</h3>

        <span
          style={{
            ...styles.badge,
            background: status.bg,
            color: status.color,
          }}
        >
          {status.label}
        </span>
      </div>

      <p style={styles.desc}>
        {project.description || "No description provided."}
      </p>

      <div style={styles.cardFooter}>
        <div style={{ display: "flex" }}>
          {members.slice(0, 3).map((m, i) => (
            <Avatar key={i} initials={m} index={i} />
          ))}
        </div>

        {/* BUTTONS */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            style={styles.smallBtn}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Members
          </button>

          <button
            style={styles.smallBtn}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/projects/${project.id}/tasks`);
            }}
          >
            View Tasks
          </button>
          <button
            style={styles.smallBtn}
            onClick={(e) => {
              e.stopPropagation();

              navigate(`/projects/${project.id}/activity`);
            }}
          >
            Activity
          </button>
          <button
            style={styles.smallBtnDark}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/projects/${project.id}/create-task`);
            }}
          >
            + Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:3000/projects/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProjects(res.data.projects);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const visible = projects.filter((p) => {
    return (
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2 style={styles.title}>Projects</h2>
          <span style={styles.countBadge}>
            {visible.length} project{visible.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* SEARCH */}
      <div style={styles.toolbar}>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* CONTENT */}
      {loading ? (
        <div style={styles.center}>
          <div style={styles.spinner} />
          <span style={{ color: "#666", fontSize: 14 }}>
            Loading projects...
          </span>
        </div>
      ) : visible.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: 34, marginBottom: 10 }}>📂</div>
          <p>No projects found</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {visible.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onClick={() => navigate(`/projects/${p.id}/add-members`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

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
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  title: {
    fontSize: 20,
    fontWeight: 600,
    margin: 0,
    color: "#111",
  },

  countBadge: {
    fontSize: 12,
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: 999,
    background: "#111",
    color: "#fff",
  },

  toolbar: {
    display: "flex",
    gap: 8,
    marginBottom: 18,
  },

  searchInput: {
    flex: 1,
    minWidth: 200,
    fontSize: 14,
    padding: "9px 12px",
    borderRadius: 10,
    border: "1px solid #ddd",
    outline: "none",
    background: "#fff",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 14,
  },

  card: {
    background: "#fff",
    borderRadius: 14,
    padding: "1.1rem 1.25rem",
    cursor: "pointer",
    border: "1px solid #eee",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
    transition: "all 0.2s ease",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: 600,
    margin: 0,
    color: "#111",
  },

  badge: {
    fontSize: 11,
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: 999,
  },

  desc: {
    fontSize: 13,
    color: "#555",
    lineHeight: 1.6,
    marginBottom: 14,
  },

  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTop: "1px solid #eee",
  },

  smallBtn: {
    padding: "6px 10px",
    fontSize: 11,
    borderRadius: 8,
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
  },

  smallBtnDark: {
    padding: "6px 10px",
    fontSize: 11,
    borderRadius: 8,
    border: "none",
    background: "#111",
    color: "#fff",
    cursor: "pointer",
  },

  center: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "3rem 0",
    justifyContent: "center",
  },

  spinner: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    border: "2px solid #ddd",
    borderTopColor: "#111",
    animation: "spin 0.75s linear infinite",
  },

  empty: {
    padding: "3rem 0",
    textAlign: "center",
    color: "#777",
    fontSize: 14,
  },
};

import { useNavigate, useLocation } from "react-router-dom";

const token = {
  ink: "#0f0e0d",
  ink2: "#3a3835",
  ink3: "#7a776f",
  paper: "#faf8f4",
  paper2: "#f2efe9",
  rule: "#dedad2",
  amber: "#c8873a",
  serif: "'Instrument Serif', serif",
  geist: "'Geist', sans-serif",
};

function Sidebar({ onClose }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Create Project", path: "/create-project" },
    { name: "Projects", path: "/projects" },
    { name: "Your Tasks", path: "/my-tasks" },
    ...(role === "manager" || role === "admin"
      ? [{ name: "Task Requests", path: "/task-requests" }]
      : []),
  ];

  const handleNav = (path) => {
    navigate(path);
    if (onClose) onClose(); // close sidebar on mobile after tap
  };

  return (
    <div style={s.sidebar}>
      {/* TOP */}
      <div>
        {/* BRAND */}
        <div style={s.brand}>
          <div style={s.brandBox}>
            <BrandMark />
          </div>
          <span style={s.brandText}>TaskFlow</span>

          {/* Close button — only visible on mobile via onClose prop */}
          {onClose && (
            <button onClick={onClose} style={s.closeBtn}>✕</button>
          )}
        </div>

        {/* MENU */}
        <div style={s.menu}>
          {menu.map((item, i) => {
            const active = location.pathname === item.path;
            return (
              <div
                key={i}
                onClick={() => handleNav(item.path)}
                style={{ ...s.item, ...(active ? s.activeItem : {}) }}
              >
                <span style={s.dot(active)} />
                {item.name}
              </div>
            );
          })}
        </div>
      </div>

      {/* LOGOUT */}
      <button
        style={s.logout}
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
      >
        Logout
      </button>
    </div>
  );
}

const BrandMark = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="#c8873a" strokeWidth="1.75">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 14l2 2 4-4" />
  </svg>
);

const s = {
  sidebar: {
    width: "260px",
    boxSizing: "border-box",
    height: "100vh",
    background: token.paper,
    borderRight: `1px solid ${token.rule}`,
    padding: "30px 22px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    fontFamily: token.geist,
    overflowY: "auto",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: "30px",
  },

  brandBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    border: `1px solid ${token.rule}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
    flexShrink: 0,
  },

  brandText: {
    fontFamily: token.serif,
    fontSize: 20,
    color: token.ink,
    flex: 1,
  },

  closeBtn: {
    background: "transparent",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
    color: token.ink3,
    marginLeft: "auto",
    flexShrink: 0,
  },

  menu: {
    marginTop: "10px",
  },

  item: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 14px",
    borderRadius: 12,
    cursor: "pointer",
    marginBottom: "6px",
    color: token.ink2,
    fontSize: "14px",
    transition: "all 0.2s ease",
  },

  activeItem: {
    background: "#fff",
    border: `1px solid ${token.rule}`,
    color: token.ink,
    fontWeight: 500,
  },

  dot: (active) => ({
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: active ? token.ink : token.rule,
    flexShrink: 0,
  }),

  logout: {
    padding: "12px",
    borderRadius: "12px",
    background: "transparent",
    border: `1px solid ${token.rule}`,
    color: token.ink2,
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default Sidebar;
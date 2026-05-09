import { useState } from "react";
import { useNavigate } from "react-router-dom";
import privateApi from "../services/privateApi";

/* ─── tokens ───────────────────────── */
const t = {
  ink: "#0f0e0d",
  ink2: "#3a3835",
  ink3: "#7a776f",
  paper: "#faf8f4",
  paper2: "#f2efe9",
  rule: "#dedad2",
  amber: "#c8873a",
  amberLt: "#f5e9d8",
  geist: "'Geist', sans-serif",
  serif: "'Instrument Serif', serif",
};

/* ─── styles ───────────────────────── */
const s = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    background: t.paper,
    fontFamily: t.geist,
  },

  main: {
    flex: 1,
    padding: "60px 80px",
  },

  header: {
    marginBottom: "40px",
  },

  eyebrow: {
    fontSize: 11,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: t.amber,
    marginBottom: 6,
  },

  title: {
    fontFamily: t.serif,
    fontSize: "2.4rem",
    color: t.ink,
  },

  card: {
    maxWidth: 520,
    background: "#fff",
    border: `1px solid ${t.rule}`,
    borderRadius: 16,
    padding: "30px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.03)",
  },

  field: { marginBottom: "18px" },

  label: {
    fontSize: 12,
    color: t.ink2,
    marginBottom: 6,
    display: "block",
  },

  input: {
    width: "100%",
    height: 44,
    borderRadius: 10,
    border: `1.5px solid ${t.rule}`,
    background: t.paper2,
    padding: "0 14px",
    fontSize: 14,
    outline: "none",
  },

  textarea: {
    width: "100%",
    minHeight: 120,
    borderRadius: 10,
    border: `1.5px solid ${t.rule}`,
    background: t.paper2,
    padding: "12px 14px",
    fontSize: 14,
    outline: "none",
  },

  btn: {
    width: "100%",
    height: 48,
    marginTop: "10px",
    borderRadius: 12,
    border: "none",
    background: t.ink,
    color: "#fff",
    fontSize: 14,
    cursor: "pointer",
    transition: "transform 0.1s",
  },

  note: {
    marginTop: "16px",
    fontSize: 12.5,
    background: t.amberLt,
    padding: "10px 12px",
    borderRadius: 10,
  },
};

/* ─── icon (same as login) ───────────────────────── */
const BrandMark = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="#c8873a" strokeWidth="1.75">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 14l2 2 4-4" />
  </svg>
);

/* ─── component ───────────────────────── */
function CreateProject() {
  const [f, setF] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const h = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const s_submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await privateApi.post("/projects/create", f);
      alert(res.data.message || "Project created");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.layout}>

      {/* LEFT SIDE (optional future sidebar space) */}
      <div style={{ width: "240px", borderRight: `1px solid ${t.rule}` }} />

      {/* MAIN CONTENT */}
      <div style={s.main}>

        {/* header */}
        <div style={s.header}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <BrandMark />
            <span style={{ fontFamily: t.serif, fontSize: 18 }}>TaskFlow</span>
          </div>

          <div style={s.eyebrow}>Projects</div>
          <div style={s.title}>Create a new project</div>
        </div>

        {/* form card */}
        <div style={s.card}>
          <form onSubmit={s_submit}>

            <div style={s.field}>
              <label style={s.label}>Project Title</label>
              <input
                name="title"
                value={f.title}
                onChange={h}
                style={s.input}
                placeholder="e.g. AI Task Manager"
                required
              />
            </div>

            <div style={s.field}>
              <label style={s.label}>Description</label>
              <textarea
                name="description"
                value={f.description}
                onChange={h}
                style={s.textarea}
                placeholder="Describe what this project is about..."
              />
            </div>

            <button style={s.btn} disabled={loading}>
              {loading ? "Creating..." : "Create Project →"}
            </button>
          </form>

          <div style={s.note}>
            You can add members and tasks after creating the project.
          </div>
        </div>

      </div>
    </div>
  );
}

export default CreateProject;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import privateApi from "../services/privateApi";
import Layout from "../components/Layout";

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

const s = {
  header: { marginBottom: "40px" },
  eyebrow: { fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: t.amber, marginBottom: 6 },
  title: { fontFamily: t.serif, fontSize: "2.4rem", color: t.ink },
  card: { maxWidth: 520, background: "#fff", border: `1px solid ${t.rule}`, borderRadius: 16, padding: "30px", boxShadow: "0 10px 25px rgba(0,0,0,0.03)" },
  field: { marginBottom: "18px" },
  label: { fontSize: 12, color: t.ink2, marginBottom: 6, display: "block" },
  input: { width: "100%", height: 44, borderRadius: 10, border: `1.5px solid ${t.rule}`, background: t.paper2, padding: "0 14px", fontSize: 14, outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", minHeight: 120, borderRadius: 10, border: `1.5px solid ${t.rule}`, background: t.paper2, padding: "12px 14px", fontSize: 14, outline: "none", boxSizing: "border-box" },
  btn: { width: "100%", height: 48, marginTop: "10px", borderRadius: 12, border: "none", background: t.ink, color: "#fff", fontSize: 14, cursor: "pointer" },
  note: { marginTop: "16px", fontSize: 12.5, background: t.amberLt, padding: "10px 12px", borderRadius: 10 },
};

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
    <Layout>
      <div style={s.header}>
        <div style={s.eyebrow}>Projects</div>
        <div style={s.title}>Create a new project</div>
      </div>

      <div style={s.card}>
        <form onSubmit={s_submit}>
          <div style={s.field}>
            <label style={s.label}>Project Title</label>
            <input name="title" value={f.title} onChange={h} style={s.input} placeholder="e.g. AI Task Manager" required />
          </div>

          <div style={s.field}>
            <label style={s.label}>Description</label>
            <textarea name="description" value={f.description} onChange={h} style={s.textarea} placeholder="Describe what this project is about..." />
          </div>

          <button style={s.btn} disabled={loading}>
            {loading ? "Creating..." : "Create Project →"}
          </button>
        </form>

        <div style={s.note}>
          You can add members and tasks after creating the project.
        </div>
      </div>
    </Layout>
  );
}

export default CreateProject;
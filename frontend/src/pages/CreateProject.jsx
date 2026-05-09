import { useState } from "react";
import { useNavigate } from "react-router-dom";
import privateApi from "../services/privateApi";

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

const BrandMark = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="#c8873a" strokeWidth="1.75">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 14l2 2 4-4" />
  </svg>
);

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
    <>
      <style>{`
        .cp-layout {
          display: flex;
          min-height: 100vh;
          background: ${t.paper};
          font-family: ${t.geist};
        }
        .cp-sidebar {
          width: 240px;
          border-right: 1px solid ${t.rule};
          flex-shrink: 0;
        }
        .cp-main {
          flex: 1;
          padding: 60px 80px;
        }
        .cp-header {
          margin-bottom: 40px;
        }
        .cp-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
        }
        .cp-eyebrow {
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: ${t.amber};
          margin-bottom: 6px;
        }
        .cp-title {
          font-family: ${t.serif};
          font-size: 2.4rem;
          color: ${t.ink};
          margin: 0;
        }
        .cp-card {
          max-width: 520px;
          background: #fff;
          border: 1px solid ${t.rule};
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.03);
        }
        .cp-field {
          margin-bottom: 18px;
        }
        .cp-label {
          font-size: 12px;
          color: ${t.ink2};
          margin-bottom: 6px;
          display: block;
        }
        .cp-input {
          width: 100%;
          height: 44px;
          border-radius: 10px;
          border: 1.5px solid ${t.rule};
          background: ${t.paper2};
          padding: 0 14px;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
        }
        .cp-textarea {
          width: 100%;
          min-height: 120px;
          border-radius: 10px;
          border: 1.5px solid ${t.rule};
          background: ${t.paper2};
          padding: 12px 14px;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
          resize: vertical;
        }
        .cp-btn {
          width: 100%;
          height: 48px;
          margin-top: 10px;
          border-radius: 12px;
          border: none;
          background: ${t.ink};
          color: #fff;
          font-size: 14px;
          cursor: pointer;
        }
        .cp-note {
          margin-top: 16px;
          font-size: 12.5px;
          background: ${t.amberLt};
          padding: 10px 12px;
          border-radius: 10px;
        }

        @media (max-width: 768px) {
          .cp-sidebar {
            display: none;
          }
          .cp-main {
            padding: 30px 20px;
          }
          .cp-title {
            font-size: 1.8rem;
          }
          .cp-card {
            padding: 20px;
          }
        }

        @media (max-width: 480px) {
          .cp-main {
            padding: 20px 16px;
          }
          .cp-title {
            font-size: 1.5rem;
          }
          .cp-card {
            border-radius: 12px;
            padding: 16px;
          }
          .cp-btn {
            height: 44px;
            font-size: 13px;
          }
        }
      `}</style>

      <div className="cp-layout">
        <div className="cp-sidebar" />

        <div className="cp-main">
          <div className="cp-header">
            <div className="cp-brand">
              <BrandMark />
              <span style={{ fontFamily: t.serif, fontSize: 18 }}>TaskFlow</span>
            </div>
            <div className="cp-eyebrow">Projects</div>
            <h1 className="cp-title">Create a new project</h1>
          </div>

          <div className="cp-card">
            <form onSubmit={s_submit}>
              <div className="cp-field">
                <label className="cp-label">Project Title</label>
                <input
                  name="title"
                  value={f.title}
                  onChange={h}
                  className="cp-input"
                  placeholder="e.g. AI Task Manager"
                  required
                />
              </div>

              <div className="cp-field">
                <label className="cp-label">Description</label>
                <textarea
                  name="description"
                  value={f.description}
                  onChange={h}
                  className="cp-textarea"
                  placeholder="Describe what this project is about..."
                />
              </div>

              <button className="cp-btn" disabled={loading}>
                {loading ? "Creating..." : "Create Project →"}
              </button>
            </form>

            <div className="cp-note">
              You can add members and tasks after creating the project.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateProject;
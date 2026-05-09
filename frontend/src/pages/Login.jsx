import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";

/* ─── inline styles as JS objects ─────────────────────────────────────────
   No external CSS file needed. Drop this file and it works.
   Fonts loaded via a <link> in your index.html:
   <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500&display=swap" rel="stylesheet" />
─────────────────────────────────────────────────────────────────────────── */

const token = {
  ink:      "#0f0e0d",
  ink2:     "#3a3835",
  ink3:     "#7a776f",
  paper:    "#faf8f4",
  paper2:   "#f2efe9",
  paper3:   "#e8e4db",
  rule:     "#dedad2",
  amber:    "#c8873a",
  amberLt:  "#f5e9d8",
  redLt:    "#fdecea",
  red:      "#c0392b",
  geist:    "'Geist', sans-serif",
  serif:    "'Instrument Serif', serif",
};

const s = {
  /* page */
  page: {
    minHeight: "100vh",
    background: token.paper,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: token.geist,
    WebkitFontSmoothing: "antialiased",
  },

  /* card */
  card: {
    width: "100%",
    maxWidth: 420,
    margin: "0 auto",
    padding: "0 1.5rem",
  },

  /* brand row */
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: "2.75rem",
  },
  brandMark: {
    width: 36,
    height: 36,
    border: `1.5px solid ${token.rule}`,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: token.ink,
    flexShrink: 0,
  },
  brandName: {
    fontFamily: token.serif,
    fontSize: 20,
    color: token.ink,
    letterSpacing: "0.01em",
  },

  /* headings */
  eyebrow: {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: token.amber,
    marginBottom: 6,
    fontFamily: token.geist,
  },
  title: {
    fontFamily: token.serif,
    fontSize: "2rem",
    fontWeight: 400,
    color: token.ink,
    lineHeight: 1.2,
    marginBottom: "1.75rem",
  },

  /* field */
  field: { marginBottom: "1.1rem" },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: "0.4px",
    color: token.ink2,
    marginBottom: 6,
    fontFamily: token.geist,
  },
  inputWrap: { position: "relative" },
  input: {
    width: "100%",
    height: 44,
    background: token.paper2,
    border: `1.5px solid ${token.rule}`,
    borderRadius: 10,
    fontFamily: token.geist,
    fontSize: 14,
    color: token.ink,
    padding: "0 14px 0 40px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.18s, background 0.18s",
  },

  /* icon inside input */
  inputIcon: {
    position: "absolute",
    left: 13,
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    color: token.ink3,
  },

  /* submit */
  btn: {
    width: "100%",
    height: 46,
    background: token.ink,
    color: token.paper,
    border: "none",
    borderRadius: 10,
    fontFamily: token.geist,
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: "0.2px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: "1.5rem",
    transition: "background 0.18s, transform 0.1s",
  },

  /* error banner */
  error: {
    display: "flex",
    alignItems: "flex-start",
    gap: 9,
    background: token.redLt,
    color: token.red,
    borderRadius: 10,
    padding: "0.7rem 1rem",
    fontSize: 13,
    marginBottom: "1.1rem",
    lineHeight: 1.5,
  },

  /* info note */
  note: {
    display: "flex",
    alignItems: "flex-start",
    gap: 9,
    background: token.amberLt,
    color: "#7a4f1a",
    borderRadius: 10,
    padding: "0.7rem 1rem",
    fontSize: 12.5,
    marginTop: "1rem",
    lineHeight: 1.5,
  },

  /* register link */
  link: {
    marginTop: "1.5rem",
    textAlign: "center",
    fontSize: 13,
    color: token.ink3,
    fontFamily: token.geist,
  },
  linkAnchor: {
    color: token.ink,
    fontWeight: 500,
    cursor: "pointer",
    textDecoration: "underline",
    textUnderlineOffset: 3,
    background: "none",
    border: "none",
    fontFamily: token.geist,
    fontSize: 13,
    padding: 0,
  },

  /* divider above link */
  divider: {
    height: 1,
    background: token.rule,
    margin: "1.5rem 0 1.25rem",
  },
};

/* ─── tiny SVG icons ───────────────────────────────────────────────────── */
const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.75" style={s.inputIcon}>
    <circle cx="12" cy="7" r="4" />
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
  </svg>
);

const IconLock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.75" style={s.inputIcon}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const IconArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconAlert = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconInfo = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="#c8873a" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="12" x2="12" y2="16" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const BrandMark = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="#c8873a" strokeWidth="1.75">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 14l2 2 4-4" />
  </svg>
);

/* ─── component ────────────────────────────────────────────────────────── */
function Login() {
  // ── original state & logic (unchanged) ──────────────────────────────
  const [f, setF] = useState({ name: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);

  const h = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const s_submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await loginUser(f);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  // ── UI-only state ────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [focused, setFocused] = useState("");
  const [showPw, setShowPw]   = useState(false);

  const inputStyle = (name) => ({
    ...s.input,
    borderColor: focused === name ? token.ink : token.rule,
    background:  focused === name ? "#fff"    : token.paper2,
  });

  const btnStyle = {
    ...s.btn,
    background: loading ? token.ink2 : token.ink,
    cursor: loading ? "not-allowed" : "pointer",
  };

  return (
    <div style={s.page}>
      <div style={s.card}>

        {/* brand */}
        <div style={s.brand}>
          <div style={s.brandMark}><BrandMark /></div>
          <span style={s.brandName}>TaskFlow</span>
        </div>

        {/* heading */}
        <div style={s.eyebrow}>Task Manager</div>
        <div style={s.title}>Welcome back</div>

        {/* error */}
        {error && (
          <div style={s.error}>
            <IconAlert />
            <span>{error}</span>
          </div>
        )}

        {/* form — onSubmit is the original handler */}
        <form onSubmit={s_submit}>

          {/* name field */}
          <div style={s.field}>
            <label style={s.label} htmlFor="login-name">Username</label>
            <div style={s.inputWrap}>
              <input
                id="login-name"
                style={inputStyle("name")}
                name="name"
                placeholder="your username"
                autoComplete="username"
                onChange={h}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused("")}
              />
              <IconUser />
            </div>
          </div>

          {/* password field */}
          <div style={s.field}>
            <label style={s.label} htmlFor="login-pass">Password</label>
            <div style={s.inputWrap}>
              <input
                id="login-pass"
                style={{ ...inputStyle("password"), paddingRight: 40 }}
                name="password"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                onChange={h}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused("")}
              />
              <IconLock />
              {/* show / hide toggle */}
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                tabIndex={-1}
                style={{
                  position: "absolute", right: 13, top: "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none",
                  cursor: "pointer", padding: 0, color: token.ink3,
                  display: "flex", alignItems: "center",
                }}
              >
                {showPw ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* submit */}
          <button type="submit" style={btnStyle} disabled={loading}>
            {loading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="rgba(255,255,255,0.6)" strokeWidth="2"
                  style={{ animation: "spin 0.7s linear infinite" }}>
                  <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="10" />
                </svg>
                Signing in…
              </>
            ) : (
              <>Sign in <IconArrow /></>
            )}
          </button>
        </form>

        {/* admin-approval note */}
        <div style={s.note}>
          <IconInfo />
          New accounts require admin approval before you can sign in.
        </div>

        {/* register link — original navigate logic */}
        <div style={s.divider} />
        <div style={s.link}>
          Don't have an account?{" "}
          <button style={s.linkAnchor} onClick={() => navigate("/register")}>
            Register
          </button>
        </div>

      </div>

      {/* spinner keyframe injected once */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default Login;
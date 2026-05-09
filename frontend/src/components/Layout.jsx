import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

function Layout({ children }) {
  const navigate = useNavigate();
  const width = useWindowWidth();
  const isMobile = width < 768;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={s.wrapper}>

      {/* Sidebar */}
      <div style={{
        ...s.sidebarWrap,
        transform: isMobile ? (sidebarOpen ? "translateX(0)" : "translateX(-100%)") : "translateX(0)",
      }}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Overlay */}
      {isMobile && sidebarOpen && (
        <div style={s.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <main style={{
        marginLeft: isMobile ? 0 : 260,
        width: isMobile ? "100%" : "calc(100% - 260px)",
        padding: isMobile ? "16px" : "20px 30px",
        minHeight: "100vh",
        background: "#faf8f4",
        boxSizing: "border-box",
      }}>

        {/* TOPBAR */}
        <div style={s.topbar}>
          {isMobile ? (
            <button style={s.hamburger} onClick={() => setSidebarOpen(true)}>☰</button>
          ) : (
            <div />
          )}
          <div style={s.bell} onClick={() => navigate("/notifications")}>🔔</div>
        </div>

        {children}
      </main>

    </div>
  );
}

const s = {
  wrapper: { display: "flex", minHeight: "100vh", background: "#faf8f4" },
  sidebarWrap: {
    width: 260,
    flexShrink: 0,
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    transition: "transform 0.25s ease",
    zIndex: 200,
  },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 199 },
  topbar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  hamburger: { background: "#fff", border: "1px solid #ddd", borderRadius: 10, width: 42, height: 42, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  bell: { width: 42, height: 42, borderRadius: "50%", background: "#fff", border: "1px solid #ddd", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18, marginLeft: "auto" },
};

export default Layout;
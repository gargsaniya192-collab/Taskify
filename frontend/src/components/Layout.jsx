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
      {!isMobile && (
        <aside style={s.sidebarWrap}>
          <Sidebar />
        </aside>
      )}

      {/* Mobile Sidebar Drawer */}
      {isMobile && (
        <div style={{
          ...s.drawer,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}>
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Overlay */}
      {isMobile && sidebarOpen && (
        <div style={s.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <main style={s.main}>
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
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "#faf8f4",
  },
  sidebarWrap: {
    width: 260,
    flexShrink: 0,
    height: "100vh",
    position: "sticky",
    top: 0,
    borderRight: "1px solid #dedad2",
    background: "#faf8f4",
    overflowY: "auto",
  },
  drawer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: 260,
    height: "100vh",
    zIndex: 200,
    transition: "transform 0.25s ease",
    background: "#faf8f4",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    zIndex: 199,
  },
  main: {
    flex: 1,
    padding: "20px 30px",
    minHeight: "100vh",
    background: "#faf8f4",
    boxSizing: "border-box",
    minWidth: 0,
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  hamburger: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: 10,
    width: 42,
    height: 42,
    fontSize: 18,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  bell: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: "#fff",
    border: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 18,
    marginLeft: "auto",
  },
};

export default Layout;
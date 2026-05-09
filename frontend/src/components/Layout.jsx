import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

function Layout({ children }) {

  const navigate = useNavigate();

  return (
    <div style={styles.wrapper}>

      <Sidebar />

      <main style={styles.content}>

        {/* TOPBAR */}
        <div style={styles.topbar}>

          <div />

          {/* Notification Bell */}
          <div
            style={styles.bell}
            onClick={() =>
              navigate("/notifications")
            }
          >
            🔔
          </div>

        </div>

        {/* PAGE CONTENT */}
        {children}

      </main>

    </div>
  );
}

const styles = {

  wrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "#faf8f4",
  },

  content: {
    marginLeft: "260px",
    width: "calc(100% - 260px)",
    padding: "20px 30px",
    minHeight: "100vh",
    background: "#faf8f4",
  },

  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  bell: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#fff",
    border: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "18px",
  },
};

export default Layout;
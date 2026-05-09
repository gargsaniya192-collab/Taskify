require("dotenv").config();
require("./model/associations");

const cors = require("cors");
const express = require("express");

const { dbConnection } = require("./config/dbConnect");

// Routes
const authRoutes = require("./routes/authRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const projectRoutes = require("./routes/projectRoutes.js");
const projectMemberRoutes = require("./routes/projectMemberRoutes.js");
const taskRoutes = require("./routes/taskRoutes.js");
const commentRoutes = require("./routes/commentRoutes.js");
const notificationRoutes = require("./routes/notificationRoutes.js");
const activityRoutes = require("./routes/activityRoutes.js");
const userRoutes = require("./routes/userRoutes.js");

const app = express();

// ✅ CORS must be first
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/projects", projectRoutes);
app.use("/project-members", projectMemberRoutes);
app.use("/tasks", taskRoutes);
app.use("/comments", commentRoutes);
app.use("/activity", activityRoutes);
app.use("/notifications", notificationRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "Backend running" });
});

const startServer = async () => {
  try {
    await dbConnection();
    console.log("✅ Database connected successfully");

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Startup error:", error);
  }
};

startServer();
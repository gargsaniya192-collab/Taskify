require("dotenv").config();
require("./model/associations");

const cors = require("cors");
const express = require("express");

const { sequelize, dbConnection } = require("./config/dbConnect");
const createAdmin = require("./controller/createAdmin.js");

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

app.use(cors());
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

// 🚀 START SERVER PROPERLY
const startServer = async () => {
  try {
    // 1. Connect DB
    await dbConnection();

    // 2. Sync DB (create tables)
    await sequelize.sync({ alter: true });
    console.log("✅ Database synchronized successfully");

    // 3. Create admin user
    await createAdmin();

    // 4. Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Startup error:", error);
  }
};

startServer();
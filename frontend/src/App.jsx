import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import Projects from "./pages/Projects";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import AddMember from "./pages/AddMember";
import CreateTask from "./pages/CreateTask";
import TaskBoard from "./pages/TaskBoard";
import MyTasks from "./pages/MyTasks";
import TaskRequests from "./pages/TaskRequests";
import Notifications from "./pages/Notifications";
import ActivityLogs from "./pages/ActivityLogs";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-project"
        element={
          <ProtectedRoute>
            <Layout>
              <CreateProject />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* ✅ ADDED: Projects Page */}
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Layout>
              <Projects />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId/add-members"
        element={
          <ProtectedRoute>
            <Layout>
              <AddMember />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId/create-task"
        element={
          <ProtectedRoute>
            <Layout>
              <CreateTask />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId/tasks"
        element={
          <ProtectedRoute>
            <Layout>
              <TaskBoard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-tasks"
        element={
          <ProtectedRoute>
            <Layout>
              <MyTasks />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/task-requests"
        element={
          <ProtectedRoute>
            <Layout>
              <TaskRequests />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Layout>
              <Notifications />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId/activity"
        element={
          <ProtectedRoute>
            <Layout>
              <ActivityLogs />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

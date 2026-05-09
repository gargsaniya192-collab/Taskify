const Task = require("../model/Task");
const User = require("../model/User");
const ProjectMember = require("../model/ProjectMember");
const Project = require("../model/Project.js");
const sendNotification = require("../config/sendNotification.js");
const createActivityLog = require("../config/createActivityLog.js");
const createTasks = async (req, res) => {
  try {
    const { tasks } = req.body;

    if (!tasks || tasks.length === 0) {
      return res.status(400).json({
        message: "No tasks provided",
      });
    }
    const projectId = tasks[0].projectId;
    const creator = await ProjectMember.findOne({
      where: {
        projectId,
        userId: req.user.id,
        role: "manager",
      },
    });

    if (!creator) {
      return res.status(403).json({
        message: "Only project manager can create tasks",
      });
    }
    const validTasks = [];

    for (const task of tasks) {
      const { title, description, projectId, assignedTo, dueDate } = task;

      // check user exists
      const user = await User.findByPk(assignedTo);

      if (!user) {
        return res.status(404).json({
          message: `User ${assignedTo} does not exist`,
        });
      }

      // check user is part of project
      const member = await ProjectMember.findOne({
        where: {
          projectId,
          userId: assignedTo,
        },
      });

      if (!member) {
        return res.status(400).json({
          message: `User ${assignedTo} is not part of project ${projectId}`,
        });
      }

      const existingTask = await Task.findOne({
        where: {
          title,
          projectId,
          assignedTo,
        },
      });
      if (existingTask) {
        return res.status(400).json({
          message: `Task ${title} already assigned to user ${assignedTo}`,
        });
      }
      validTasks.push({
        title,
        description,
        projectId,
        assignedTo,
        dueDate,
      });
    }

    const createdTasks = await Task.bulkCreate(validTasks);
    for (const task of createdTasks) {
      await sendNotification(
        task.assignedTo,
        `You have been assigned a new task:${task.title}`,
      );
      await createActivityLog(
        task.projectId,
        req.user.id,
        "CREATE_TASK",
        `${req.user.name} assigned task ${task.title}`,
      );
    }

    res.status(201).json({
      message: "Tasks created successfully",
      tasks: createdTasks,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const getTaskBoard = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }
    const member = await ProjectMember.findOne({
      where: {
        projectId,
        userId: req.user.id,
      },
    });
    if (!member) {
      return res
        .status(403)
        .json({ message: "You are not a member of this project" });
    }
    const tasks = await Task.findAll({
      where: { projectId },
      include: [
        {
          model: User,
          as: "user", // 👈 MUST MATCH
          attributes: ["id", "name"],
        },
      ],
    });
    const board = {
      todo: [],
      "in-progress": [],
      done: [],
    };
    tasks.forEach((task) => {
      board[task.status].push(task);
    });
    res.json({ projectId, board });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const requestStatusChange = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    if (task.assignedTo !== req.user.id) {
      return res.status(403).json({
        message: "You are not assigned this task",
      });
    }

    if (task.requestStatus === "pending") {
      return res.status(400).json({
        message: "A status request is already pending",
      });
    }
    task.statusRequest = status;
    task.requestStatus = "pending";
    await task.save();
    await createActivityLog(
      task.projectId,
      req.user.id,
      "REQUEST_STATUS",
      `${req.user.name} requested the status change for task ${task.title}`,
    );
    const manager = await ProjectMember.findOne({
      where: {
        projectId: task.projectId,
        role: "manager",
      },
    });
    if (manager) {
      await sendNotification(
        manager.userId,
        `${req.user.name} requested status change for task ${task.title}`,
      );
    }
    res.json({ message: "Status update request sent", task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const approveStatusChange = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.requestStatus !== "pending") {
      return res.status(400).json({
        message: "No pending request to approve",
      });
    }

    task.status = task.statusRequest;
    task.statusRequest = null;
    task.requestStatus = "approved";
    await task.save();
    await createActivityLog(
      task.projectId,
      req.user.id,
      "APPROVE_STATUS",
      `${req.user.name} approved status change for task ${task.title}`,
    );
    await sendNotification(
      task.assignedTo,
      `Your task ${task.title} was approved`,
    );
    res.json({
      message: "Task status approved",
      task,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// const getPendingRequests = async (req, res) => {
//   try {
//     const tasks = await Task.findAll({
//       where: {
//         requestStatus: "pending",
//       },
//     });

//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({
//       error: error.message,
//     });
//   }
// };
const getPendingRequests = async (req, res) => {
  try {
    // Step 1: find all projects where user is either admin OR manager
    const memberships = await ProjectMember.findAll({
      where: {
        userId: req.user.id,
        role: ["admin", "manager"], // Sequelize supports IN style
      },
    });

    const projectIds = memberships.map(m => m.projectId);

    // Step 2: fetch only tasks from those projects
    const tasks = await Task.findAll({
      where: {
        projectId: projectIds,
        requestStatus: "pending",
      },
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const rejectStatusChange = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.requestStatus !== "pending") {
      return res.status(400).json({ message: "No pending request to reject" });
    }
    task.statusRequest = null;
    task.requestStatus = "rejected";
    await task.save();
    await createActivityLog(
      task.projectId,
      req.user.id,
      "REJECT_STATUS",
      `${req.user.name} rejected status change for task ${task.title}`,
    );
    await sendNotification(
      task.assignedTo,
      `Your task "${task.title}" was rejected`,
    );
    res.json({
      message: "Status request rejected",
      task,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyTasks = async (req, res) => {
  try {

    // Logged in user id from JWT
    const userId = req.user.id;

    // Find only assigned tasks
    const tasks = await Task.findAll({
      where: {
        assignedTo: userId
      },

      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name"]
        }
      ],

      order: [["createdAt", "DESC"]]
    });

    // Send tasks
    res.status(200).json(tasks);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};
module.exports = {
  createTasks,
  getTaskBoard,
  getPendingRequests,
  requestStatusChange,
  approveStatusChange,
  rejectStatusChange,
  getMyTasks
};

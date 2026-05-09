const Project = require("../model/Project");
const ProjectMember = require("../model/ProjectMember.js");
const createActivityLog = require("../config/createActivityLog.js");
const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const existingProject = await Project.findOne({
      where: { title },
    });

    if (existingProject) {
      return res.status(400).json({
        message: "Project with this title already exists",
      });
    }

    const project = await Project.create({
      title,
      description,
      createdBy: req.user.id,
      ownerId: req.user.id,
    });
    await createActivityLog(
      project.id,
      req.user.id,
      "CREATE_PROJECT",
      `${req.user.name} created project ${project.title}`,
    );
    await ProjectMember.create({
      projectId: project.id,
      userId: req.user.id,
      role: "manager",
    });
    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [
        {
          model: ProjectMember,
          where: {
            userId: req.user.id,
          },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: "Projects fetched successfully",
      projects,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
module.exports = { createProject, getAllProjects };

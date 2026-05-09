const ActivityLog = require("../model/ActivityLog.js");
const ProjectMember = require("../model/ProjectMember.js");

const getActivityLogs = async (req, res) => {

  try {

    const { projectId } = req.params;

    // Check whether user belongs to project
    const member =
      await ProjectMember.findOne({
        where: {
          projectId,
          userId: req.user.id,
        },
      });

    // If not part of project
    if (!member) {

      return res.status(403).json({
        message:
          "You are not part of this project",
      });

    }

    // Fetch activity logs
    const logs =
      await ActivityLog.findAll({

        where: {
          projectId,
        },

        order: [
          ["createdAt", "DESC"],
        ],

      });

    res.json(logs);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }
};

module.exports = {
  getActivityLogs,
};
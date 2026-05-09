const Project = require("./Project");
const ProjectMember = require("./ProjectMember");
const User = require("./User");
const Task=require("./Task");
const TaskComment=require("./TaskComment");
Project.hasMany(ProjectMember, {
  foreignKey: "projectId",
  onDelete: "CASCADE",
});
ProjectMember.belongsTo(Project, {
  foreignKey: "projectId",
});
ProjectMember.belongsTo(User, {
  foreignKey: "userId",
});
Task.hasMany(TaskComment, {
  foreignKey: "taskId",
  onDelete: "CASCADE",
});

TaskComment.belongsTo(Task, {
  foreignKey: "taskId",
});

User.hasMany(TaskComment, {
  foreignKey: "userId",
  as: "comments",
});

TaskComment.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});



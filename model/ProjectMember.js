const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConnect");
const User=require('./User');
const Project=require('./Project');
const ProjectMember = sequelize.define("ProjectMember", {

  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  role: {
    type: DataTypes.ENUM("manager", "member"),
    defaultValue: "member"
  },
  

});

module.exports = ProjectMember;

const {DataTypes}=require("sequelize");
const {sequelize}=require("../config/dbConnect");
const projectMember=require('../model/ProjectMember');
const Project=sequelize.define("Project",{
    title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT
  },

  createdBy: {
    type: DataTypes.INTEGER
  },
  ownerId: {
  type: DataTypes.INTEGER,
  allowNull: false
}

});

module.exports=Project;
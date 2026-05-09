const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConnect");
const User = require("./User");
const Task = sequelize.define("Task", {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT
  },

  status: {
    type: DataTypes.ENUM("todo", "in-progress", "done"),
    defaultValue: "todo"
  },
  statusRequest: {
    type: DataTypes.ENUM("todo","in-progress","done"),
    allowNull: true
  },
  requestStatus: {
  type: DataTypes.ENUM("pending","approved","rejected"),
  defaultValue: null
},
 dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  assignedTo: {
    type: DataTypes.INTEGER
  },
  
});
Task.belongsTo(User, {
  foreignKey: "assignedTo",
  as: "user",  
});

module.exports = Task;
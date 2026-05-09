const TaskComment = require("../model/TaskComment");
const Task = require("../model/Task");
const ProjectMember = require("../model/ProjectMember");
const User=require("../model/User.js");
const sendNotification=require('../config/sendNotification.js');
const addComment = async (req,res)=>{
  try{

    const {taskId} = req.params;
    const {comment} = req.body;

    const task = await Task.findByPk(taskId);

    if(!task){
      return res.status(404).json({
        message:"Task not found"
      });
    }

    // check user belongs to project
    const member = await ProjectMember.findOne({
      where:{
        projectId: task.projectId,
        userId: req.user.id
      }
    });

    if(!member){
      return res.status(403).json({
        message:"You are not a member of this project"
      });
    }
    const existingComment = await TaskComment.findOne({
      where: {
        taskId: taskId,
        userId: req.user.id,
        comment: comment
      }
    });

    if (existingComment) {
      return res.status(400).json({
        message: "This comment already exists"
      });
    }

    const newComment = await TaskComment.create({
      taskId,
      userId:req.user.id,
      comment
    });
    const members=await ProjectMember.findAll({
      where:{projectId:task.projectId}
    });
    for(const member of members)
    {
      if(member.userId!==req.user.id)
      {
       await sendNotification(
        member.userId,
        `${req.user.name} commented on task ${task.title}`
       )
      }
    }
    res.status(201).json({
      message:"Comment added",
      comment:newComment
    });

  }catch(error){
    res.status(500).json({error:error.message});
  }
};
const getTaskComments = async (req,res)=>{
  try{

    const {taskId} = req.params;

    const task = await Task.findByPk(taskId);

    if(!task){
      return res.status(404).json({
        message:"Task not found"
      });
    }

    const comments = await TaskComment.findAll({
      where:{taskId},
       include: [
    {
      model: User,
      as: "user",   
      attributes: ["id", "name"],
    },
  ],
      order:[["createdAt","ASC"]]
    });

    res.json(comments);

  }catch(error){
    res.status(500).json({error:error.message});
  }
};

module.exports = {addComment,getTaskComments};
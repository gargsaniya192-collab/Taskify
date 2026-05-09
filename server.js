 require('dotenv').config();
 require("./model/associations");
 const cors = require("cors");
const express=require("express");
const { sequelize,dbConnection } = require("./config/dbConnect");
const createAdmin =require('./controller/createAdmin.js')
const authRoutes=require('./routes/authRoutes.js');
const adminRoutes=require('./routes/adminRoutes.js')
const projectRoutes=require('./routes/projectRoutes.js')
const projectMemberRoutes=require("./routes/projectMemberRoutes.js");
const taskRoutes=require('./routes/taskRoutes.js');
const commentRoutes=require('./routes/commentRoutes.js');
const notificationRoutes=require('./routes/notificationRoutes.js');
const activityRoutes=require('./routes/activityRoutes.js');
const userRoutes=require('./routes/userRoutes.js');
 const app=express();
app.use(cors());
 app.use(express.json());

app.use("/auth",authRoutes);
app.use("/admin",adminRoutes);
app.use("/projects",projectRoutes);
app.use("/project-members",projectMemberRoutes);
app.use("/tasks",taskRoutes);
app.use("/",commentRoutes);
app.use("/activity",activityRoutes);
app.use("/notifications",notificationRoutes);
app.use("/api/users", userRoutes);
 (async()=>
  {
     try{
        await sequelize.sync({alter:true});
     console.log(`Databse synchronized successfully`);
     await createAdmin();
     }catch(error)
   {         console.log(`Error synchronizing datanase:`,error);
   }

 })();


app.listen(3000,()=>
{
    console.log(`server is running on the port 3000`);
    dbConnection();
})


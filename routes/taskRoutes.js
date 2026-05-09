const express=require("express");
const router=express.Router();
const authMiddleware=require("../middleware/authMiddleware.js");
const authorizeRole=require("../middleware/authorizeRole.js");
const {createTasks,getTaskBoard,requestStatusChange,approveStatusChange,rejectStatusChange,getPendingRequests,getMyTasks}=require("../controller/taskController.js");
router.post("/create-many",authMiddleware,authorizeRole("admin","manager"),createTasks);
router.get("/project/:projectId/board",authMiddleware,getTaskBoard);
router.get(
  "/my-tasks",
  authMiddleware,
  getMyTasks
);

router.patch(
  "/:taskId/request-status",
  authMiddleware,
  requestStatusChange
);

router.patch(
  "/:taskId/approve-status",
  authMiddleware,
  authorizeRole("admin","manager"),
  approveStatusChange
);

router.patch(
  "/:taskId/reject-status",
  authMiddleware,
  authorizeRole("admin","manager"),
  rejectStatusChange
);
router.get(
  "/pending-requests",
  authMiddleware,
  authorizeRole("admin","manager"),
  getPendingRequests
);
module.exports=router;
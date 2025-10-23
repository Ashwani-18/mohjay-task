const express = require("express");
const { createTask, getProjectTasks } = require("../controllers/taskControllers");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.use(protect);

router.post("/", createTask);
router.get("/project/:projectId", getProjectTasks);

module.exports = router;
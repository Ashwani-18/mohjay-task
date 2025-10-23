const express = require("express");
const { createProject, getUserProjects } = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.use(protect);

router.post("/", createProject);
router.get("/", getUserProjects);

module.exports = router;
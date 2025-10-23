const express = require("express");
const { getUserAnalytics } = require("../controllers/analyticsControllers");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.use(protect);
router.get("/user", getUserAnalytics);

module.exports = router;
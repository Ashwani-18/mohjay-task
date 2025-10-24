const express = require("express");
const { sendPhoneOtp, verifyPhoneOtp, login, sendEmailOtp, verifyEmailOtp } = require("../controllers/authControllers");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const router = express.Router();
const userModels = require("../models/userModels");


// for email
router.post("/email-send-otp",sendEmailOtp)
router.post("/email-verify-otp",verifyEmailOtp)

// for phone 
router.post("/phone-send-otp",sendPhoneOtp)
router.post("/phone-verify-otp",verifyPhoneOtp)

// login 
router.post("/login",login)

//user
router.get("/user", protect, authorizeRoles("user", "admin", "superadmin"), (req, res) => {
  res.json({ message: `Welcome ${req.user.name}, you are logged in as ${req.user.role}` });
});

// Admin 
router.get("/admin", protect, authorizeRoles("admin", "superadmin"), (req, res) => {
  res.json({ message: `Hello ${req.user.name}, this is the Admin route.` });
});

// SuperAdmin 
router.get("/superadmin", protect, authorizeRoles("superadmin"), (req, res) => {
  res.json({ message: `Hello ${req.user.name}, this is the SuperAdmin route.` });
});


router.delete("/clean-db", async (req, res) => {
  try {
    console.log("🧹 Cleaning database...");
    
    const result = await userModels.deleteMany({ phone: null });
    
    console.log(`✅ Cleaned ${result.deletedCount} users with null phone numbers`);
    
    res.json({
      success: true,
      message: `✅ Database cleaned! Removed ${result.deletedCount} users with null phone numbers`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error("❌ Cleanup error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
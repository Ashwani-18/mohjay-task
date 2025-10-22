const express = require("express");
const { sendPhoneOtp, verifyPhoneOtp, login } = require("../controllers/authControllers");
const router = express.Router();


// for email
// router.post("/email-send-otp",)
// router.post("/email-verify-otp",)

// for phone 
router.post("/phone-send-otp",sendPhoneOtp)
router.post("/phone-verify-otp",verifyPhoneOtp)

// login 
router.post("/login",login)


module.exports = router;
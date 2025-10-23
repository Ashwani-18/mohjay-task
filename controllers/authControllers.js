const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModels = require("../models/userModels");
const EmailOtp = require("../models/emailOtpModel");
const PhoneOtp = require("../models/phoneOtpModel");
const sendEmail = require("../utils/sendEmail");
const sendSms = require("../utils/sendSms");

// OTP generator
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// JWT token generator
function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// ------------------- Email OTP -------------------
exports.sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ message: "email is required", success: false });

    const existingUser = await userModels.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "user already exists", success: false });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await EmailOtp.deleteMany({ email });
    await EmailOtp.create({ email, otp, expiresAt });

    await sendEmail(
      email,
      "Signup OTP",
      `Your OTP is ${otp}. It expires in 5 minutes.`
    );

    res.status(200).json({ message: "otp sent to email", success: true });
  } catch (error) {
    res.status(500).json({ message: "unable to send otp", success: false });
  }
};

exports.verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp, name, password } = req.body;
    if (!email || !otp || !name || !password)
      return res
        .status(400)
        .json({ message: "all fields are required", success: false });

    const record = await EmailOtp.findOne({ email });
    if (!record)
      return res
        .status(400)
        .json({
          message: "otp not found, please request a new one",
          success: false,
        });
    if (record.otp !== otp)
      return res.status(400).json({ message: "invalid otp", success: false });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModels.create({
      name,
      email,
      password: hashedPassword,
    });
    await EmailOtp.deleteMany({ email });

    const token = signToken(user._id);
    res
      .status(200)
      .json({
        message: "otp verified successfully",
        success: true,
        token,
        user,
      });
  } catch (error) {
    res.status(500).json({ message: "unable to verify otp", success: false });
  }
};

// ------------------- Phone OTP -------------------
exports.sendPhoneOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone)
      return res
        .status(400)
        .json({ message: "phone is required", success: false });

    const existingUser = await userModels.findOne({ phone });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "user already exists", success: false });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await PhoneOtp.deleteMany({ phone });
    await PhoneOtp.create({ phone, otp, expiresAt });

    await sendSms(phone, `Your OTP is ${otp}. It expires in 5 minutes.`);

    res.status(200).json({ message: "otp sent to phone", success: true });
  } catch (error) {
    res.status(500).json({ message: "unable to send otp", success: false });
  }
};

exports.verifyPhoneOtp = async (req, res) => {
  try {
    const { phone, otp, name, password } = req.body;
    if (!phone || !otp || !name || !password)
      return res
        .status(400)
        .json({ message: "all fields are required", success: false });

    const record = await PhoneOtp.findOne({ phone });
    if (!record)
      return res
        .status(400)
        .json({
          message: "otp not found, please request a new one",
          success: false,
        });
    if (record.otp !== otp)
      return res.status(400).json({ message: "invalid otp", success: false });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModels.create({
      name,
      phone,
      password: hashedPassword,
    });
    await PhoneOtp.deleteMany({ phone });

    const token = signToken(user._id);
    res
      .status(200)
      .json({
        message: "otp verified successfully",
        success: true,
        token,
        user,
      });
  } catch (error) {
    res.status(500).json({ message: "unable to verify otp", success: false });
  }
};

// ------------------- Login (Email or Phone) -------------------
exports.login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    if (!password || (!email && !phone))
      return res
        .status(400)
        .json({ success: false, message: "all fields are required" });

    const user = await userModels.findOne({ $or: [{ email }, { phone }] });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "user not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "invalid credentials" });

    const token = signToken(user._id);
    res
      .status(200)
      .json({
        success: true,
        message: "login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "unable to login" });
  }
};

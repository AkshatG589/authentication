const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const cleanupExpiredUsers = require("../middleware/cleanupExpiredUsers");
const fetchuser = require("../middleware/fetchuser");

const generateOTP = require("../util/generateOTP");
const hashPassword = require("../util/hashPassword");
const sendOTPEmail = require("../util/sendOTPEmail");
const validateOTP = require("../util/validateOTP");

const JWT_SECRET = process.env.JWT_SECRET;

// 📌 POST /api/auth/register
router.post(
  "/register",
  [
    cleanupExpiredUsers,
    body("username", "Username must be at least 3 characters").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { username, email, password } = req.body;

      let user = await User.findOne({ $or: [{ email }, { username }] });
      if (user) return res.status(400).json({ error: "Email or username already exists" });

      const hashedPassword = await hashPassword(password);
      const { otp, otpExpiry } = generateOTP();

      user = new User({ username, email, password: hashedPassword, otp, otpExpiry, verified: false });
      await user.save();

      const previewURL = await sendOTPEmail(email, username, otp);

      res.status(200).json({
        message: "OTP sent to email (test mode)",
        email: user.email,
        otp: otp,
        previewURL
      });
    } catch (error) {
      console.error("Register Error:", error.message);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

// 📌 POST /api/auth/verify
router.post(
  "/verify",
  [
    body("email", "Enter a valid email").isEmail(),
    body("otp", "OTP must be 6 digits").isLength({ min: 6, max: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, otp } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found" });
      if (user.verified) return res.status(400).json({ error: "User already verified" });

      const valid = validateOTP(otp, user.otp, user.otpExpiry);
      if (!valid.success) return res.status(400).json({ error: valid.message });

      user.verified = true;
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();

      const payload = { user: { id: user.id } };
      const authToken = jwt.sign(payload, JWT_SECRET);

      res.status(200).json({
        message: "Account verified successfully",
        authToken
      });
    } catch (error) {
      console.error("Verify Error:", error.message);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

// 📌 POST /api/auth/login
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "Invalid email or password" });

      if (!user.verified)
        return res.status(400).json({ error: "Account not verified. Please verify via OTP." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

      const payload = { user: { id: user.id } };
      const authToken = jwt.sign(payload, JWT_SECRET);

      res.status(200).json({ authToken });
    } catch (error) {
      console.error("Login Error:", error.message);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

// 📌 GET /api/auth/getuser
router.get("/getuser", fetchuser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("Get User Error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});


// 📌 POST /api/auth/forgot-password – Request OTP for password reset
router.post("/forgot-password", [
  body("email", "Enter a valid email").isEmail(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    const { otp, otpExpiry } = generateOTP();
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    const previewURL = await sendOTPEmail(email, user.username, otp);

    res.status(200).json({
      message: "Reset OTP sent to email (test mode)",
      otp: otp,
      previewURL,
    });
  } catch (error) {
    console.error("Forgot Password Error:", error.message);
    res.status(500).json({ error: "Server Error" });
  }
});


// 📌 POST /api/auth/reset-password – Use OTP to set a new password
router.post("/reset-password", [
  body("email", "Enter a valid email").isEmail(),
  body("newPassword", "Password must be at least 6 characters").isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // 💡 Here you assume OTP was already verified
    user.password = await hashPassword(newPassword);
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });

  } catch (error) {
    console.error("Reset Password Error:", error.message);
    res.status(500).json({ error: "Server Error" });
  }
});
module.exports = router;
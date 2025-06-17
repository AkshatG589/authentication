// middleware/cleanupExpiredUsers.js
const User = require("../models/User");

const cleanupExpiredUsers = async (req, res, next) => {
  try {
    await User.deleteMany({
      verified: false,
      otpExpiry: { $lt: new Date() },
    });
    console.log("🧹 Expired unverified users cleaned up");
  } catch (error) {
    console.error("🛑 Cleanup error:", error.message);
  }
  next(); // ✅ Proceed to next middleware or route handler
};

module.exports = cleanupExpiredUsers;
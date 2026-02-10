const express = require("express");
const {
  register,
  verifyOTP,
  login,
  logout,
  profile,
} = require("../controllers/auth.controller");

const router = express.Router();

// ! Register API
router.post("/register", register);

// ! Verify - OTP API
router.post("/verifyUser", verifyOTP);

// ! Login User API
router.post("/login", login);

// ! Logout User API
router.get("/logout", logout);

// ! User Profile API
router.get("/profile", profile);

module.exports = router;

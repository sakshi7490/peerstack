const express = require("express");

const {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");

const router = express.Router();


// Register
router.post("/register", registerUser);


// Login
router.post("/login", loginUser);

//verfiy email

router.get("/verify-email/:token", verifyEmail);


// Forgot Password
router.post("/forgot-password", forgotPassword);


// Reset Password
router.post("/reset-password/:token", resetPassword);


module.exports = router;
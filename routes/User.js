const express = require('express');
const router = express.Router();
const { auth, isAdmin, isInstructor, isStudent } = require('../middlewares/auth');
const { login, sendOTP, changePassword, signUp } = require("../controllers/Auth");
const { resetPasswordToken, resetPassword } = require("../controllers/ResetPassword");

// Routes for login, signUp, and Authentication

// Route for user login
router.post("/login", auth,login);

// Route for user signup
router.post("/signup", signUp);

// Route for sending OTP
router.post("/sendOTP", sendOTP);

// Route for changing password (requires authentication)
router.put("/changePassword", auth, changePassword);

// Route for resetting password
router.put("/resetPassword", resetPasswordToken, resetPassword);

module.exports = router;

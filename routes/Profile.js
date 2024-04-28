const express = require('express');
const router = express.Router();
const {auth} = require('../middlewares/auth');
const {
    deleteAccount,
    updateProfile,
    getAllUserDetails,
} = require("../controllers/Profile");

//Delete User Account
router.delete("/deleteProfile",deleteAccount)
router.delete("/updateProfile",updateProfile)
// router.delete("/getUserDetails",getUserDetails)
//Get Enrolled Courses
router.get("getAllUserDetails",getAllUserDetails)

module.exports = router;
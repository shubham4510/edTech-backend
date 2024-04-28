const express = require('express');
const router = express.Router();

const {
    createCourse,
    showAllCourses,
    getCourseDetails,
} = require('../controllers/Course');

const {
    createSection,
    updateSection,
    deleteSection,
} = require('../controllers/Section');

const {
    createSubSection,
    updateSubSection,
} = require('../controllers/SubSection');

const {
    categoryPageDetails,
    showAllCategory,
    createCategory,
} = require('../controllers/Category');

const {
    auth,
    isAdmin,
    isInstructor,
    isStudent,
} = require('../middlewares/auth')

// Routes for Course
router.post("/createCourse", auth, isInstructor, createCourse);
router.get("/showAllCourses", showAllCourses);
router.get("/getCourseDetails", getCourseDetails);

// Routes for Section
router.post("/createSection", auth, isInstructor, createSection);
router.put("/updateSection/:id", auth, isInstructor, updateSection);
router.delete("/deleteSection/:id", auth, isInstructor, deleteSection);

// Routes for SubSection
router.post("/createSubSection", auth, isInstructor, createSubSection);
router.put("/updateSubSection/:id", auth, isInstructor, updateSubSection);

// Route for category page details (requires admin authentication)
router.get("/categoryPageDetails", auth, isAdmin, categoryPageDetails);

// Route for showing all categories
router.get("/showAllCategories", showAllCategory);

// Route for creating a category (requires admin authentication)
router.post("/createCategory", auth, isAdmin, createCategory);

module.exports = router;

const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");
const {
  startInterview,
  submitAnswers,
  getInterviewResult,
  getAllInterviews,
} = require("../controllers/interview.controller");

const router = express.Router();

// 🔥 FIRST: Specific routes
router.post("/start", authMiddleware, startInterview);
router.post("/submit", authMiddleware, submitAnswers);

// 🔥 THEN: General routes
router.get("/", authMiddleware, getAllInterviews);
router.get("/:interviewId", authMiddleware, getInterviewResult);

module.exports = router;
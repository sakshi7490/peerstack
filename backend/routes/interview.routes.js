const express = require("express");
const Interview = require("../models/interview.model");

const extractResumeText = require("../utils/resumeParser");
const { generateResumeQuestions } = require("../utils/ai.service");

const authMiddleware = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const {
  startInterview,
  submitAnswers,
  getInterviewResult,
  getAllInterviews,
} = require("../controllers/interview.controller");

const router = express.Router();

router.post(
  "/upload-resume",
  authMiddleware,
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const resumeText = await extractResumeText(req.file.buffer);

      const questionsArray = await generateResumeQuestions(resumeText);

      const formattedQuestions = questionsArray.map((q) => ({
        question: q,
        answer: "",
      }));

      const interview = await Interview.create({
        userId: req.user,
        role: "resume-based",
        interviewType: "resume",
        resumeText,
        questions: formattedQuestions,
        score: 0,
        feedback: "",
        status: "pending",
    });

      res.status(201).json({
        success: true,
        message: "Resume-based interview created",
        data: interview,
      });

    } catch (err) {
      console.log(err);

      res.status(500).json({
        success: false,
        message: "Resume interview creation failed",
      });
    }
  }
);


// 🔥 FIRST: Specific routes
router.post("/start", authMiddleware, startInterview);
router.post("/submit", authMiddleware, submitAnswers);

// 🔥 THEN: General routes
router.get("/", authMiddleware, getAllInterviews);
router.get("/:interviewId", authMiddleware, getInterviewResult);

module.exports = router;
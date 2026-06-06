const express = require("express");
const extractResumeText = require("../utils/resumeParser");

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

      const resumeText = await extractResumeText(
        req.file.buffer
      );

      res.status(200).json({
        success: true,
        fileName: req.file.originalname,

        // temporary
        extractedText: resumeText,
      });

    } catch (err) {
      console.log(err);

      res.status(500).json({
        success: false,
        message: "Resume parsing failed",
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
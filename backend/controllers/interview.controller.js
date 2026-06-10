const Interview = require("../models/interview.model");
const questionsData = require("../utils/questions");

const { generateQuestions } = require("../utils/ai.service");
const { evaluateAnswers } = require("../utils/ai.service");

// start interview
exports.startInterview = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    const questionsArray = await generateQuestions(role);

    const formattedQuestions = questionsArray.map((q) => ({
      question: q,
      answer: "",
    }));

    const interview = await Interview.create({
      userId: req.user,
      role,
      questions: formattedQuestions,
      score: 0,
      feedback: "",
      status: "pending",
      
    });

    res.json({
      success: true,
      message: "Interview started",
      data: interview,
    });
  } catch (error) {
    console.log(error); // 👈 ADD THIS FOR DEBUG
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// SUBMIT ANSWERS (AI VERSION)
exports.submitAnswers = async (req, res) => {
  try {
    const { interviewId, answers } = req.body;

    // 🔍 Validate input
    if (!interviewId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "InterviewId and answers are required",
      });
    }

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    // 🔒 Optional: user security check
    if (interview.userId.toString() !== req.user) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // ✅ Update answers
    interview.questions = interview.questions.map((q, index) => ({
      question: q.question,
      answer: answers[index] || "",
    }));

    // 🔥 AI Evaluation
    const questionsList = interview.questions.map((q) => q.question);
    const answersList = interview.questions.map((q) => q.answer);

    const aiFeedback = await evaluateAnswers(
      questionsList,
      answersList,
      interview.resumeText,
    );

    // ✅ Store feedback
    interview.feedback = aiFeedback;
    interview.status = "completed";

    // 🔥 Extract score from feedback (IMPORTANT FIX)
    const scoreMatch = aiFeedback.match(/Score:\s*(\d+)/);

    if (scoreMatch) {
      interview.score = parseInt(scoreMatch[1]);
    } else {
      interview.score = 0; // fallback
    }

    await interview.save();

    res.json({
      success: true,
      message: "Answers submitted (AI evaluated)",
      data: interview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE INTERVIEW RESULT
exports.getInterviewResult = async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    res.json({
      success: true,
      message: "Interview fetched",
      data: interview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL INTERVIEWS FOR USER
exports.getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      message: "All interviews fetched",
      data: interviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET INTERVIEW ANALYTICS
exports.getInterviewAnalytics = async (req, res) => {
  try {
    const interviews = await Interview.find({
      userId: req.user,
      status: "completed",
    });

    const totalCompleted = interviews.length;

    const totalScore = interviews.reduce(
      (sum, item) => sum + (item.score || 0),
      0,
    );

    const averageScore =
      totalCompleted > 0 ? (totalScore / totalCompleted).toFixed(1) : 0;

    const bestScore =
      totalCompleted > 0
        ? Math.max(...interviews.map((item) => item.score || 0))
        : 0;

    const resumeInterviews = interviews.filter(
      (item) => item.interviewType === "resume",
    ).length;

    const standardInterviews = interviews.filter(
      (item) => item.interviewType !== "resume",
    ).length;

    const totalQuestionsAnswered = interviews.reduce(
      (sum, item) => sum + item.questions.length,
      0,
    );

    const roleStats = {};

    interviews.forEach((item) => {
      if (!roleStats[item.role]) {
        roleStats[item.role] = {
          count: 0,
          totalScore: 0,
        };
      }

      roleStats[item.role].count += 1;
      roleStats[item.role].totalScore += item.score || 0;
    });

    const roleWisePerformance = Object.keys(roleStats).map((role) => ({
      role,
      count: roleStats[role].count,
      averageScore: (
        roleStats[role].totalScore / roleStats[role].count
      ).toFixed(1),
    }));

    res.json({
      success: true,
      data: {
        totalCompleted,
        averageScore,
        bestScore,
        resumeInterviews,
        standardInterviews,
        totalQuestionsAnswered,
        roleWisePerformance,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};

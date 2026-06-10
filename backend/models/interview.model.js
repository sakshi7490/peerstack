const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    role: {
      type: String,
      enum: ["frontend", "backend", "aiml", "hr","resume-based"],
      required: true,
    },
    questions: [
      {
        question: String,
        answer: String,
      },
    ],
    feedback: {
  type: String,
},
resumeText: {
  type: String,
  default: "",
},

interviewType: {
  type: String,
  enum: ["standard", "resume"],
  default: "standard",
},
status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending"
  },
    score: {
      type: Number,
      default: 0,
    },
  },
  
  
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);
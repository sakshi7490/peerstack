const OpenAI = require("openai");

let openai;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// GENERATE QUESTIONS
exports.generateQuestions = async (role) => {
  try {
    if (!openai) throw new Error("No API Key");

    const prompt = `Generate 5 interview questions for a ${role} role. Return only questions separated by new lines.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    // Convert STRING → ARRAY
    const text = response.choices[0].message.content;

    return text
      .split("\n")
      .map(q => q.replace(/^\d+\.\s*/, "").trim())
      .filter(q => q !== "");

  } catch (error) {
    console.log("🔥 AI failed → fallback triggered");

    const fallback = {
  frontend: [
    "What is React?",
    "What is Virtual DOM?",
    "Difference between var, let, const?",
    "What are React hooks?",
    "Explain component lifecycle in React"
  ],
  backend: [
    "What is Node.js?",
    "Explain REST API",
    "What is middleware?",
    "What is Express.js?",
    "What is MongoDB?"
  ],
  aiml: [
    "What is Machine Learning?",
    "Supervised vs Unsupervised learning?",
    "What is overfitting?",
    "What is a training dataset?",
    "Explain bias vs variance"
  ],
  hr: [
    "Tell me about yourself",
    "Strengths and weaknesses?",
    "Why should we hire you?",
    "Where do you see yourself in 5 years?",
    "Describe a challenging situation you faced"
  ]
};

    return fallback[role] || fallback["backend"];
  }
};


// 🔥 EVALUATE ANSWERS
exports.evaluateAnswers = async (questions, answers) => {
  try {
    if (!openai) throw new Error("No API Key");

    const prompt = `
    Evaluate the following interview answers.

    Questions: ${questions}
    Answers: ${answers.join("\n")}

    Give:
    - Score out of 10
    - Feedback
    - Suggestions
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content;

  } catch (error) {
    console.log("AI failed, using fallback evaluation");

    // ✅ FALLBACK EVALUATION
    let score = 0;

    answers.forEach((ans) => {
      if (ans.length > 20) score += 2;
      else if (ans.length > 10) score += 1;
    });

    return `
Score: ${score}/10

Feedback:
- Basic understanding detected
- Try to explain concepts more clearly

Suggestions:
- Add real-world examples
- Improve depth of answers
`;
  }
};
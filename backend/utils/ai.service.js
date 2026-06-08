const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

console.log("GEMINI KEY:", process.env.GEMINI_API_KEY);

exports.generateQuestions = async (role) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API key missing");
    }

    const prompt = `
You are an expert interview question generator.

Generate exactly 5 interview questions for a ${role} role.

Rules:
- Questions should be practical and interview-style.
- Keep questions clear and beginner-to-intermediate level.
- Return only a JSON array of strings.
- Do not add markdown.
- Do not add explanation.

Example format:
[
  "What is Node.js?",
  "Explain REST API"
]
`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text;

    // Gemini kabhi-kabhi ```json ``` me response de deta hai
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(text);

  } catch (error) {
    console.log("🔥 Gemini AI failed → fallback triggered");
    console.log(error.message);

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
// 🔥 GENERATE RESUME BASED QUESTIONS
exports.generateResumeQuestions = async (resumeText) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API key missing");
    }

    const prompt = `
You are an expert technical interviewer.

Based on the resume text below, generate exactly 5 personalized interview questions.

Rules:
- Focus on skills, projects, technologies, education, and achievements mentioned in the resume.
- Questions should be practical and interview-style.
- Return only a JSON array of strings.
- Do not add markdown.
- Do not add explanation.

Resume Text:
${resumeText}
`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text;

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(text);

  } catch (error) {
    console.log("Gemini resume AI error:", error.message);

    return [
      "Tell me about the main project mentioned in your resume.",
      "Explain the technologies you used in your project.",
      "What challenges did you face while building your project?",
      "Explain one skill from your resume in detail.",
      "Why should we consider you for this role based on your resume?"
    ];
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
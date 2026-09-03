const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});



//  GENERATE ROLE-BASED QUESTIONS
exports.generateQuestions = async (role) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API key missing");
    }

    const roleMap = {
      frontend: "Frontend Development",
      backend: "Backend Development",
      aiml: "Artificial Intelligence and Machine Learning",
      hr: "Human Resources / HR Interview",
    };

    const selectedRole = roleMap[role.toLowerCase()] || role;

    const prompt = `
You are an expert interviewer.

Generate exactly 5 interview questions for a candidate applying for a ${selectedRole} role.

Rules:
- Questions must be relevant to the selected role.
- Include a mix of beginner and intermediate-level questions.
- Questions should test practical understanding, not only definitions.
- Make the questions interview-style.
- Return ONLY a valid JSON array of 5 strings.
- Do not use markdown.
- Do not add explanations.

Example format:
[
  "What is React and why is it used?",
  "Explain the difference between state and props."
]
`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text;

    // Remove markdown formatting if Gemini adds it
    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const questions = JSON.parse(text);

    // Validate AI response
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Invalid AI response format");
    }

    return questions.slice(0, 5);

  } catch (error) {
    console.error(" Gemini question generation failed:", error.message);

    const fallback = {
      frontend: [
        "What is React?",
        "What is the Virtual DOM?",
        "Explain the difference between var, let, and const.",
        "What are React Hooks?",
        "Explain the React component lifecycle."
      ],

      backend: [
        "What is Node.js?",
        "Explain what a REST API is.",
        "What is middleware in Express.js?",
        "What is Express.js?",
        "What is MongoDB?"
      ],

      aiml: [
        "What is Machine Learning?",
        "Explain the difference between supervised and unsupervised learning.",
        "What is overfitting?",
        "What is a training dataset?",
        "Explain the bias-variance tradeoff."
      ],

      hr: [
        "Tell me about yourself.",
        "What are your strengths and weaknesses?",
        "Why should we hire you?",
        "Where do you see yourself in five years?",
        "Describe a challenging situation you faced and how you handled it."
      ],
    };

    return fallback[role.toLowerCase()] || fallback.backend;
  }
};
//  GENERATE RESUME BASED QUESTIONS
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


//  EVALUATE ANSWERS
exports.evaluateAnswers = async (questions, answers, resumeText = "") => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API key missing");
    }


    const resumeContext = resumeText
      ? `
Candidate Resume Context:
${resumeText}
`
      : "";

    const prompt = `
You are an expert technical interviewer.

${resumeContext}

Evaluate the candidate's interview answers.

Questions:
${JSON.stringify(questions, null, 2)}

Answers:
${JSON.stringify(answers, null, 2)}

Evaluate based on:
1. Technical correctness
2. Depth of explanation
3. Communication clarity
4. Practical examples
5. Resume relevance if resume context is available

Return feedback in the following exact format:

Score: <score>/10

Technical Understanding: <score>/10
Communication Clarity: <score>/10
Answer Depth: <score>/10
Practical Examples: <score>/10

Resume-Based Observations:
- point 1
- point 2

Strengths:
- point 1
- point 2

Weaknesses:
- point 1
- point 2

Suggestions:
- point 1
- point 2

Recommended Learning Path:
1. topic 1
2. topic 2
3. topic 3

Rules:
- Be honest but supportive.
- Keep feedback beginner-friendly.
- Do not write long paragraphs.
- Each bullet point must be short and clear.
- Each bullet point must be maximum 1 sentence.
- Resume-Based Observations must contain exactly 2 bullet points.
- Strengths must contain exactly 3 bullet points.
- Weaknesses must contain exactly 3 bullet points.
- Suggestions must contain exactly 3 bullet points.
- Recommended Learning Path must contain exactly 3 numbered topics.
- If resume context is available, mention relevant resume skills/projects in Resume-Based Observations.
- If resume context is not available, write exactly:
Resume-Based Observations:
- No resume context was provided for this interview.
- Do not add extra headings outside the given format.
`;

    const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text;

  } catch (error) {
    console.log("AI failed, using fallback evaluation");

    let score = 0;

    answers.forEach((ans) => {
      if (ans.length > 20) score += 2;
      else if (ans.length > 10) score += 1;
    });

    const hasResume = resumeText && resumeText.trim() !== "";

    return `
Score: ${score}/10

Technical Understanding: ${Math.min(score, 10)}/10
Communication Clarity: ${Math.min(score + 1, 10)}/10
Answer Depth: ${Math.min(score, 10)}/10
Practical Examples: ${score >= 6 ? 5 : 2}/10

Resume-Based Observations:
${hasResume
  ? `- Candidate resume context was available during evaluation.
- Answers should connect more clearly with the skills and projects mentioned in the resume.`
  : `- No resume context was provided for this interview.`}

Strengths:
- Basic understanding detected
- Attempted to answer the questions

Weaknesses:
- Answers need more depth
- Some explanations are too short

Suggestions:
- Add real-world examples
- Explain concepts step-by-step
- Connect answers with projects and skills mentioned in the resume when relevant

Recommended Learning Path:
1. Revise core concepts of the selected role
2. Practice explaining answers in 4-5 lines
3. Build small practical projects and connect answers with them
`;
  }
};
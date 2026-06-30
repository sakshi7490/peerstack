import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <nav className="home-navbar">
        <h2>PeerStack</h2>

        <div className="home-nav-actions">
          <button onClick={() => navigate("/login")} className="ghost-btn">
            Login
          </button>
          <button onClick={() => navigate("/register")} className="primary-btn">
            Get Started
          </button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">AI-Powered Interview Practice</span>

          <h1>Practice interviews smarter with AI</h1>

          <p>
            PeerStack helps you prepare for technical and HR interviews with
            role-based questions, resume-based interviews, AI feedback, and
            performance analytics.
          </p>

          <div className="hero-actions">
            <button onClick={() => navigate("/register")} className="primary-btn large">
              Start Practicing
            </button>

            <button onClick={() => navigate("/login")} className="secondary-btn large">
              Login
            </button>
          </div>
        </div>

        <div className="hero-card">
          <h3>Interview Analysis</h3>

          <div className="score-preview">
            <span>8.5</span>
            <p>Overall Score</p>
          </div>

          <div className="preview-row">
            <span>Resume-Based Interview</span>
            <b>Completed</b>
          </div>

          <div className="preview-row">
            <span>AI Feedback</span>
            <b>Ready</b>
          </div>

          <div className="preview-row">
            <span>Learning Path</span>
            <b>Generated</b>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Everything you need to improve</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>🎯 Role-Based Interviews</h3>
            <p>Practice Backend, Frontend, AI/ML, and HR interview tracks.</p>
          </div>

          <div className="feature-card">
            <h3>📄 Resume-Based Questions</h3>
            <p>Upload your resume and get personalized AI-generated questions.</p>
          </div>

          <div className="feature-card">
            <h3>🤖 AI Evaluation</h3>
            <p>Get structured feedback, strengths, weaknesses, and suggestions.</p>
          </div>

          <div className="feature-card">
            <h3>📊 Analytics Dashboard</h3>
            <p>Track average score, best score, and role-wise performance.</p>
          </div>
        </div>
      </section>

      <section className="workflow-section">
        <h2>How PeerStack Works</h2>

        <div className="workflow">
          <div>Upload Resume / Select Role</div>
          <span>→</span>
          <div>AI Generates Questions</div>
          <span>→</span>
          <div>Answer Interview</div>
          <span>→</span>
          <div>Get Feedback & Analytics</div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to level up your interview preparation?</h2>
        <p>Start practicing with AI-powered interviews today.</p>

        <button onClick={() => navigate("/register")} className="primary-btn large">
          Create Free Account
        </button>
      </section>
    </div>
  );
}

export default Home;
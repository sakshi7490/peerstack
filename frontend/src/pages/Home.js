import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* ================= NAVBAR ================= */}
      <nav className="home-navbar">

        <div
          className="brand"
          onClick={() => navigate("/")}
        >
          <div className="brand-icon">✦</div>
          <span>PeerStack</span>
        </div>

        <div className="home-nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#why-peerstack">Why PeerStack</a>
        </div>

        <div className="home-nav-actions">
          <button
            onClick={() => navigate("/login")}
            className="nav-login-btn"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="primary-btn nav-cta"
          >
            Get Started
            <span>→</span>
          </button>
        </div>

      </nav>


      {/* ================= HERO ================= */}
      <main>

        <section className="hero-section">

          <div className="hero-content">

            <div className="hero-badge">
              <span className="badge-dot"></span>
              AI-Powered Interview Practice
            </div>

            <h1>
              Practice interviews.
              <br />
              <span>Get better. Get hired.</span>
            </h1>

            <p>
              Simulate real technical and HR interviews with AI.
              Practice role-based questions, get personalized feedback,
              and track your progress — all in one place.
            </p>

            <div className="hero-actions">

              <button
                onClick={() => navigate("/register")}
                className="primary-btn hero-primary-btn"
              >
                Start Practicing
                <span>→</span>
              </button>

              <button
                onClick={() => navigate("/login")}
                className="secondary-btn hero-secondary-btn"
              >
                Login to PeerStack
              </button>

            </div>

            <div className="hero-trust">

              <div className="trust-item">
                <span className="trust-icon">✦</span>
                AI-powered feedback
              </div>

              <div className="trust-item">
                <span className="trust-icon">✓</span>
                Resume-based practice
              </div>

              <div className="trust-item">
                <span className="trust-icon">↗</span>
                Performance analytics
              </div>

            </div>

          </div>


          {/* ================= PRODUCT PREVIEW ================= */}
          <div className="hero-visual">

            <div className="glow glow-one"></div>
            <div className="glow glow-two"></div>

            <div className="dashboard-preview">

              {/* Dashboard top bar */}
              <div className="preview-topbar">

                <div className="preview-brand">
                  <div className="mini-brand-icon">✦</div>
                  <span>PeerStack</span>
                </div>

                <div className="preview-top-actions">
                  <span className="preview-notification">●</span>
                  <div className="preview-avatar">S</div>
                </div>

              </div>


              <div className="preview-body">

                {/* Mini sidebar */}
                <aside className="preview-sidebar">

                  <div className="sidebar-item active">
                    <span>⌂</span>
                    Dashboard
                  </div>

                  <div className="sidebar-item">
                    <span>◉</span>
                    Interviews
                  </div>

                  <div className="sidebar-item">
                    <span>↗</span>
                    Analytics
                  </div>

                  <div className="sidebar-item">
                    <span>◌</span>
                    History
                  </div>

                </aside>


                {/* Main dashboard */}
                <div className="preview-main">

                  <div className="preview-heading">
                    <div>
                      <span className="preview-small-text">
                        INTERVIEW ANALYSIS
                      </span>

                      <h3>Your performance</h3>
                    </div>

                    <span className="preview-status">
                      ● Excellent
                    </span>
                  </div>


                  {/* Score cards */}
                  <div className="preview-stats">

                    <div className="preview-stat-card">
                      <span>Overall Score</span>
                      <strong>86%</strong>
                      <small>↑ 12% this month</small>
                    </div>

                    <div className="preview-stat-card">
                      <span>Interviews</span>
                      <strong>12</strong>
                      <small>+3 this week</small>
                    </div>

                  </div>


                  {/* Performance card */}
                  <div className="performance-card">

                    <div className="performance-header">
                      <span>Skill performance</span>
                      <span className="performance-period">
                        This month ▾
                      </span>
                    </div>

                    <div className="skill-row">
                      <div>
                        <span>Technical Skills</span>
                        <div className="progress-track">
                          <div
                            className="progress-fill"
                            style={{ width: "92%" }}
                          ></div>
                        </div>
                      </div>

                      <strong>92%</strong>
                    </div>

                    <div className="skill-row">
                      <div>
                        <span>Problem Solving</span>
                        <div className="progress-track">
                          <div
                            className="progress-fill"
                            style={{ width: "88%" }}
                          ></div>
                        </div>
                      </div>

                      <strong>88%</strong>
                    </div>

                    <div className="skill-row">
                      <div>
                        <span>Communication</span>
                        <div className="progress-track">
                          <div
                            className="progress-fill"
                            style={{ width: "84%" }}
                          ></div>
                        </div>
                      </div>

                      <strong>84%</strong>
                    </div>

                  </div>


                  {/* AI feedback */}
                  <div className="ai-feedback-card">

                    <div className="ai-feedback-icon">
                      ✦
                    </div>

                    <div>
                      <span>AI INSIGHT</span>
                      <p>
                        Strong technical performance. Focus on
                        explaining your solutions more clearly.
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ================= TRUST STRIP ================= */}
        <section className="trust-strip">

          <p>Everything you need to prepare with confidence</p>

          <div className="trust-features">

            <span>
              <b>✦</b> AI-powered
            </span>

            <span>
              <b>✓</b> Personalized
            </span>

            <span>
              <b>◈</b> Data-driven
            </span>

            <span>
              <b>∞</b> Practice anytime
            </span>

          </div>

        </section>


        {/* ================= FEATURES ================= */}
        <section
          className="features-section"
          id="features"
        >

          <div className="section-heading">

            <span className="section-label">
              FEATURES
            </span>

            <h2>
              Everything you need to
              <span> ace your next interview.</span>
            </h2>

            <p>
              From your first practice session to your final
              preparation, PeerStack helps you improve every step
              of the way.
            </p>

          </div>


          <div className="feature-grid">

            <div className="feature-card feature-card-large">

              <div className="feature-icon purple-icon">
                ◈
              </div>

              <h3>Role-Based Interviews</h3>

              <p>
                Practice interviews tailored to the role you're
                preparing for — Frontend, Backend, AI/ML and HR.
              </p>

              <div className="role-tags">
                <span>Frontend</span>
                <span>Backend</span>
                <span>AI / ML</span>
                <span>HR</span>
              </div>

            </div>


            <div className="feature-card">

              <div className="feature-icon blue-icon">
                ↗
              </div>

              <h3>Resume-Based Questions</h3>

              <p>
                Upload your resume and let AI create questions
                specifically around your skills and projects.
              </p>

              <div className="mini-resume">
                <div className="resume-line long"></div>
                <div className="resume-line medium"></div>
                <div className="resume-line short"></div>
              </div>

            </div>


            <div className="feature-card">

              <div className="feature-icon green-icon">
                ✦
              </div>

              <h3>AI-Powered Evaluation</h3>

              <p>
                Get structured feedback on your answers with
                strengths, weaknesses and actionable suggestions.
              </p>

              <div className="mini-score">
                <strong>86%</strong>
                <span>Overall Score</span>
              </div>

            </div>


            <div className="feature-card">

              <div className="feature-icon orange-icon">
                ↗
              </div>

              <h3>Performance Analytics</h3>

              <p>
                Track your scores, identify weak areas and
                understand how your interview performance changes
                over time.
              </p>

              <div className="mini-chart">
                <div style={{ height: "35%" }}></div>
                <div style={{ height: "55%" }}></div>
                <div style={{ height: "45%" }}></div>
                <div style={{ height: "72%" }}></div>
                <div style={{ height: "65%" }}></div>
                <div style={{ height: "88%" }}></div>
                <div style={{ height: "95%" }}></div>
              </div>

            </div>

          </div>

        </section>


        {/* ================= HOW IT WORKS ================= */}
        <section
          className="workflow-section"
          id="how-it-works"
        >

          <div className="section-heading">

            <span className="section-label">
              HOW IT WORKS
            </span>

            <h2>
              From practice to
              <span> interview-ready.</span>
            </h2>

            <p>
              A simple four-step process designed to make
              interview preparation more effective.
            </p>

          </div>


          <div className="workflow">

            <div className="workflow-step">

              <div className="step-number">
                01
              </div>

              <div className="step-line"></div>

              <h3>Choose your path</h3>

              <p>
                Select an interview role or upload your resume
                for personalized practice.
              </p>

            </div>


            <div className="workflow-step">

              <div className="step-number">
                02
              </div>

              <div className="step-line"></div>

              <h3>Take the interview</h3>

              <p>
                Answer realistic questions in a simulated
                interview environment.
              </p>

            </div>


            <div className="workflow-step">

              <div className="step-number">
                03
              </div>

              <div className="step-line"></div>

              <h3>Get AI feedback</h3>

              <p>
                Receive detailed evaluation of your answers
                and interview performance.
              </p>

            </div>


            <div className="workflow-step">

              <div className="step-number">
                04
              </div>

              <h3>Improve & repeat</h3>

              <p>
                Use your insights to improve and come back
                stronger for your next interview.
              </p>

            </div>

          </div>

        </section>


        {/* ================= WHY PEERSTACK ================= */}
        <section
          className="why-section"
          id="why-peerstack"
        >

          <div className="why-content">

            <span className="section-label">
              WHY PEERSTACK
            </span>

            <h2>
              Don't just practice.
              <span> Practice with purpose.</span>
            </h2>

            <p>
              Random interview questions aren't enough. PeerStack
              helps you understand where you're strong, where
              you're struggling, and what you should work on next.
            </p>

            <div className="why-points">

              <div>
                <span>✓</span>
                Personalized interview experience
              </div>

              <div>
                <span>✓</span>
                AI-generated actionable feedback
              </div>

              <div>
                <span>✓</span>
                Progress tracking over time
              </div>

              <div>
                <span>✓</span>
                Practice for multiple job roles
              </div>

            </div>

          </div>


          <div className="why-card">

            <div className="why-card-header">
              <span>YOUR PROGRESS</span>
              <span className="live-dot">● Live</span>
            </div>

            <div className="big-score">
              <strong>86%</strong>
              <span>Overall Performance</span>
            </div>

            <div className="progress-item">
              <div>
                <span>Technical</span>
                <strong>92%</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: "92%" }}
                ></div>
              </div>
            </div>

            <div className="progress-item">
              <div>
                <span>Problem Solving</span>
                <strong>88%</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: "88%" }}
                ></div>
              </div>
            </div>

            <div className="progress-item">
              <div>
                <span>Communication</span>
                <strong>84%</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: "84%" }}
                ></div>
              </div>
            </div>

          </div>

        </section>


        {/* ================= CTA ================= */}
        <section className="cta-section">

          <div className="cta-glow"></div>

          <span className="section-label">
            START YOUR PREPARATION
          </span>

          <h2>
            Your next interview
            <br />
            <span>starts here.</span>
          </h2>

          <p>
            Practice smarter, understand your weaknesses,
            and walk into your next interview with confidence.
          </p>

          <button
            onClick={() => navigate("/register")}
            className="primary-btn cta-btn"
          >
            Create Free Account
            <span>→</span>
          </button>

        </section>

      </main>


      {/* ================= FOOTER ================= */}
      <footer className="home-footer">

        <div className="footer-brand">

          <div className="brand">
            <div className="brand-icon">✦</div>
            <span>PeerStack</span>
          </div>

          <p>
            AI-powered interview preparation
            for the next generation of developers.
          </p>

        </div>

        <div className="footer-links">

          <div>
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
          </div>

          <div>
            <h4>Account</h4>
            <button onClick={() => navigate("/login")}>
              Login
            </button>

            <button onClick={() => navigate("/register")}>
              Get Started
            </button>
          </div>

        </div>

        <div className="footer-bottom">
          <span>© 2026 PeerStack</span>
          <span>Built for better interviews.</span>
        </div>

      </footer>

    </div>
  );
}

export default Home;
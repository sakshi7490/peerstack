import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import API from "../services/api";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");

    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      setShowResend(false);

      toast.success("Login successful..");
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.message;

      if (message === "Please verify your email before logging in.") {
        toast.error(message);
        return;
      }

      toast.error(message || "Invalid email or password ");
    } finally {
      setLoading(false);
    }
  };

  //handling resend verification

  const handleResendVerification = async () => {
    if (!email) {
      return toast.error("Please enter your email first");
    }

    try {
      setResendLoading(true);

      const res = await API.post("/auth/resend-verification", {
        email,
      });

      toast.success(res.data.message || "Verification email sent!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to resend verification email",
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* =========================
          LEFT BRANDING SECTION
      ========================= */}
      <section className="auth-visual">
        <div className="auth-logo" onClick={() => navigate("/")}>
          <div className="auth-logo-icon">✦</div>
          <span>PeerStack</span>
        </div>

        <div className="auth-visual-content">
          <span className="auth-badge">✦ AI-Powered Interview Practice</span>

          <h1>
            Practice smarter.
            <br />
            <span>Get interview-ready.</span>
          </h1>

          <p>
            Simulate real technical and HR interviews, get personalized AI
            feedback, and track your progress — all in one place.
          </p>

          <div className="auth-highlights">
            <div className="auth-highlight">
              <span>✦</span>
              <div>
                <strong>AI-Powered Feedback</strong>
                <small>Improve with every answer</small>
              </div>
            </div>

            <div className="auth-highlight">
              <span>✓</span>
              <div>
                <strong>Resume-Based Practice</strong>
                <small>Questions tailored to your profile</small>
              </div>
            </div>

            <div className="auth-highlight">
              <span>↗</span>
              <div>
                <strong>Performance Analytics</strong>
                <small>Track your interview progress</small>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-visual-footer">© 2026 PeerStack</div>
      </section>

      {/* =========================
          RIGHT LOGIN SECTION
      ========================= */}
      <section className="auth-form-section">
        <div className="auth-container">
          <div className="mobile-logo">
            <div className="auth-logo-icon">✦</div>
            <span>PeerStack</span>
          </div>

          <div className="auth-heading">
            <h2>Welcome back</h2>

            <p>Continue your interview preparation</p>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
            {/* Email */}
            <div className="input-group">
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="input-group">
              <div className="password-label-row">
                <label htmlFor="password">Password</label>

                <span className="forgot-password">Forgot password?</span>
              </div>

              <input
                id="password"
                className="auth-input"
                type="password"
                placeholder="Enter your password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Remember Me */}
            <label className="remember-row">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />

              <span>Remember me</span>
            </label>

            {/* Login Button */}
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? (
                "Logging in..."
              ) : (
                <>
                  Login
                  <span>→</span>
                </>
              )}
            </button>

            {showResend && (
              <div className="resend-verification">
                <span>Didn't receive the verification email?</span>

                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                >
                  {resendLoading ? "Sending..." : "Resend verification email"}
                </button>
              </div>
            )}
          </form>

          {/* Register */}
          <p className="auth-footer">
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")}>Create one</span>
          </p>

          {/* Back to Home */}
          <button className="back-home" onClick={() => navigate("/")}>
            ← Back to home
          </button>
        </div>
      </section>
    </div>
  );
}

export default Login;

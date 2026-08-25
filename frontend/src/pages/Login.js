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
  const [showPassword, setShowPassword] = useState(false);
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

              <div className="password-input-wrapper">
                <input
                  id="password"
                  className="auth-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    // Eye off
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                      <path d="M9.9 5.1A9.8 9.8 0 0 1 12 4.8c5 0 8.7 4.1 10 7.2-1.3 3.1-5 7.2-10 7.2a9.8 9.8 0 0 1-5.4-1.6" />
                      <path d="M6.6 6.6A13.5 13.5 0 0 0 2 12c1.3 3.1 5 7.2 10 7.2" />
                    </svg>
                  ) : (
                    // Eye
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
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

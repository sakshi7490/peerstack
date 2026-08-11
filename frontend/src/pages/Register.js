import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", {
        username: name,
        email,
        password,
      });

      toast.success("Registered successfully");
      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="register-page">
      <div className="auth-container">

        <div className="auth-icon">
          ✦
        </div>

        <h2 className="auth-title">Create Account</h2>

        <p className="auth-subtitle">
          Join PeerStack and start your interview journey
        </p>

        <form className="auth-form" onSubmit={handleRegister}>

          <div className="auth-field">
            <label>Username</label>

            <input
              className="auth-input"
              type="text"
              placeholder="Enter your username"
              value={name}
              autoComplete="username"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Email Address</label>

            <input
              className="auth-input"
              type="email"
              placeholder="Enter your email address"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>Password</label>

            <input
              className="auth-input"
              type="password"
              placeholder="Create a strong password"
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="auth-btn" type="submit">
            Register <span>→</span>
          </button>

        </form>

        <div className="auth-divider">
          <span></span>
          <p>or</p>
          <span></span>
        </div>

        <p className="auth-footer">
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Register;
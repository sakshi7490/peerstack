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
    e.preventDefault(); // ✅ important (form reload rokne ke liye)

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      toast.success("Registered successfully");
      navigate("/");
    } catch (err) {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Create Account</h2>

      <form className="auth-form" onSubmit={handleRegister}>
        <input
          className="auth-input"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="auth-input"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="auth-btn" type="submit">
          Register
        </button>
      </form>

      <p className="auth-footer">
        Already have an account?{" "}
        <span onClick={() => navigate("/")}>Login</span>
      </p>
    </div>
  );
}

export default Register;
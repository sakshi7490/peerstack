import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // ✅ prevent page reload

    if (!email || !password) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);

      toast.success("Login successful 🎉");
      navigate("/dashboard");

    } catch (err) {
      toast.error("Invalid email or password ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Continue your interview journey</h2>

      <form className="auth-form" onSubmit={handleLogin}>
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

        <button className="auth-btn" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="auth-footer">
        Don’t have an account?{" "}
        <span onClick={() => navigate("/register")}>Register</span>
      </p>
    </div>
  );
}

export default Login;
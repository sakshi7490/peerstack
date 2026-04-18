import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import "../styles/login.css";

function Login() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  try {
    setLoading(true); //  start loading

    const res = await API.post("/auth/login", { email, password });

    localStorage.setItem("token", res.data.token);

    toast.success("Login successful 🎉");

    navigate("/dashboard");

  } catch (err) {
    toast.error("Invalid email or password ❌");
  } finally {
    setLoading(false); //  stop loading
  }
};

  return (
  <div className="container">
    <h2>Login</h2>

    <input
      className="input"
      placeholder="Email"
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      className="input"
      type="password"
      placeholder="Password"
      onChange={(e) => setPassword(e.target.value)}
    />

    <button className="button" onClick={handleLogin} disabled={loading}>
      {loading ? "Logging in..." : "Login"}
    </button>

    <p style={{ marginTop: "15px" }}>
      Don’t have an account?{" "}
      <span
        className="link"
        onClick={() => (navigate("/register"))}
      >
        Register
      </span>
    </p>
  </div>
);
}

export default Login;
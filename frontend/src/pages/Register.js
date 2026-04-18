import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import "../styles/register.css";

function Register() {

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
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
  <div className="container">
    <h2>Register</h2>

    <input
      className="input"
      placeholder="Name"
      onChange={(e) => setName(e.target.value)}
    />

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

    <button className="button" onClick={handleRegister}>
      Register
    </button>

    <p style={{ marginTop: "15px" }}>
      Already have an account?{" "}
      <span
        className="link"
        onClick={() => (window.location.href = "/")}
      >
        Login
      </span>
    </p>
  </div>
);
}

export default Register;
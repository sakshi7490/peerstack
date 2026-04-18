import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    
    <div className="navbar">
      <h2 className="logo">PeerStack</h2>
      

      <div className="nav-right">
        <button onClick={() => navigate("/dashboard")} className="nav-btn">
            Dashboard
        </button>

        <button onClick={handleLogout} className="logout-btn">
        Logout
        </button>
    </div>
    </div>
  );
}

export default Navbar;
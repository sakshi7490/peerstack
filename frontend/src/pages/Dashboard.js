import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import "../styles/dashboard.css";
import "../styles/result.css";


function Dashboard() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("backend");
  const [interviews, setInterviews] = useState([]);

  // Fetch past interviews
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await API.get("/interview");
        setInterviews(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchInterviews();
  }, []);

  
  const startInterview = async () => {
  try {
    setLoading(true); // 🔥 START loading

    const res = await API.post("/interview/start", { role });

    // success
    toast.success("Interview Started 🚀");

    // redirect
    navigate(`/interview/${res.data.data._id}`);

  } catch (err) {
    toast.error("Failed to start interview ❌");
  } finally {
    setLoading(false); // 🔥 STOP loading
  }
};

  return (
  <>
    <Navbar />

    <div className="dashboard-container">
      
      {/* 🔥 Header */}
      <div className="dashboard-header">
        <h2> Your Interview Space</h2>
        <p>Track, practice, and improve</p>
      </div>
      <div className="header-line"></div>

      {/* 🔥 Start Interview Card */}
      <div className="start-card">
        <h3>Start New Interview</h3>

        <div className="start-controls">
          <select onChange={(e) => setRole(e.target.value)}>
            <option value="backend">Backend</option>
            <option value="frontend">Frontend</option>
            <option value="aiml">AI/ML</option>
            <option value="hr">HR</option>
          </select>

          <button onClick={startInterview} disabled={loading}>
            {loading ? "Starting..." : "Start Interview"}
          </button>
        </div>
      </div>

      {/* 🔥 History */}
      <h3 className="section-title">Your Interviews</h3>

      <div className="card-grid">
        {interviews.length === 0 ? (
          <p className="empty">No interviews yet</p>
        ) : (
          interviews.map((item, index) => (
            <motion.div
              key={item._id}
              className="interview-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => {
                if (item.status === "completed") {
                navigate(`/result/${item._id}`);
                } else {
                    navigate(`/interview/${item._id}`);
                  }
                }}
            >
              <div className="card-top">
                <h4>{item.role.toUpperCase()}</h4>

                <div className="status">
                  <span
                    className={`dot ${
                      item.status === "completed" ? "green" : "orange"
                    }`}
                  ></span>
                  {item.status}
                </div>
              </div>

              <div className="card-body">
                <p>
                  <b>Score:</b>{" "}
                  {item.status === "completed"
                    ? `${item.score}/10`
                    : "Not evaluated"}
                </p>

                <p><b>Questions:</b> {item.questions.length}</p>
              </div>

              <div className="card-footer">
                {item.status === "completed"
                  ? "View Result →"
                  : "Complete Interview"}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  </>
);
}

export default Dashboard;
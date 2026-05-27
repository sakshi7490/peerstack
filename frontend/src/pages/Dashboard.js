import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ResumeUploadCard from "../components/ResumeUploadCard";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("backend");
  const [interviews, setInterviews] = useState([]);

  // 🔥 Fetch past interviews
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await API.get("/interview");

        // ✅ normalize status (important fix)
        const updated = res.data.data.map((item) => ({
          ...item,
          status: item.feedback ? "completed" : "pending",
        }));

        setInterviews(updated);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load interviews");
      }
    };

    fetchInterviews();
  }, []);

  // 🚀 Start Interview
  const startInterview = async () => {
    try {
      setLoading(true);

      const res = await API.post("/interview/start", { role });

      toast.success("Interview Started 🚀");

      navigate(`/interview/${res.data.data._id}`);
    } catch (err) {
      toast.error("Failed to start interview ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        
        {/* 🔥 Header */}
        <div className="dashboard-header">
          <h2>Level Up Your Skills</h2>
          <p>Practice , Analyze & Improve</p>
        </div>

        {/* 🔥 Start Interview */}
        <div className="start-card">
          <h3>Begin AI Mock Interview</h3>

          <div className="start-controls">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
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

        <ResumeUploadCard />

        {/* 🔥 History */}
        <h3 className="section-title">Your Interviews</h3>

        <div className="card-grid">
          {interviews.length === 0 ? (
            <p className="empty">No interviews yet. Start one 🚀</p>
          ) : (
            interviews.map((item, index) => (
              <motion.div
                key={item._id}
                className="interview-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ scale: 1.04 }}
                onClick={() => {
                  navigate(
                    item.status === "completed"
                      ? `/result/${item._id}`
                      : `/interview/${item._id}`
                  );
                }}
              >
                {/* 🔝 Top */}
                <div className="card-top">
                  <h4>{item.role.toUpperCase()}</h4>

                  <span className={`badge ${item.status}`}>
                    {item.status}
                  </span>
                </div>

                {/* 📊 Body */}
                <div className="card-body">
                  <p>
                    <b>Score:</b>{" "}
                    {item.status === "completed"
                      ? `${item.score}/10`
                      : "-"}
                  </p>

                  <p>
                    <b>Questions:</b>{" "}
                    {item.questions?.length || 0}
                  </p>
                </div>

                {/* 🔗 Footer */}
                <div className="card-footer">
                  {item.status === "completed"
                    ? "View Result →"
                    : "Continue Interview →"}
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
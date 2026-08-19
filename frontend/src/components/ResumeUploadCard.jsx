import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import "../styles/resumeUpload.css";

function ResumeUploadCard() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    // Only PDF
    if (selectedFile.type !== "application/pdf") {
      toast.error("Please upload a PDF resume");
      return;
    }

    setFile(selectedFile);
  };

  const handleStartInterview = async () => {
    if (!file) {
      toast.error("Please upload your resume first");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", file);

      const res = await API.post(
        "/interview/upload-resume",
        formData
      );

      toast.success("Resume interview started 🚀");

      navigate(`/interview/${res.data.data._id}`);

    } catch (err) {
      console.log("RESUME UPLOAD ERROR:", err);

      toast.error(
        err.response?.data?.message ||
        "Failed to start resume interview"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-card">
      <div className="resume-content">

        <div className="resume-heading">
          <div className="resume-title-icon">📄</div>

          <div>
            <h3>Resume-Based Interview</h3>

            <p>
              Upload your resume and get AI-generated
              personalized interview questions.
            </p>
          </div>
        </div>

        {/* Upload Box */}
        <label className="upload-box">
          <input
            type="file"
            accept=".pdf,application/pdf"
            hidden
            onChange={handleFileChange}
          />

          <div className="upload-inner">

            <div className="upload-icon">
              📄
            </div>

            <h4>
              {file ? "Resume Selected" : "Upload Resume"}
            </h4>

            <span>
              {file
                ? file.name
                : "Choose your PDF resume to begin"}
            </span>

          </div>
        </label>

        {/* Selected File */}
        {file && (
          <div className="file-preview">
            <span>✓</span>

            <div>
              <strong>{file.name}</strong>
              <small>PDF Resume</small>
            </div>
          </div>
        )}

        {/* Start Button */}
        <button
          className="resume-btn"
          onClick={handleStartInterview}
          disabled={!file || loading}
        >
          {loading
            ? "Preparing Interview..."
            : "Start Resume Interview →"}
        </button>

      </div>
    </div>
  );
}

export default ResumeUploadCard;
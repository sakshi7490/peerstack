import React, { useState } from "react";
import "../styles/resumeUpload.css";

function ResumeUploadCard() {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <div className="resume-card">
      
      <div className="resume-content">
        <h3>Resume-Based Interview</h3>

        <p>
          Upload your resume and get AI-generated personalized interview questions.
        </p>

        {/* Upload Box */}
        <label className="upload-box">
          <input
            type="file"
            accept=".pdf"
            hidden
            onChange={handleFileChange}
          />

          <div className="upload-inner">
            <div className="upload-icon">📄</div>

            <h4>Upload Resume</h4>

            <span>
              Drag & drop your PDF resume here or click to browse
            </span>
          </div>
        </label>

        {/* File Preview */}
        {fileName && (
          <div className="file-preview">
            ✅ {fileName}
          </div>
        )}

        <button
          className="resume-btn"
          disabled={!fileName}
        >
          Start Resume Interview
        </button>
      </div>
    </div>
  );
}

export default ResumeUploadCard;
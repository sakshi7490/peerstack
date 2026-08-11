import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import "../styles/auth.css";

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await API.get(`/auth/verify-email/${token}`);

        if (res.data.success) {
          setVerified(true);
          toast.success("Email verified successfully! 🎉");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Verification link is invalid or expired."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <div className="auth-container verify-container">
        <div className="verify-icon">⏳</div>

        <h2 className="auth-title">
          Verifying your email...
        </h2>

        <p className="verify-text">
          Please wait while we verify your email address.
        </p>
      </div>
    );
  }

  return (
    <div className="auth-container verify-container">
      {verified ? (
        <>
          <div className="verify-icon">✓</div>

          <h2 className="auth-title">
            Email Verified!
          </h2>

          <p className="verify-text">
            Your PeerStack account is now verified.
            You can login and start practicing interviews.
          </p>

          <button
            className="auth-btn"
            onClick={() => navigate("/login")}
          >
            Continue to Login
          </button>
        </>
      ) : (
        <>
          <div className="verify-icon">⚠️</div>

          <h2 className="auth-title">
            Verification Failed
          </h2>

          <p className="verify-text">
            This verification link is invalid or has expired.
            Please request a new verification email.
          </p>

          <button
            className="auth-btn"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </>
      )}
    </div>
  );
}

export default VerifyEmail;
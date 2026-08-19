const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");


// =====================================================
// EMAIL TRANSPORTER
// =====================================================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// =====================================================
// REGISTER
// =====================================================

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // Generate verification token
    const verificationToken = crypto
      .randomBytes(32)
      .toString("hex");

    // Hash token before storing in database
    const hashedVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    // Token expires in 15 minutes
    const verificationExpiry =
      Date.now() + 15 * 60 * 1000;

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,

      isEmailVerified: false,

      emailVerificationToken:
        hashedVerificationToken,

      emailVerificationExpires:
        verificationExpiry,
    });

    // Verification URL
    const verificationUrl =
      `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    // Send verification email
    const mailOptions = {
      from: `"PeerStack" <${process.env.EMAIL_USER}>`,

      to: user.email,

      subject: "Verify your PeerStack email",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 40px;
          background: #f8f9ff;
        ">

          <div style="
            background: white;
            padding: 35px;
            border-radius: 16px;
            border: 1px solid #e5e7eb;
          ">

            <h1 style="
              color: #111827;
              margin-bottom: 10px;
            ">
              Welcome to PeerStack!
            </h1>

            <p style="
              color: #64748b;
              font-size: 16px;
              line-height: 1.6;
            ">
              Hi ${user.username},
            </p>

            <p style="
              color: #64748b;
              font-size: 16px;
              line-height: 1.6;
            ">
              Thanks for creating your PeerStack account.
              Please verify your email address to activate
              your account.
            </p>

            <div style="margin: 30px 0;">

              <a
                href="${verificationUrl}"
                style="
                  display: inline-block;
                  padding: 14px 24px;
                  background: #635bff;
                  color: white;
                  text-decoration: none;
                  border-radius: 10px;
                  font-weight: bold;
                "
              >
                Verify Email →
              </a>

            </div>

            <p style="
              color: #94a3b8;
              font-size: 13px;
              line-height: 1.5;
            ">
              This verification link will expire in
              15 minutes.
            </p>

            <p style="
              color: #94a3b8;
              font-size: 13px;
            ">
              If you didn't create a PeerStack account,
              you can safely ignore this email.
            </p>

          </div>

        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Response
    res.status(201).json({
      success: true,

      message:
        "Registration successful. Please check your email to verify your account.",

      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (err) {

    console.log("REGISTER ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================================
// VERIFY EMAIL
// =====================================================

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Hash token received from URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    // Token invalid or expired
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification link.",
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;

    // Remove verification token
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });

  } catch (error) {
    console.log("VERIFY EMAIL ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// RESEND VERIFICATION EMAIL
// =====================================================

exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email.",
      });
    }

    // Already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified. Please login.",
      });
    }

    // Generate new verification token
    const verificationToken = crypto
      .randomBytes(32)
      .toString("hex");

    // Hash token before storing
    const hashedVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    // New expiry: 15 minutes
    const verificationExpiry =
      Date.now() + 15 * 60 * 1000;

    // Replace old token with new token
    user.emailVerificationToken =
      hashedVerificationToken;

    user.emailVerificationExpires =
      verificationExpiry;

    await user.save();

    // New verification URL
    const verificationUrl =
      `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    // Send new email
    const mailOptions = {
      from: `"PeerStack" <${process.env.EMAIL_USER}>`,

      to: user.email,

      subject: "Verify your PeerStack email",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 40px;
          background: #f8f9ff;
        ">

          <div style="
            background: white;
            padding: 35px;
            border-radius: 16px;
            border: 1px solid #e5e7eb;
          ">

            <h1 style="
              color: #111827;
              margin-bottom: 10px;
            ">
              Verify your PeerStack email
            </h1>

            <p style="
              color: #64748b;
              font-size: 16px;
              line-height: 1.6;
            ">
              Hi ${user.username},
            </p>

            <p style="
              color: #64748b;
              font-size: 16px;
              line-height: 1.6;
            ">
              Your previous verification link has expired or
              you requested a new one.
              Click the button below to verify your email.
            </p>

            <div style="margin: 30px 0;">

              <a
                href="${verificationUrl}"
                style="
                  display: inline-block;
                  padding: 14px 24px;
                  background: #635bff;
                  color: white;
                  text-decoration: none;
                  border-radius: 10px;
                  font-weight: bold;
                "
              >
                Verify Email →
              </a>

            </div>

            <p style="
              color: #94a3b8;
              font-size: 13px;
              line-height: 1.5;
            ">
              This verification link will expire in 15 minutes.
            </p>

          </div>

        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message:
        "A new verification email has been sent.",
    });

  } catch (error) {
    console.log("RESEND VERIFICATION ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// FORGOT PASSWORD
// =====================================================

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    // Security: don't reveal whether email exists
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store only hashed token in database
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token expires in 15 minutes
    const resetExpiry = new Date(Date.now() + 15 * 60 * 1000);

    user.passwordResetToken = hashedResetToken;
    user.passwordResetExpires = resetExpiry;

    await user.save();

    console.log("RESET TOKEN:", resetToken);
console.log("HASHED TOKEN:", hashedResetToken);
console.log("SAVED USER:", user);

    // Frontend reset URL
    const resetUrl =
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"PeerStack" <${process.env.EMAIL_USER}>`,

      to: user.email,

      subject: "Reset your PeerStack password",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 40px;
          background: #f8f9ff;
        ">

          <div style="
            background: white;
            padding: 35px;
            border-radius: 16px;
            border: 1px solid #e5e7eb;
          ">

            <h1 style="
              color: #111827;
              margin-bottom: 10px;
            ">
              Reset your password
            </h1>

            <p style="
              color: #64748b;
              font-size: 16px;
              line-height: 1.6;
            ">
              Hi ${user.username},
            </p>

            <p style="
              color: #64748b;
              font-size: 16px;
              line-height: 1.6;
            ">
              We received a request to reset your PeerStack
              password. Click the button below to create a
              new password.
            </p>

            <div style="margin: 30px 0;">

              <a
                href="${resetUrl}"
                style="
                  display: inline-block;
                  padding: 14px 24px;
                  background: #635bff;
                  color: white;
                  text-decoration: none;
                  border-radius: 10px;
                  font-weight: bold;
                "
              >
                Reset Password →
              </a>

            </div>

            <p style="
              color: #94a3b8;
              font-size: 13px;
              line-height: 1.5;
            ">
              This password reset link will expire in 15 minutes.
            </p>

            <p style="
              color: #94a3b8;
              font-size: 13px;
              line-height: 1.5;
            ">
              If you did not request a password reset,
              you can safely ignore this email.
            </p>

          </div>

        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });

  } catch (error) {
    console.log("FORGOT PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};



// =====================================================
// RESET PASSWORD
// =====================================================

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Hash token received from URL
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with valid token and non-expired token
    console.log("TOKEN FROM URL:", token);
console.log("HASHED TOKEN:", hashedResetToken);

const userByToken = await User.findOne({
  passwordResetToken: hashedResetToken,
});

console.log("USER FOUND BY TOKEN:", userByToken);

if (!userByToken) {
  return res.status(400).json({
    success: false,
    message: "Token does not match any user",
  });
}

console.log("TOKEN EXPIRY:", userByToken.passwordResetExpires);
console.log("CURRENT TIME:", new Date());

if (userByToken.passwordResetExpires < Date.now()) {
  return res.status(400).json({
    success: false,
    message: "Reset token has expired",
  });
}

const user = userByToken;
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset link",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    user.password = hashedPassword;

    // Invalidate reset token after successful use
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now login.",
    });

  } catch (error) {
    console.log("RESET PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};


// =====================================================
// LOGIN
// =====================================================

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
// checkemail verification
    if (!user.isEmailVerified) {
  return res.status(403).json({
    success: false,
    message: "Please verify your email before logging in.",
  });
}

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// =====================================================
// FORGOT PASSWORD
// =====================================================

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    /*
      Security:
      We don't tell the user whether the email exists.
    */

    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    // Generate random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before storing it
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token expires in 15 minutes
    const expiryTime = Date.now() + 15 * 60 * 1000;

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = expiryTime;

    await user.save();

    // Frontend reset URL
    const resetUrl =
      `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Email
    const mailOptions = {
      from: `"PeerStack" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset your PeerStack password",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 40px;
          background: #f8f9ff;
        ">

          <div style="
            background: white;
            padding: 35px;
            border-radius: 16px;
            border: 1px solid #e5e7eb;
          ">

            <h1 style="
              color: #111827;
              margin-bottom: 10px;
            ">
              Reset your PeerStack password
            </h1>

            <p style="
              color: #64748b;
              font-size: 16px;
              line-height: 1.6;
            ">
              Hi ${user.username},
            </p>

            <p style="
              color: #64748b;
              font-size: 16px;
              line-height: 1.6;
            ">
              We received a request to reset your PeerStack password.
              Click the button below to create a new password.
            </p>

            <div style="margin: 30px 0;">

              <a
                href="${resetUrl}"
                style="
                  display: inline-block;
                  padding: 14px 24px;
                  background: #635bff;
                  color: white;
                  text-decoration: none;
                  border-radius: 10px;
                  font-weight: bold;
                "
              >
                Reset Password →
              </a>

            </div>

            <p style="
              color: #94a3b8;
              font-size: 13px;
              line-height: 1.5;
            ">
              This link will expire in 15 minutes.
            </p>

            <p style="
              color: #94a3b8;
              font-size: 13px;
            ">
              If you didn't request a password reset, you can safely ignore
              this email.
            </p>

          </div>

        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });

  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};


// =====================================================
// RESET PASSWORD
// =====================================================

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Hash token received from URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with valid non-expired token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset link is invalid or has expired",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    user.password = hashedPassword;

    // Clear reset token
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successful. You can now login.",
    });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};
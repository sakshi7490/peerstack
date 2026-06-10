const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



// REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
  success: true,
  message: "User registered successfully",
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

// LOGIN
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

    const isMatch = await bcrypt.compare(password, user.password);

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
    res.status(500).json({ message: error.message });
  }
};
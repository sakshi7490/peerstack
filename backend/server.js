const express = require("express");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const authMiddleware = require("./middleware/auth.middleware");
const interviewRoutes = require("./routes/interview.routes");


connectDB();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://peerstack.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/test", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Protected route accessed",
    userId: req.user,
  });
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
# PeerStack 🚀

An AI-Powered Mock Interview Platform designed to help students and job seekers practice technical and HR interviews, receive AI-generated feedback, and track their performance over time.

## 🌐 Live Demo

Frontend: https://peerstack.vercel.app
Backend: https://peerstack-backend.onrender.com

---

## ✨ Features

### 🎯 Interview Practice

* Role-based mock interviews
* Backend, Frontend, AI/ML, and HR interview tracks
* Resume-based personalized interview generation
* AI-generated interview questions

### ⏱ Interview Experience

* Built-in timer system
* Automatic submission on timeout
* Interactive interview interface
* Progress tracking

### 🤖 AI Evaluation

* AI-powered answer analysis
* Overall performance scoring
* Detailed strengths and weaknesses
* Resume-aware feedback
* Personalized improvement suggestions
* Recommended learning path

### 📊 Analytics Dashboard

* Interview history tracking
* Average score analysis
* Best score tracking
* Resume interview statistics
* Role-wise performance insights

### 🔐 Authentication

* Secure JWT-based authentication
* User registration and login
* Protected routes
* Remember Me functionality

---

## 🛠 Tech Stack

### Frontend

* React.js
* React Router
* Axios
* CSS

### Backend

* Node.js
* Express.js
* JWT Authentication
* Multer (File Upload)

### Database

* MongoDB Atlas
* Mongoose

### AI Integration

* Google Gemini API
* Resume Parsing
* AI-Based Evaluation

### Deployment

* Frontend: Vercel
* Backend: Render

---

## 📁 Project Structure

```bash
peerstack/
│
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── config/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/sakshi7490/peerstack.git
cd peerstack
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
GEMINI_API_KEY=your_api_key
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🚀 Future Enhancements

* AI Follow-up Questions
* Voice-Based Interviews
* Interview Recording
* Performance Graphs & Trends
* Company-Specific Interview Tracks
* Peer-to-Peer Mock Interviews
* Leaderboard & Gamification

---

## 👩‍💻 Author

**Sakshi Pal**

* www.linkedin.com/in/sakshi-pal03
* GitHub: https://github.com/sakshi7490

---

Made with ❤️ using React, Node.js, MongoDB, and Gemini AI.

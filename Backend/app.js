require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");


const app = express();

// routes
const authRoutes = require('./api/Routes/auth');


app.set("trust proxy", 1);

// ✅ Define allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://securewebapp.netlify.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS not allowed"));
  },
  credentials: true
};

app.use(cors(corsOptions));

// middlewares
app.use(morgan('dev'));
app.use(cookieParser());

// SESSION MANAGEMENT VULNERABILITY (intentionally insecure for OWASP demo)
// Issues: weak secret, no httpOnly, no secure flag, no expiry, no sameSite
app.use(session({
  secret: "weak_secret",      // VULN: hardcoded weak secret
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: false,           // VULN: JS can read the cookie
    secure: false,             // VULN: sent over HTTP too
    // no maxAge = session never expires
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/auth', authRoutes);

// ROOT ROUTE (add this here)
app.get("/", (req, res) => {
  res.send("Secure Web App Backend is running");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

// error handler
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message || "Internal server error"
  });
});

module.exports = app;
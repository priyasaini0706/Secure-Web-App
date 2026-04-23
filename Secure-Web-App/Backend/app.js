require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const orderRoutes = require("./api/Routes/order");

const app = express();

// Define allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://securewebapp.netlify.app",
  "https://secure-web-app-production-d271.up.railway.app"
];

// CORS options — credentials:true is required for cookies to work cross-origin
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// ✅ Apply CORS globally — covers /api/users and every other route
// Previously only /api/auth, /api/products, /api/orders were covered,
// which caused /api/users/secure to be blocked by the browser (CORS missing).
app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.set("trust proxy", 1);

// SESSION MANAGEMENT VULNERABILITY (intentionally insecure for OWASP demo)
// Issues: weak secret, no httpOnly, no secure flag, no expiry, no sameSite
app.use(session({
  secret: "weak_secret",      // VULN: hardcoded weak secret
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: false,           // VULN: JS can read the cookie
    secure: true,              // MUST be true for sameSite: "none"
    sameSite: "none"           // Needed for cross-origin (Netlify -> Railway)
    // no maxAge = session never expires
  }
}));

// routes
const authRoutes = require('./api/Routes/auth');
const productRoutes = require('./api/Routes/product');
const userRoutes = require('./api/Routes/User');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use("/api/orders", orderRoutes);

// ROOT ROUTE
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
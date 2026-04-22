require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const orderRoutes = require("./api/Routes/order");



const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://securewebapp.netlify.app",
  "https://secure-web-app-production-d271.up.railway.app/"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,              // ✅ MUST be true for cookies
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

// routes
const authRoutes = require('./api/Routes/auth');

const productRoutes = require('./api/Routes/product');
app.use('/api/products', productRoutes);

const userRoutes = require('./api/Routes/User');
app.use('/api/users', userRoutes);

app.use("/api/orders", orderRoutes);


app.set("trust proxy", 1);

// ✅ Define allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://securewebapp.netlify.app",
  "https://secure-web-app-production-d271.up.railway.app/"
];



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
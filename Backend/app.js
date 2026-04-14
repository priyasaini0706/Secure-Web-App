require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require("cors");
const cookieParser = require("cookie-parser");


const app = express();

// routes
const authRoutes = require('./api/Routes/auth');


app.set("trust proxy", 1);

// ✅ Define allowed origins
const allowedOrigins = [
  "http://localhost:3000",
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/auth', authRoutes);

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
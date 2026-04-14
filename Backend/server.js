require("dotenv").config();

const http = require("http");

const app = require("./app");
// const connectDB = require("./config/database");

const PORT = process.env.PORT || 8080;

// connectDB();

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
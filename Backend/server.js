require("dotenv").config();

console.log("ENV TEST:");
console.log("DB_HOST =", process.env.DB_HOST);
console.log("DB_USER =", process.env.DB_USER);
console.log("DB_PORT =", process.env.DB_PORT);

const http = require("http");

const app = require("./app");

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
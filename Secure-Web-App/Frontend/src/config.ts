// API base URL — uses environment variable if set (e.g. on Netlify),
// otherwise falls back to localhost for local development.
// On Netlify: set REACT_APP_API_BASE=https://secure-web-app-production-d271.up.railway.app
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080";

export default API_BASE;

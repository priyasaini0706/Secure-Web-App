const express = require("express");
const router = express.Router();

const vulnerable = require("../Controllers/user/vulnerableUserController");
const secure = require("../Controllers/user/secureUserController");

const { verifyToken } = require("../Middleware/authMiddleware");

// 🔴 Vulnerable
router.get("/vulnerable", vulnerable.getProfile);
router.put("/vulnerable/:id", vulnerable.updateProfile);

// ✅ Secure
router.get("/secure", verifyToken, secure.getProfile);
router.put("/secure", verifyToken, secure.updateProfile);
router.delete("/secure", verifyToken, secure.deleteProfile);

module.exports = router;
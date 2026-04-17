const express = require("express");
const router = express.Router();

const secure = require("../Controllers/secureController");
const vulnerable = require("../Controllers/vulnerableController");

// ✅ Import middleware
const { verifyToken } = require("../Middleware/authMiddleware");
const { requireAdmin } = require("../Middleware/roleMiddleware");

// ============================================
// SECURE ROUTES (Protected)
// ============================================

// Auth
router.post("/secure/login", secure.login);
router.post("/secure/register", secure.register);
router.post("/secure/logout", secure.logout);

// Profile
router.get("/secure/profile", verifyToken, secure.getProfile);
router.put("/secure/profile", verifyToken, secure.updateProfile);

// Admin Orders - MUST have verifyToken and requireAdmin
router.get(
    "/secure/admin/orders",
    verifyToken,           // ✅ Sets req.user
    requireAdmin,          // ✅ Checks req.user.role
    secure.getAdminOrders
);

// ============================================
// VULNERABLE ROUTES (No protection)
// ============================================

router.post("/vulnerable/login", vulnerable.login);
router.post("/vulnerable/register", vulnerable.register);
router.get("/vulnerable/admin/orders", vulnerable.getAdminOrders);
router.get("/vulnerable/profile", vulnerable.getProfile);

module.exports = router;
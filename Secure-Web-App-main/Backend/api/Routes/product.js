const express = require("express");
const router = express.Router();

const vulnerable = require("../Controllers/product/vulnerableProductController");
const secure = require("../Controllers/product/secureProductController");

const { verifyToken } = require("../Middleware/authMiddleware");
const { requireAdmin } = require("../Middleware/roleMiddleware");

// 🔴 Vulnerable Routes
router.post("/vulnerable", vulnerable.addProduct);
router.get("/vulnerable", vulnerable.getProducts);
router.put("/vulnerable/:id", vulnerable.updateProduct);
router.delete("/vulnerable/:id", vulnerable.deleteProduct);

// ✅ Secure Routes
router.post("/secure", verifyToken, requireAdmin, secure.addProduct);
router.get("/secure", secure.getProducts);
router.put("/secure/:id", verifyToken, requireAdmin, secure.updateProduct);
router.delete("/secure/:id", verifyToken, requireAdmin, secure.deleteProduct);

module.exports = router;
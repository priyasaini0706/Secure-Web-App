const express = require("express");
const router = express.Router();

const secure = require("./Controller/secureController");
const vulnerable = require("./Controller/vulnerableController");

// Secure routes
router.post("/secure/login", secure.login);
router.post("/secure/register", secure.register);
router.get("/secure/admin/orders", secure.getAdminOrders);

// Vulnerable routes
router.post("/vulnerable/login", vulnerable.login);
router.post("/vulnerable/register", vulnerable.register);
router.get("/vulnerable/admin/orders", vulnerable.getAdminOrders);
router.post("/vulnerable/products", vulnerable.addProduct);
router.get("/vulnerable/products", vulnerable.viewProducts);

module.exports = router;

// force rebuild
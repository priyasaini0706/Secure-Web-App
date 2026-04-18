const express = require("express");
const router = express.Router();
const { verifyToken } = require("../Middleware/authMiddleware");
const { requireAdmin } = require("../Middleware/roleMiddleware");
const db = require("../../db");

// ✅ Place order (secure - JWT required)
router.post("/secure", verifyToken, async (req, res) => {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id;

    await db.query(
        "INSERT INTO orders (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [user_id, product_id, quantity]
    );

    res.json({ message: "Order placed successfully" });
});

// ✅ Get my orders (secure)
router.get("/secure/my", verifyToken, async (req, res) => {
    const user_id = req.user.id;

    const [orders] = await db.query(
        `SELECT orders.id, products.name, products.price, 
     orders.quantity, orders.created_at
     FROM orders
     JOIN products ON orders.product_id = products.id
     WHERE orders.user_id = ?`,
        [user_id]
    );

    res.json(orders);
});

// ✅ Admin - get all orders
router.get("/secure/all", verifyToken, requireAdmin, async (req, res) => {
    const [orders] = await db.query(
        `SELECT orders.id, users.email, products.name, 
     orders.quantity, orders.created_at
     FROM orders
     JOIN products ON orders.product_id = products.id
     JOIN users ON orders.user_id = users.id`
    );

    res.json(orders);
});

// 🔴 Vulnerable - place order (no auth)
router.post("/vulnerable", async (req, res) => {
    const { user_id, product_id, quantity } = req.body;

    await db.query(
        `INSERT INTO orders (user_id, product_id, quantity) VALUES ('${user_id}', '${product_id}', '${quantity}')`,
        []
    );

    res.json({ message: "Order placed (vulnerable)" });
});

module.exports = router;
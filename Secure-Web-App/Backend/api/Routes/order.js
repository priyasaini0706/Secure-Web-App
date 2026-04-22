const express = require("express");
const router = express.Router();
const { verifyToken } = require("../Middleware/authMiddleware");
const { requireAdmin } = require("../Middleware/roleMiddleware");
const db = require("../../db");

// ✅ Place order (secure - JWT required)
router.post("/secure", verifyToken, async (req, res) => {
    const { product_id, quantity, customer_name, address, contact, payment_method } = req.body;
    const user_id = req.user.id;

    await db.query(
        "INSERT INTO orders (user_id, product_id, quantity, customer_name, address, contact, payment_method, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [user_id, product_id, quantity, customer_name || '', address || '', contact || '', payment_method || 'account', 'Pending']
    );

    res.json({ message: "Order placed successfully" });
});

// ✅ Get my orders (secure)
router.get("/secure/my", verifyToken, async (req, res) => {
    const user_id = req.user.id;

    const [orders] = await db.query(
        `SELECT orders.id, products.name, products.price, 
      orders.quantity, orders.address, orders.contact, orders.payment_method, orders.status, orders.created_at
      FROM orders
      JOIN products ON orders.product_id = products.id
      WHERE orders.user_id = ?
      ORDER BY orders.created_at DESC`,
        [user_id]
    );

    res.json(orders);
});

// ✅ Admin - get all orders
router.get("/secure/all", verifyToken, requireAdmin, async (req, res) => {
    const [orders] = await db.query(
        `SELECT orders.id, COALESCE(users.email, orders.customer_name, 'Guest') as email, products.name, 
      orders.quantity, orders.address, orders.contact, orders.payment_method, orders.status, orders.created_at
      FROM orders
      JOIN products ON orders.product_id = products.id
      LEFT JOIN users ON orders.user_id = users.id
      ORDER BY orders.created_at DESC`
    );

    res.json(orders);
});

// ✅ Admin - update order status
router.put("/secure/update-status/:id", verifyToken, requireAdmin, async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    await db.query(
        "UPDATE orders SET status = ? WHERE id = ?",
        [status, id]
    );

    res.json({ message: "Order status updated successfully" });
});

// 🔴 Vulnerable - place order (no auth)
router.post("/vulnerable", async (req, res) => {
    const { user_id, product_id, quantity, customer_name, address, contact, payment_method } = req.body;
    
    // In vulnerable mode, we just build the SQL string directly.
    const sqlUserId = user_id ? `'${user_id}'` : `NULL`;

    await db.query(
        `INSERT INTO orders (user_id, product_id, quantity, customer_name, address, contact, payment_method, status) VALUES (${sqlUserId}, '${product_id}', '${quantity}', '${customer_name || ''}', '${address || ''}', '${contact || ''}', '${payment_method || 'account'}', 'Pending')`,
        []
    );

    res.json({ message: "Order placed (vulnerable)" });
});

module.exports = router;
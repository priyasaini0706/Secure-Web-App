const db = require("../db"); // db connection

// No validation, plain password
exports.register = async (req, res) => {
    const { email, password } = req.body;


    const query = `INSERT INTO users (email, password) VALUES ('${email}', '${password}')`;

    await db.query(query);

    res.json({ message: "User registered" });
};

// (SQL Injection)
exports.login = async (req, res) => {
    const { email, password } = req.body;
    const query = `SELECT * FROM users WHERE email='${email}' AND password='${password}'`;

    const result = await db.query(query);

    if (result.length > 0) {
        req.session.user = result[0];
        res.json({ message: "Login success" });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
};

// (Broken Access Control)
exports.getAdminOrders = async (req, res) => {
    const orders = await db.query("SELECT * FROM orders");

    res.json(orders);
};

// XSS vulnerability
exports.addProduct = async (req, res) => {
    const { name, description } = req.body;
    const query = `INSERT INTO products (name, description) VALUES ('${name}', '${description}')`;

    await db.query(query);

    res.json({ message: "Product added" });
};

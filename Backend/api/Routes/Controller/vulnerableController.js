const db = require("../../../db"); // db connection

// BROKEN AUTHENTICATION (WEAK PASSWORD STORAGE / NO HASHING)
exports.register = async (req, res) => {
    const { email, password } = req.body;

//SQL INJECTION (string concatenation with user input)
    const query = `INSERT INTO users (email, password) VALUES ('${email}', '${password}')`;

    await db.query(query);

    res.json({ message: "User registered" });
};

// SQL INJECTION + BROKEN AUTHENTICATION (plain text password check)
exports.login = async (req, res) => {
    const { email, password } = req.body;

    //SQL INJECTION VULNERABILITY
    const query = `SELECT * FROM users WHERE email='${email}' AND password='${password}'`;

    const result = await db.query(query);

    if (result.length > 0) {

        //SESSION MANAGEMENT ISSUE (weak session handling / unsafe session usage)
        req.session.user = result[0];
        res.json({ message: "Login success" });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
};

// BROKEN ACCESS CONTROL (NO AUTH CHECK / ANY USER CAN ACCESS ADMIN DATA)
exports.getAdminOrders = async (req, res) => {
    const orders = await db.query("SELECT * FROM orders");

    res.json(orders);
};

// XSS VULNERABILITY (stored XSS via unsanitized input)
exports.addProduct = async (req, res) => {
    const { name, description } = req.body;

    //SQL INJECTION (unsanitized user input in query)
    const query = `INSERT INTO products (name, description) VALUES ('${name}', '${description}')`;

    await db.query(query);

    res.json({ message: "Product added" });
};

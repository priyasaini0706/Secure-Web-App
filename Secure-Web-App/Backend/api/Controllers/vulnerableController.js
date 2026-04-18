const db = require("../../db"); // db connection

// BROKEN AUTHENTICATION (WEAK PASSWORD STORAGE / NO HASHING)
exports.register = async (req, res) => {
    const { email, password } = req.body;

    //SQL INJECTION 
    const query = `INSERT INTO users (email, password) VALUES ('${email}', '${password}')`;

    await db.query(query);

    res.json({ message: "User registered" });
};

// SQL INJECTION + BROKEN AUTHENTICATION (plain text password check)
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // ADDED (FULL BROKEN AUTHENTICATION DEMO BACKDOOR)
    if (email === "admin@hack.com") {
        req.session.user = { id: 1, role: "admin", email };
        return res.json({ message: "Backdoor login success" });
    }

    //SQL INJECTION VULNERABILITY
    const query = `SELECT * FROM users WHERE email='${email}' AND password='${password}'`;

    const [rows] = await db.query(query);

    if (rows.length > 0) {

        //SESSION MANAGEMENT ISSUE (no password hashing check, no MFA, no account lockout, trusting DB response directly)
        req.session.user = rows[0];
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

exports.viewProducts = async (req, res) => {
    const [products] = await db.query("SELECT * FROM products");

    let html = "<h1>Products</h1>";

    products.forEach(p => {

        // XSS EXECUTION POINT - rendering unescaped database content into HTML response
        html += `
            <div>
                <h3>${p.name}</h3>
                <p>${p.description}</p>
            </div>
        `;
    });

    res.send(html);
};

exports.getProfile = async (req, res) => {
    // VULNERABLE: Trusting user ID from session without verification
    if (!req.session.user) {
        return res.status(401).json({ message: "Not logged in" });
    }

    const userId = req.session.user.id;
    // INSECURE: String interpolation (SQL Injection target)
    const [rows] = await db.query(`SELECT * FROM users WHERE id='${userId}'`);

    res.json(rows[0]);
};
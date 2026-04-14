const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { validationResult } = require("express-validator");
const xss = require("xss");

const loginAttempts = {};

exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let { email, password } = req.body;

        //  XSS Protection
        email = xss(email);

        // Password hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Parameterized query (SQL Injection fix)
        await db.query(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            [email, hashedPassword]
        );

        res.json({ message: "User registered securely" });

    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

exports.login = async (req, res) => {
    const { email, password, otp } = req.body;

    // Account Lockout
    if (loginAttempts[email] >= 5) {
        return res.status(403).json({ message: "Account locked. Try later." });
    }

    const [user] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    if (!user) {
        loginAttempts[email] = (loginAttempts[email] || 0) + 1;
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        loginAttempts[email] = (loginAttempts[email] || 0) + 1;
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // MFA (dummy OTP check)
    if (otp !== "123456") {
        return res.status(401).json({ message: "Invalid OTP" });
    }

    loginAttempts[email] = 0;

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.cookie("token", token, {
        httpOnly: true,     // Session security
        secure: true,
        sameSite: "Strict"
    });

    res.json({ message: "Login successful" });
};



exports.getAdminOrders = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
    }

    const orders = await db.query("SELECT * FROM orders");

    res.json(orders);
};

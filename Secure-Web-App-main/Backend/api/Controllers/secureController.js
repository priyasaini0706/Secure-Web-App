const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../db");
const { validationResult } = require("express-validator");
const xss = require("xss");

const loginAttempts = {};

// SESSION HARDENING (fix missing session security concept)
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes
const blockedUsers = {};

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
        // await db.query(
        //     "INSERT INTO users (email, password) VALUES (?, ?)",
        //     [email, hashedPassword]
        // );

        const role = email === "admin@test.com" ? "admin" : "user";

        await db.query(
            "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
            [email, hashedPassword, role]
        );

        res.json({ message: "User registered securely" });

    } catch (err) {
        // SECURITY MISCONFIG FIX (avoid leaking internal error details)
        res.status(500).json({ message: "Something went wrong" });
    }
};

exports.login = async (req, res) => {
    const { email, password, otp } = req.body;

    // XSS protection (input sanitization)
    const safeEmail = xss(email);

    // Account Lockout
    if (blockedUsers[safeEmail] && Date.now() < blockedUsers[safeEmail]) {
        return res.status(403).json({ message: "Account temporarily locked" });
    }

    // Account Lockout logic
    if (loginAttempts[safeEmail] >= MAX_ATTEMPTS) {
        blockedUsers[safeEmail] = Date.now() + LOCK_TIME;
        loginAttempts[safeEmail] = 0;
        return res.status(403).json({ message: "Too many attempts. Try Later" });
    }

    // SQL Injection FIX (parameterized query)
    const [rows] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [safeEmail]
    );

    const user = rows[0];

    if (!user) {
        loginAttempts[safeEmail] = (loginAttempts[safeEmail] || 0) + 1;
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        loginAttempts[safeEmail] = (loginAttempts[safeEmail] || 0) + 1;
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // MFA (dummy OTP check)
    if (otp !== "123456") {
        return res.status(401).json({ message: "Invalid OTP" });
    }

    // RESET attempts after success
    loginAttempts[safeEmail] = 0;

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.cookie("token", token, {
        httpOnly: true,     // Session security
        secure: false,
        sameSite: "Lax",
        maxAge: 60 * 60 * 1000 // session expiry
    });

    res.json({ message: "Login successful" });
};


// BROKEN ACCESS CONTROL FIX
exports.getAdminOrders = async (req, res) => {

    // AUTH CHECK (strengthened)
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
    }

    const orders = await db.query("SELECT * FROM orders");

    res.json(orders);
};

exports.getProfile = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT id, email, role FROM users WHERE id = ?",
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Error fetching profile" });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        let { email } = req.body;
        email = xss(email); // Sanitize

        await db.query(
            "UPDATE users SET email = ? WHERE id = ?",
            [email, req.user.id]
        );

        res.json({ message: "Profile updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error updating profile" });
    }
};

exports.logout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
};
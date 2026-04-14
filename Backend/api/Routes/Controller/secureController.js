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

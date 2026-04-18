const db = require("../../../db");
const xss = require("xss");

// GET profile (JWT required)
exports.getProfile = async (req, res) => {
    const userId = req.user.id;

    const [rows] = await db.query(
        "SELECT id, email, role FROM users WHERE id = ?",
        [userId]
    );

    res.json(rows[0]);
};

// UPDATE profile (only own account)
exports.updateProfile = async (req, res) => {
    const userId = req.user.id;
    const { email } = req.body;

    const safeEmail = xss(email);

    await db.query(
        "UPDATE users SET email = ? WHERE id = ?",
        [safeEmail, userId]
    );

    res.json({ message: "Profile updated securely" });
};
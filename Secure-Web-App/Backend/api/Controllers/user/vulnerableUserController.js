const db = require("../../../db");

// READ profile (no auth check)
exports.getProfile = async (req, res) => {
    const { id } = req.query;

    const query = `SELECT id, email, role FROM users WHERE id=${id}`;

    const [rows] = await db.query(query);

    res.json(rows[0]);
};

// UPDATE profile (SQL Injection possible)
exports.updateProfile = async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    const query = `UPDATE users SET email='${email}' WHERE id=${id}`;

    await db.query(query);

    res.json({ message: "Profile updated (vulnerable)" });
};
const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
    // ✅ Prevent crash if cookies undefined
    if (!req.cookies) {
        return res.status(401).json({ message: "Cookies not found" });
    }

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
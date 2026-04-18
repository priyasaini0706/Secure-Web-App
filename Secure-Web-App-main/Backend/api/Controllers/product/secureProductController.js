const db = require("../../../db");
const xss = require("xss");

// CREATE (Admin Only)
exports.addProduct = async (req, res) => {
    const { name, description } = req.body;

    const safeName = xss(name);
    const safeDescription = xss(description);

    await db.query(
        "INSERT INTO products (name, description) VALUES (?, ?)",
        [safeName, safeDescription]
    );

    res.json({ message: "Product added securely" });
};

// READ (Public)
exports.getProducts = async (req, res) => {
    const [products] = await db.query("SELECT * FROM products");
    res.json(products);
};

// UPDATE (Admin Only)
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const safeName = xss(name);
    const safeDescription = xss(description);

    await db.query(
        "UPDATE products SET name = ?, description = ? WHERE id = ?",
        [safeName, safeDescription, id]
    );

    res.json({ message: "Product updated securely" });
};

// DELETE (Admin Only)
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    await db.query(
        "DELETE FROM products WHERE id = ?",
        [id]
    );

    res.json({ message: "Product deleted securely" });
};
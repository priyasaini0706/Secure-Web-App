const db = require("../../../db");
const xss = require("xss");

// Handle adding a new product - admin access required
exports.addProduct = async (req, res) => {
    const { name, description, price, image } = req.body;

    // We sanitize these inputs to prevent any potential XSS issues in the frontend
    const safeName = xss(name);
    const safeDescription = xss(description);

    await db.query(
        "INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)",
        [safeName, safeDescription, price, image]
    );

    res.json({ message: "Product saved to catalog" });
};


// READ (Public)
exports.getProducts = async (req, res) => {
    const [products] = await db.query("SELECT * FROM products");
    res.json(products);
};

// Update an existing product
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, image } = req.body;

    // Sanitize updates before saving
    const safeName = xss(name);
    const safeDescription = xss(description);

    await db.query(
        "UPDATE products SET name = ?, description = ?, price = ?, image = ? WHERE id = ?",
        [safeName, safeDescription, price, image, id]
    );

    res.json({ message: "Product details updated" });
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
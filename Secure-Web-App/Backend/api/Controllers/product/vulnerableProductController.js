const db = require("../../../db");

// CREATE (Already existed but moved here)
exports.addProduct = async (req, res) => {
    const { name, description } = req.body;

    const query = `INSERT INTO products (name, description) VALUES ('${name}', '${description}')`;

    await db.query(query);

    res.json({ message: "Product added (vulnerable)" });
};

// READ
exports.getProducts = async (req, res) => {
    const [products] = await db.query("SELECT * FROM products");
    res.json(products);
};

// UPDATE (SQL Injection + No Auth)
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const query = `
        UPDATE products 
        SET name='${name}', description='${description}' 
        WHERE id=${id}
    `;

    await db.query(query);

    res.json({ message: "Product updated (vulnerable)" });
};

// DELETE (No Role Check)
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    await db.query(`DELETE FROM products WHERE id=${id}`);

    res.json({ message: "Product deleted (vulnerable)" });
};
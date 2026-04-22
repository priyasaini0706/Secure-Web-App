const db = require("../../../db");

// Quick add product - note: this version doesn't sanitize inputs
exports.addProduct = async (req, res) => {
    const { name, description, price, image } = req.body;

    // Directly inserting values for demonstration purposes
    const query = `INSERT INTO products (name, description, price, image) VALUES ('${name}', '${description}', ${price || 0}, '${image || ''}')`;

    await db.query(query);

    res.json({ message: "Item added to catalog (legacy mode)" });
};


// READ
exports.getProducts = async (req, res) => {
    const [products] = await db.query("SELECT * FROM products");
    res.json(products);
};

// Update product without sanitization
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, image } = req.body;

    // Using string interpolation for the update query
    const query = `
        UPDATE products 
        SET name='${name}', description='${description}', price=${price || 0}, image='${image || ''}'
        WHERE id=${id}
    `;

    await db.query(query);

    res.json({ message: "Item updated (legacy mode)" });
};

// DELETE (No Role Check)
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    await db.query(`DELETE FROM products WHERE id=${id}`);

    res.json({ message: "Product deleted (vulnerable)" });
};
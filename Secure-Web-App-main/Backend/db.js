// const sqlite3 = require('sqlite3').verbose();
// const { open } = require('sqlite');
// const path = require('path');

// let dbInstance = null;



// async function getDb() {
//   if (dbInstance) return dbInstance;

//   dbInstance = await open({
//     filename: path.join(__dirname, 'database.sqlite'),
//     driver: sqlite3.Database
//   });

//   // Auto-create tables on first run
//   await dbInstance.exec(`
//     CREATE TABLE IF NOT EXISTS users (
//       id       INTEGER PRIMARY KEY AUTOINCREMENT,
//       email    TEXT    NOT NULL UNIQUE,
//       password TEXT    NOT NULL,
//       role     TEXT    DEFAULT 'user',
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     );

//     CREATE TABLE IF NOT EXISTS products (
//       id          INTEGER PRIMARY KEY AUTOINCREMENT,
//       name        TEXT NOT NULL,
//       description TEXT,
//       created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
//     );

//     CREATE TABLE IF NOT EXISTS orders (
//       id         INTEGER PRIMARY KEY AUTOINCREMENT,
//       user_id    INTEGER,
//       product_id INTEGER,
//       quantity   INTEGER DEFAULT 1,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (user_id)    REFERENCES users(id),
//       FOREIGN KEY (product_id) REFERENCES products(id)
//     );
//   `);

//   return dbInstance;


// }

// /**
//  * mysql2-compatible query wrapper.
//  * Always resolves to [rows, []] for SELECT
//  * or  [{ insertId, affectedRows }, []] for INSERT/UPDATE/DELETE
//  * so existing controllers (const [rows] = await db.query(...)) work unchanged.
//  */
// const db = {
//   query: async (sql, params = []) => {
//     const database = await getDb();
//     const trimmed = sql.trim().toUpperCase();

//     if (trimmed.startsWith('SELECT')) {
//       const rows = await database.all(sql, params);
//       return [rows, []];
//     } else {
//       const result = await database.run(sql, params);
//       return [{ insertId: result.lastID, affectedRows: result.changes }, []];
//     }
//   },


//   // For pool.getConnection() used in db.js test
//   getConnection: async () => {
//     await getDb();
//     return { release: () => { } };
//   }
// };

// // Test connection / initialise on startup
// (async () => {
//   try {
//     await getDb();
//     console.log('✅ SQLite connected successfully (database.sqlite)');
//   } catch (err) {
//     console.error('Database connection failed:', err);
//   }
// })();



// module.exports = db;

const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

let dbInstance = null;

async function getDb() {
  if (dbInstance) return dbInstance;

  dbInstance = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  // Auto-create tables
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      email    TEXT    NOT NULL UNIQUE,
      password TEXT    NOT NULL,
      role     TEXT    DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      description TEXT,
      price       REAL DEFAULT 0,
      image       TEXT DEFAULT '',
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER,
      product_id INTEGER,
      quantity   INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id)    REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `);

  // ✅ Fix schema if columns are missing (for existing databases)
  const columns = await dbInstance.all("PRAGMA table_info(products)");
  const columnNames = columns.map(c => c.name);
  if (!columnNames.includes('price')) {
    await dbInstance.exec("ALTER TABLE products ADD COLUMN price REAL DEFAULT 0");
  }
  if (!columnNames.includes('image')) {
    await dbInstance.exec("ALTER TABLE products ADD COLUMN image TEXT DEFAULT ''");
  }

  // ✅ Make admin
  await dbInstance.run(`
    UPDATE users SET role = 'admin'
    WHERE email = 'admin@test.com'
  `);

  // ✅ Seed products if empty
  const productCount = await dbInstance.get("SELECT COUNT(*) as count FROM products");
  if (productCount.count === 0) {
    await dbInstance.run(`
      INSERT INTO products (id, name, description, price, image)
      VALUES
      (1, 'Basic Tee', 'Comfortable cotton t-shirt', 35, 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg'),
      (2, 'Nomad Tumbler', 'Keeps drinks hot or cold', 45, 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-02.jpg'),
      (3, 'Focus Paper Refill', 'Premium writing paper', 20, 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-03.jpg'),
      (4, 'Machined Mechanical Pencil', 'Precision writing tool', 55, 'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-04-image-card-04.jpg'),
      (5, 'Leather Wallet', 'Slim genuine leather wallet', 75, 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-04.jpg'),
      (6, 'Canvas Tote Bag', 'Durable everyday bag', 40, 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-03.jpg'),
      (7, 'Zip Tote Basket', 'Perfect for shopping', 30, 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-02.jpg'),
      (8, 'Premium Hoodie', 'Warm and stylish hoodie', 85, 'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg')
    `);
  }
  
  return dbInstance;
}

/**
 * mysql2-compatible query wrapper.
 * Always resolves to [rows, []] for SELECT
 * or  [{ insertId, affectedRows }, []] for INSERT/UPDATE/DELETE
 * so existing controllers (const [rows] = await db.query(...)) work unchanged.
 */
const db = {
  query: async (sql, params = []) => {
    const database = await getDb();
    const trimmed = sql.trim().toUpperCase();

    if (trimmed.startsWith('SELECT')) {
      const rows = await database.all(sql, params);
      return [rows, []];
    } else {
      const result = await database.run(sql, params);
      return [{ insertId: result.lastID, affectedRows: result.changes }, []];
    }
  },

  // For pool.getConnection() used in db.js test
  getConnection: async () => {
    await getDb();
    return { release: () => { } };
  }
};

// Test connection / initialise on startup
(async () => {
  try {
    await getDb();
    console.log('✅ SQLite connected successfully (database.sqlite)');
  } catch (err) {
    console.error('Database connection failed:', err);
  }
})();

module.exports = db;
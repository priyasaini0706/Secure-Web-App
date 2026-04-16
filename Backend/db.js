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

  // Auto-create tables on first run
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
    return { release: () => {} };
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
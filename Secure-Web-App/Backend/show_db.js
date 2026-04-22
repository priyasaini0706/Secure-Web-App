const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'database.sqlite');
console.log("DB Path:", dbPath);

if (!fs.existsSync(dbPath)) {
    console.error("Database file not found at:", dbPath);
    process.exit(1);
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("Error opening database:", err.message);
});

console.log("\n=============================================");
console.log("🔓 HACKER VIEW: EXTRACTING USERS DATABASE...");
console.log("=============================================\n");

db.all("SELECT id, email, password, role FROM users", [], (err, rows) => {
    if (err) {
        console.error("Query error:", err.message);
    } else {
        console.log("Rows returned:", rows.length);
        console.table(rows);
    }

    console.log("\nClosing database connection...");
    db.close((closeErr) => {
        if (closeErr) console.error("Close error:", closeErr.message);
    });
});
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the SQLite database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
    }
});

console.log("\n=============================================");
console.log("🔓 HACKER VIEW: EXTRACTING USERS DATABASE...");
console.log("=============================================\n");

// Fetch all users and display them in a table
db.all("SELECT id, email, password, role FROM users", [], (err, rows) => {
    if (err) {
        throw err;
    }
    
    // Using console.table for a clean, professional output in the terminal
    console.table(rows);
    
    console.log("\n⚠️ Notice how the 'Vulnerable' user's password is in PLAIN TEXT.");
    console.log("✅ Notice how the 'Secure' user's password is scrambled (HASHED).");
    console.log("\nClosing database connection...");
});

db.close();

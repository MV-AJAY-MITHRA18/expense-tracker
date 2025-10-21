const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Update with your MySQL credentials
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',   // your MySQL password
  database: 'testdb' // change to your database name
};

async function runMigrations() {
  const connection = await mysql.createConnection(dbConfig);

  try {
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir).sort();

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      console.log(`Running migration: ${file}`);
      await connection.query(sql);
    }

    console.log('✅ All migrations applied successfully!');
  } catch (err) {
    console.error('❌ Migration error:', err);
  } finally {
    await connection.end();
  }
}

runMigrations();
 

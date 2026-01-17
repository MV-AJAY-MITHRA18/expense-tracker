const { Pool } = require('pg');
require('dotenv').config();

async function addTypeColumn() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await pool.query("ALTER TABLE transactions ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'expense'");
    console.log('✅ Type column added successfully!');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

addTypeColumn();

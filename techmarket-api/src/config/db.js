require("dotenv").config();
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Automatyczna inicjalizacja bazy danych z pliku SQL
const initDb = async () => {
  const initScript = fs
    .readFileSync(path.join(__dirname, "init.sql"))
    .toString();
  try {
    await pool.query(initScript);
    console.log("Database has been initialized");
  } catch (err) {
    console.error("Database initialization error:", err);
    process.exit(1);
  }
};

module.exports = { pool, initDb };

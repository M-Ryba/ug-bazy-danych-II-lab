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
    console.log("Baza danych została zainicjalizowana.");
  } catch (err) {
    console.error("Błąd inicjalizacji bazy danych:", err);
  }
};

module.exports = { pool, initDb };

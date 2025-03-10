const { pool } = require("../config/db");

const Product = {
  // Pobranie wszystkich produktów
  getAll: async () => {
    const { rows } = await pool.query(
      "SELECT * FROM products ORDER BY product_id;"
    );
    return rows;
  },

  // Pobranie pojedynczego produktu według ID
  getById: async (id) => {
    const { rows } = await pool.query(
      "SELECT * FROM products WHERE product_id = $1;",
      [id]
    );
    return rows[0];
  },
};

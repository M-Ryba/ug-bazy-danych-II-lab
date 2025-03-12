const { pool } = require("../config/db");

const ProductDB = {
  // Download all products
  getAll: async () => {
    const { rows } = await pool.query(
      "SELECT * FROM products ORDER BY product_id;"
    );
    return rows;
  },
  // Download product by id
  getById: async (id) => {
    const { rows } = await pool.query(
      "SELECT * FROM products WHERE product_id = $1;",
      [id]
    );
    return rows[0];
  },
  // Create new product
  create: async (product) => {
    const { rows } = await pool.query(
      "INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *;",
      [product.name, product.price, product.category]
    );
    return rows[0];
  },
  // Update product
  patch: async (id, updates) => {
    // Dynamically build the update query
    const setColumns = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach((key) => {
      if (key !== "id" && key !== "created_at") {
        setColumns.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    values.push(id);
    const query = `
      UPDATE products
      SET ${setColumns.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE product_id = $${paramCount}
      RETURNING *;
    `;

    const { rows } = await pool.query(query, values);
    return rows[0];
  },
  // Delete product
  delete: async (id) => {
    const { rows } = await pool.query(
      "DELETE FROM products WHERE product_id = $1 RETURNING *;",
      [id]
    );
    return rows[0];
  },
};

module.exports = ProductDB;

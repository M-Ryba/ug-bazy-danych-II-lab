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
      `INSERT INTO products (
        name, category, description, price,
        stock_count, brand, image_url, is_available
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;`,
      [
        product.name,
        product.category,
        product.description,
        product.price,
        product.stock_count,
        product.brand,
        product.image_url,
        product.is_available,
      ]
    );
    return rows[0];
  },
  // Update product
  update: async (id, updates) => {
    const allowedFields = [
      "name",
      "category",
      "description",
      "price",
      "stock_count",
      "brand",
      "image_url",
      "is_available",
    ];

    const setColumns = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        setColumns.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (setColumns.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE products
      SET ${setColumns.join(", ")}
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

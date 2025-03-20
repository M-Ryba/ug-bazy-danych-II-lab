const { pool } = require("../config/db");

const CategoryDB = {
  // Get all categories
  getAll: async () => {
    const { rows } = await pool.query("SELECT * FROM categories ORDER BY category_id;");
    return rows;
  },

  // Get category by id
  getById: async (id) => {
    const { rows } = await pool.query("SELECT * FROM categories WHERE category_id = $1;", [id]);
    return rows[0];
  },

  // Get category with products
  getWithProducts: async (id) => {
    const category = await CategoryDB.getById(id);
    if (!category) return null;

    const { rows: products } = await pool.query(
      `
      SELECT p.*, c.name as category_name
      FROM products p
      JOIN categories c ON p.category_id = c.category_id
      WHERE p.category_id = $1;
    `,
      [id]
    );

    return { ...category, products };
  },

  // Create new category
  create: async (category) => {
    const { rows } = await pool.query("INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *;", [category.name, category.description]);
    return rows[0];
  },

  // Update category
  update: async (id, updates) => {
    const allowedFields = ["name", "description"];

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
      UPDATE categories
      SET ${setColumns.join(", ")}
      WHERE category_id = $${paramCount}
      RETURNING *;
    `;

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Delete category
  delete: async (id) => {
    const { rows } = await pool.query("DELETE FROM categories WHERE category_id = $1 RETURNING *;", [id]);
    return rows[0];
  },

  // Find category by name
  findByName: async (name) => {
    const { rows } = await pool.query("SELECT * FROM categories WHERE name = $1;", [name]);
    return rows[0];
  },
};

module.exports = CategoryDB;

const { pool } = require("../config/db");

const ProductDB = {
  // Download all products
  getAll: async () => {
    const { rows } = await pool.query("SELECT * FROM products ORDER BY product_id;");
    return rows;
  },
  // Download product by id
  getById: async (id) => {
    const { rows } = await pool.query("SELECT * FROM products WHERE product_id = $1;", [id]);
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
      [product.name, product.category, product.description, product.price, product.stock_count, product.brand, product.image_url, product.is_available]
    );
    return rows[0];
  },
  // Update product
  update: async (id, updates) => {
    const allowedFields = ["name", "category", "description", "price", "stock_count", "brand", "image_url", "is_available"];

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
    const { rows } = await pool.query("DELETE FROM products WHERE product_id = $1 RETURNING *;", [id]);
    return rows[0];
  },
  // Search products with filters and sorting
  search: async (params) => {
    let query = "SELECT * FROM products";
    const values = [];
    const conditions = [];

    // Filter by name (exact match or pattern)
    if (params.name !== undefined) {
      conditions.push("name = $" + (values.length + 1));
      values.push(params.name);
    } else if (params.namePattern !== undefined) {
      conditions.push("LOWER(name) LIKE LOWER($" + (values.length + 1) + ")");
      values.push(`%${params.namePattern}%`);
    }

    // Filter by availability
    if (params.available !== undefined) {
      conditions.push("is_available = $" + (values.length + 1));
      values.push(params.available === "true");
    }

    // Filter by price range
    if (params.minPrice !== undefined) {
      conditions.push("price >= $" + (values.length + 1));
      values.push(parseFloat(params.minPrice));
    }
    if (params.maxPrice !== undefined) {
      conditions.push("price <= $" + (values.length + 1));
      values.push(parseFloat(params.maxPrice));
    }

    // Filter by brand
    if (params.brand !== undefined) {
      conditions.push("LOWER(brand) = LOWER($" + (values.length + 1) + ")");
      values.push(params.brand);
    }

    // Filter by category
    if (params.category !== undefined) {
      conditions.push("LOWER(category) = LOWER($" + (values.length + 1) + ")");
      values.push(params.category);
    }

    // Add WHERE clause if there are any conditions
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // Add sorting
    if (params.sort === "price_asc") {
      query += " ORDER BY price ASC";
    } else if (params.sort === "price_desc") {
      query += " ORDER BY price DESC";
    } else {
      query += " ORDER BY product_id"; // default sorting
    }

    const { rows } = await pool.query(query, values);
    return params.name ? rows[0] : rows; // Return single object for name search
  },
};

module.exports = ProductDB;

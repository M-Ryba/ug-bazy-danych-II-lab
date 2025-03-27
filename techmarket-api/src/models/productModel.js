const { pool } = require("../config/db");

const ProductDB = {
  // Download all products
  getAll: async () => {
    const { rows } = await pool.query(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      ORDER BY p.product_id;
    `);
    return rows;
  },
  // Download product by id
  getById: async (id) => {
    const { rows } = await pool.query(
      `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.product_id = $1;
    `,
      [id]
    );
    return rows[0];
  },
  // Get product with reviews
  getWithReviews: async (id) => {
    const product = await ProductDB.getById(id);
    if (!product) return null;

    const { rows: reviews } = await pool.query(
      `
      SELECT r.*, u.username
      FROM reviews r
      JOIN users u ON r.user_id = u.user_id
      WHERE r.product_id = $1
      ORDER BY r.created_at DESC;
    `,
      [id]
    );

    return { ...product, reviews };
  },
  // Create new product
  create: async (product) => {
    const { rows } = await pool.query(
      `INSERT INTO products (
        name, category, description, price,
        stock_count, brand, image_url, is_available, category_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;`,
      [product.name, product.category, product.description, product.price, product.stock_count, product.brand, product.image_url, product.is_available, product.category_id]
    );
    return rows[0];
  },
  // Update product
  update: async (id, updates) => {
    const allowedFields = ["name", "category", "description", "price", "stock_count", "brand", "image_url", "is_available", "category_id"];

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
    let query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
    `;
    const values = [];
    const conditions = [];

    // Filter by name (exact match or pattern)
    if (params.name !== undefined) {
      conditions.push("p.name = $" + (values.length + 1));
      values.push(params.name);
    } else if (params.namePattern !== undefined) {
      conditions.push("LOWER(p.name) LIKE LOWER($" + (values.length + 1) + ")");
      values.push(`%${params.namePattern}%`);
    }

    // Filter by availability
    if (params.available !== undefined) {
      conditions.push("p.is_available = $" + (values.length + 1));
      values.push(params.available === "true");
    }

    // Filter by price range
    if (params.minPrice !== undefined) {
      conditions.push("p.price >= $" + (values.length + 1));
      values.push(parseFloat(params.minPrice));
    }
    if (params.maxPrice !== undefined) {
      conditions.push("p.price <= $" + (values.length + 1));
      values.push(parseFloat(params.maxPrice));
    }

    // Filter by brand
    if (params.brand !== undefined) {
      conditions.push("LOWER(p.brand) = LOWER($" + (values.length + 1) + ")");
      values.push(params.brand);
    }

    // Filter by category
    if (params.category !== undefined) {
      conditions.push("LOWER(p.category) = LOWER($" + (values.length + 1) + ")");
      values.push(params.category);
    }

    // Filter by category_id
    if (params.category_id !== undefined) {
      conditions.push("p.category_id = $" + (values.length + 1));
      values.push(parseInt(params.category_id));
    }

    // Add WHERE clause if there are any conditions
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // Sorting
    if (params.sort === "price_asc") {
      query += " ORDER BY p.price ASC";
    } else if (params.sort === "price_desc") {
      query += " ORDER BY p.price DESC";
    } else {
      query += " ORDER BY p.product_id"; // default sorting
    }

    const { rows } = await pool.query(query, values);
    return params.name ? rows[0] : rows; // Return single product for name search
  },

  // Get products by category
  getByCategory: async (categoryId) => {
    const { rows } = await pool.query(
      `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.category_id = $1
      ORDER BY p.product_id;
    `,
      [categoryId]
    );
    return rows;
  },
};

module.exports = ProductDB;

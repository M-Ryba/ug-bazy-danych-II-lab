const { pool } = require("../config/db");

const ReviewDB = {
  // Get all reviews
  getAll: async () => {
    const { rows } = await pool.query(`
      SELECT r.*,
             p.name as product_name,
             u.username as username
      FROM reviews r
      JOIN products p ON r.product_id = p.product_id
      JOIN users u ON r.user_id = u.user_id
      ORDER BY r.created_at DESC;
    `);
    return rows;
  },

  // Get review by id
  getById: async (id) => {
    const { rows } = await pool.query(
      `
      SELECT r.*,
             p.name as product_name,
             u.username as username
      FROM reviews r
      JOIN products p ON r.product_id = p.product_id
      JOIN users u ON r.user_id = u.user_id
      WHERE r.review_id = $1;
    `,
      [id]
    );
    return rows[0];
  },

  // Get reviews by product id
  getByProductId: async (productId) => {
    const { rows } = await pool.query(
      `
      SELECT r.*, u.username
      FROM reviews r
      JOIN users u ON r.user_id = u.user_id
      WHERE r.product_id = $1
      ORDER BY r.created_at DESC;
    `,
      [productId]
    );
    return rows;
  },

  // Get reviews by user id
  getByUserId: async (userId) => {
    const { rows } = await pool.query(
      `
      SELECT r.*, p.name as product_name
      FROM reviews r
      JOIN products p ON r.product_id = p.product_id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC;
    `,
      [userId]
    );
    return rows;
  },

  // Create new review
  create: async (review) => {
    const { rows } = await pool.query(
      `INSERT INTO reviews (product_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *;`,
      [review.product_id, review.user_id, review.rating, review.comment]
    );
    return rows[0];
  },

  // Update review
  update: async (id, updates) => {
    const allowedFields = ["rating", "comment"];

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
      UPDATE reviews
      SET ${setColumns.join(", ")}
      WHERE review_id = $${paramCount}
      RETURNING *;
    `;

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Delete review
  delete: async (id) => {
    const { rows } = await pool.query("DELETE FROM reviews WHERE review_id = $1 RETURNING *;", [id]);
    return rows[0];
  },

  // Check if a user has already reviewed a product
  findByUserAndProduct: async (userId, productId) => {
    const { rows } = await pool.query("SELECT * FROM reviews WHERE user_id = $1 AND product_id = $2;", [userId, productId]);
    return rows[0];
  },
};

module.exports = ReviewDB;

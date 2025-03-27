const { pool } = require("../config/db");

const UserDB = {
  // Get all users
  getAll: async () => {
    const { rows } = await pool.query("SELECT user_id, username, email, first_name, last_name FROM users ORDER BY user_id;");
    return rows;
  },

  // Get user by id
  getById: async (id) => {
    const { rows } = await pool.query("SELECT user_id, username, email, first_name, last_name FROM users WHERE user_id = $1;", [id]);
    return rows[0];
  },

  // Get user with reviews
  getWithReviews: async (id) => {
    const user = await UserDB.getById(id);
    if (!user) return null;

    const { rows: reviews } = await pool.query(
      `
      SELECT r.*, p.name as product_name
      FROM reviews r
      JOIN products p ON r.product_id = p.product_id
      WHERE r.user_id = $1;
    `,
      [id]
    );

    return { ...user, reviews };
  },

  // Create new user
  create: async (user) => {
    const { rows } = await pool.query(
      `INSERT INTO users (username, email, password_hash, first_name, last_name)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING user_id, username, email, first_name, last_name;`,
      [user.username, user.email, user.password_hash, user.first_name, user.last_name]
    );
    return rows[0];
  },

  // Update user
  update: async (id, updates) => {
    const allowedFields = ["username", "email", "password_hash", "first_name", "last_name"];

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
      UPDATE users
      SET ${setColumns.join(", ")}
      WHERE user_id = $${paramCount}
      RETURNING user_id, username, email, first_name, last_name;
    `;

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Delete user
  delete: async (id) => {
    const { rows } = await pool.query("DELETE FROM users WHERE user_id = $1 RETURNING user_id, username, email, first_name, last_name;", [id]);
    return rows[0];
  },

  // Find user by username
  findByUsername: async (username) => {
    const { rows } = await pool.query("SELECT * FROM users WHERE username = $1;", [username]);
    return rows[0];
  },

  // Find user by email
  findByEmail: async (email) => {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1;", [email]);
    return rows[0];
  },
};

module.exports = UserDB;

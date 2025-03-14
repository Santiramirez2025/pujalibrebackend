const pool = require("../utils/db");

const createUser = async (email, passwordHash, role) => {
  const { rows } = await pool.query(
    "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *",
    [email, passwordHash, role]
  );
  return rows[0];
};

const findUserByEmail = async (email) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return rows[0];
};

module.exports = { createUser, findUserByEmail };


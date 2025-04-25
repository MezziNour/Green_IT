const pool = require("./db");
const bcrypt = require("bcrypt");

const createUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.execute(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword]
  );
  return result.insertId;
};

const findUserByUsername = async (username) => {
  const [rows] = await pool.execute("SELECT * FROM users WHERE username = ?", [
    username,
  ]);
  return rows[0];
};

const findUserById = async (id) => {
  const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
};

const updateProfileImage = async (userId, filename) => {
  await pool.execute("UPDATE users SET profile_image = ? WHERE id = ?", [
    filename,
    userId,
  ]);
};

module.exports = {
  createUser,
  findUserByUsername,
  findUserById,
  updateProfileImage,
};

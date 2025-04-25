const pool = require("./db");

const createItem = async (text, image, listId) => {
  const [result] = await pool.execute(
    "INSERT INTO items (text, done, image, list_id) VALUES (?, false, ?, ?)",
    [text, image, listId]
  );
  return result.insertId;
};

const getItemsByList = async (listId) => {
  const [rows] = await pool.execute("SELECT * FROM items WHERE list_id = ?", [
    listId,
  ]);
  return rows;
};

const updateItem = async (id, text, done, listId) => {
  await pool.execute(
    "UPDATE items SET text = ?, done = ? WHERE id = ? AND list_id = ?",
    [text, done, id, listId]
  );
};

const deleteItem = async (id, listId) => {
  await pool.execute("DELETE FROM items WHERE id = ? AND list_id = ?", [
    id,
    listId,
  ]);
};

module.exports = { createItem, getItemsByList, updateItem, deleteItem };

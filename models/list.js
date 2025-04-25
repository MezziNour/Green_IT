const pool = require('./db');

const createList = async (name, image, userId) => {
  const [result] = await pool.execute(
    'INSERT INTO lists (name, image, user_id) VALUES (?, ?, ?)',
    [name, image, userId]
  );
  return result.insertId;
};

const getListsByUser = async (userId) => {
  const [rows] = await pool.execute('SELECT * FROM lists WHERE user_id = ?', [userId]);
  return rows;
};

const getListById = async (id, userId) => {
  const [rows] = await pool.execute('SELECT * FROM lists WHERE id = ? AND user_id = ?', [id, userId]);
  return rows[0];
};

const updateList = async (id, name, image, userId) => {
  await pool.execute('UPDATE lists SET name = ?, image = ? WHERE id = ? AND user_id = ?', [name, image, id, userId]);
};

const fs = require('fs').promises;

const deleteList = async (id, userId) => {
  // Récupérer le nom du fichier image depuis la base
  const [rows] = await pool.execute(
    'SELECT image FROM lists WHERE id = ? AND user_id = ?',
    [id, userId]
  );

  if (rows.length > 0 && rows[0].image) {
    const imagePath = `public/uploads/${rows[0].image}`; // adapte selon où tu stockes les images

    try {
      await fs.unlink(imagePath);
      console.log(`Image supprimée : ${imagePath}`);
    } catch (err) {
      console.error(`Erreur lors de la suppression de l’image : ${err.message}`);
    }
  }

  // Supprimer la liste
  await pool.execute(
    'DELETE FROM lists WHERE id = ? AND user_id = ?',
    [id, userId]
  );
};

module.exports = { createList, getListsByUser, getListById, updateList, deleteList };

const express = require("express");
const router = express.Router();
const listModel = require("../models/list");
const itemModel = require("../models/item");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../models/db");

router.use((req, res, next) => {
  if (!req.session.userId) return res.redirect("/");
  next();
});

router.post("/delete", async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "Invalid or empty list of IDs" });
  }
  try {
    const placeholders = ids.map(() => "?").join(", ");
    const query = `DELETE FROM lists WHERE id IN (${placeholders})`;
    await db.query(query, ids);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting lists:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const listsDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(listsDir)) fs.mkdirSync(listsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, listsDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const lists = await listModel.getListsByUser(req.session.userId);

    await Promise.all(
      lists.map(async (list) => {
        const items = await itemModel.getItemsByList(list.id);
        list.total = items.length;
        list.doneCount = items.filter((i) => i.done).length;
      })
    );

    res.render("dashboard", { lists });
  } catch (error) {
    console.error(error);
    res.send("Error loading dashboard.");
  }
});

router.post("/create", upload.single("image"), async (req, res) => {
  const { name } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    await listModel.createList(name, image, req.session.userId);
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.send("Error creating list.");
  }
});

router.post("/:id/delete", async (req, res) => {
  const listId = req.params.id;
  try {
    await listModel.deleteList(listId, req.session.userId);
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Error deleting list:", err);
    res.status(500).send("Erreur lors de la suppression de la liste.");
  }
});

module.exports = router;

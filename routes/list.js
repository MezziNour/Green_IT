const express = require("express");
const router = express.Router();
const listModel = require("../models/list");
const itemModel = require("../models/item");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

router.use((req, res, next) => {
  if (!req.session.userId) return res.redirect("/");
  next();
});

const itemsDir = path.join(__dirname, "../public/uploads/items");
if (!fs.existsSync(itemsDir)) {
  fs.mkdirSync(itemsDir, { recursive: true });
}

const uploadItem = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, itemsDir),
    filename: (req, file, cb) =>
      cb(null, Date.now() + path.extname(file.originalname)),
  }),
});

router.get("/:id", async (req, res, next) => {
  const listId = req.params.id;
  try {
    const list = await listModel.getListById(listId, req.session.userId);
    if (!list) return res.send("List not found.");
    const items = await itemModel.getItemsByList(listId);
    res.render("list", { list, items });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/item", uploadItem.single("image"), async (req, res, next) => {
  const listId = req.params.id;
  const { text } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    await itemModel.createItem(text, image, listId);
    res.redirect(`/list/${listId}`);
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).send("Error adding item.");
  }
});

router.post("/:id/item/:itemId/toggle", async (req, res, next) => {
  const listId = req.params.id;
  const itemId = req.params.itemId;
  try {
    const items = await itemModel.getItemsByList(listId);
    const item = items.find((i) => i.id == itemId);
    if (!item) return res.send("Item not found.");
    await itemModel.updateItem(itemId, item.text, !item.done, listId);
    res.redirect(`/list/${listId}`);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/item/:itemId/delete", async (req, res, next) => {
  const listId = req.params.id;
  const itemId = req.params.itemId;
  try {
    await itemModel.deleteItem(itemId, listId);
    res.redirect(`/list/${listId}`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

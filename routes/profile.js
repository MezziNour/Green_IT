const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const userModel = require("../models/user");
const listModel = require("../models/list");
const itemModel = require("../models/item");

const router = express.Router();

const avatarDir = path.join(__dirname, "../public/uploads/profiles");
if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarDir),
  filename: (req, file, cb) =>
    cb(null, `user-${req.session.userId}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

router.get("/", async (req, res, next) => {
  try {
    const user = await userModel.findUserById(req.session.userId);

    const lists = await listModel.getListsByUser(req.session.userId);
    await Promise.all(
      lists.map(async (list) => {
        const items = await itemModel.getItemsByList(list.id);
        list.total = items.length;
        list.doneCount = items.filter((i) => i.done).length;
        list.percent = list.total
          ? Math.round((list.doneCount / list.total) * 100)
          : 0;
      })
    );

    res.render("profile", { pageTitle: "Profil", user, lists });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/upload-avatar",
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      if (req.file) {
        await userModel.updateProfileImage(
          req.session.userId,
          req.file.filename
        );
      }
      res.redirect("/profile");
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;

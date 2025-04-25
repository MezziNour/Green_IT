const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const bcrypt = require("bcrypt");

router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userModel.findUserByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render("login", { error: "Invalid credentials." });
    }
    req.session.userId = user.id;
    req.session.username = user.username;
    res.redirect("/dashboard");
  } catch {
    res.render("login", { error: "Login failed." });
  }
});

router.get("/register", (req, res) => {
  res.render("register", { error: null });
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    if (await userModel.findUserByUsername(username)) {
      return res.render("register", { error: "Username exists." });
    }
    await userModel.createUser(username, password);
    res.redirect("/auth/login");
  } catch {
    res.render("register", { error: "Registration failed." });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/auth/login");
});

module.exports = router;

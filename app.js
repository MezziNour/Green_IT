const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "thisIsASecretThatShouldStaySecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  const openPaths = [
    "/",
    "/home",
    "/images",
    "/videos",
    "/auth/login",
    "/auth/register",
    "/auth/logout",
  ];

  if (openPaths.some((p) => req.path === p || req.path.startsWith(p + "/"))) {
    return next();
  }

  if (!req.session.userId) {
    return res.redirect("/auth/login");
  }
  next();
});

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const listRoutes = require("./routes/list");
const profileRoutes = require("./routes/profile");
const pageRoutes = require("./routes/pages");

app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/list", listRoutes);
app.use("/profile", profileRoutes);
app.use("/", pageRoutes);

app.use((req, res) => {
  res.redirect("/home");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
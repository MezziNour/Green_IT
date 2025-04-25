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

// Serve static files and add cache control for videos and other static assets
app.use(
  "/videos", 
  express.static(path.join(__dirname, "public/videos"), {
    maxAge: "1y",  // Cache les vidéos pendant un an
    setHeaders: (res, path) => {
      if (path.endsWith(".webm") || path.endsWith(".mp4")) {
        res.set("Cache-Control", "public, max-age=31536000, immutable");
      }
    }
  })
);

app.use(
  "/images", 
  express.static(path.join(__dirname, "public/images"), {
    maxAge: "30d", // Cache les images pendant 30 jours
    setHeaders: (res, path) => {
      if (path.endsWith(".webp") || path.endsWith(".jpg") || path.endsWith(".png")) {
        res.set("Cache-Control", "public, max-age=2592000, immutable"); // 30 jours
      }
    }
  })
);

// Serve other static files (like stylesheets)
app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: "7d", // Cache les autres fichiers statiques (styles, scripts) pendant 7 jours
    setHeaders: (res, path) => {
      res.set("Cache-Control", "public, max-age=604800, immutable"); // 7 jours
    }
  })
);

// Authentication and authorization middleware
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

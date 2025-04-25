const express = require("express");
const router = express.Router();

const accordionData = [
  {
    title: "Production hardware",
    text: "19 % des émissions proviennent de la production de matériel (fabrication de serveurs, data centers, smartphones, etc.).",
  },
  {
    title: "Stockage & transfert",
    text: "29 % des émissions sont liées au stockage et au transfert de données sur Internet (réseaux, data centers).",
  },
  {
    title: "Usage des appareils",
    text: "52 % des émissions proviennent de l’utilisation des appareils par les utilisateurs finaux (ordinateur, smartphone).",
  },
];

router.get(["/", "/home"], (req, res) => {
  res.render("home", {
    pageTitle: "Accueil",
    accordionData,
  });
});

router.get("/profile", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/auth/login");
  }
  res.render("profile", {
    pageTitle: "Profil",
    username: req.session.username,
  });
});

module.exports = router;

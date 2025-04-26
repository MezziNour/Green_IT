# Green_IT
Site internet d'une to-do list éco-conçu

# Installation et configuration

Cloner le dépôt :

git clone https://github.com/MezziNour/Green_IT.git

Installer les dépendances :

npm install

Configurer la base de données :

Créer une base todo_app dans MySQL.

Importer le schéma SQL :

mysql -u root -p todo_app < others/todo_app.sql

Adapter les informations de connexion dans models/db.js :

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: " ", // Mettre son mot de passe mysql ici
  database: "todo_app",
});

module.exports = pool;

# Contribuer au projet

Forker ce dépôt.

Créer une branche feature (git checkout -b feature/ma-fonctionnalité).

Commiter vos changements (git commit -m "ajout de ...").

Pousser sur votre fork (git push origin feature/ma-fonctionnalité).

Ouvrir une Pull Request.

# Exécution du projet

Démarrer le serveur en mode développement :

npm start

L’application sera accessible sur http://localhost:3000.

# Fonctionnalités principales

Authentification : inscription, connexion, déconnexion.

Tableau de bord : création, suppression de listes, ajout d’image.

Détails d’une liste : ajout, suppression, toggle des items, upload d’image par tâche.

Profil utilisateur : upload d’avatar, affichage du nombre de listes et progression.

Page "Avant" / "Après" : démonstration de l’impact environnemental avant et après optimisation.


# Pour cette dernière version optimisée du site, nous avons initialisé un nouveau dépôt Git, d’où l’absence de l’historique des contributions des autres membres.


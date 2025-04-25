const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: " ", // Mettre son MDP mysql ici
  database: "todo_app",
});

module.exports = pool;

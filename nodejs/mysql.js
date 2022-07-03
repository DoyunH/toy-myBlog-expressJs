const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "lucas9436",
  database: "myblog",
});

connection.connect();

connection.query("SELECT 1 + 1 AS solution", function (error, results, fields) {
  if (error) throw error;
  console.log("The solution is: ", results[0].solution);
});

connection.end();

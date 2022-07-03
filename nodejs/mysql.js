const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "lucas9436",
  database: "myblog",
});

connection.connect();

connection.query("SELECT * FROM topic", function (error, results, fields) {
  if (error) {
    console.log("error occured", error);
  }
  console.log("The solution is: ", results);
});

connection.end();

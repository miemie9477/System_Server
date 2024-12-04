
const mysql = require('mysql');

const connection = mysql.createConnection({
  host:"localhost",
  user: "root",
  password: "",
  database: "group_11"},
)

connection.connect((error) => {
  if (error) console.log(error);
  else console.log('Connected to the remote database!');
});

connection.on('error', function(err) {
    console.log("[mysql error]",err);
});

module.exports = {
    connection
}
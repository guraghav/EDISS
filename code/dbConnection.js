var mysql = require('mysql');

//RDS
// var pool = mysql.createPool({
//   connectionLimit: 100,
//   //host: 'project3.cyoccgzoowfi.us-east-1.rds.amazonaws.com',
//   user: 'root',
//   password: 'project3',
//   database: 'project3',
//   debug: false
// });

//local
var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'edissdbinstance.cyoccgzoowfi.us-east-1.rds.amazonaws.com',
  user: 'root',
  password: 'project3',
  database: 'project3',
  debug: false
});

// pool.getConnection(function(err, connection) {
// 	if (err) {
// 		connection.release();
// 		console.log('Error in connection database');
// 		return;
// 	}
// 	console.log('connected as id ' + connection.threadId);
// });

module.exports = pool;



var express = require('express');
var router = express.Router();
var pool = require('../dbConnection');
var _ = require('underscore');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST login */
router.post('/login', function(req, res, next) {
   var userInfo = {
		username: req.body.username,
		password: req.body.password,
	};
	pool.getConnection(function (err, connection) {
		if (err) {
			//connection.release();
			res.redirect("/");   
			return;            
		}

		console.log("connected as id " + connection.threadId);
		connection.query('SELECT * FROM users where username = ? and password = ?',[userInfo.username, userInfo.password], 
		function(err, results) {
			connection.release();
			if (!err) {
				if (!results[0]) {
	    			res.render('index', { title: 'Login', errorMessage: 'The username and password combination was not correct.'});
	    			return;
			    }
			    else {
			    	req.session.userId = userInfo.username;
			    	var successMessage = 'Welcome ' + results[0].firstName;
					res.render('update', {title: 'Home Page', successMessage: successMessage});
					return;
			    }
			}
		});	
		connection.on('error', function(err) {      
			res.redirect("/");               
        });
	});
});

router.get('/register', function(req, res, next) {
	res.render('registration', { title: 'Express' });

});
/*POST registerUser*/
router.post('/registerUser', function(req, res, next) {
	if ((!req.body.username) || (!req.body.password) || (!req.body.fname) || (!req.body.lname) ||
		(!req.body.email) || (!req.body.address) || (!req.body.city) || (!req.body.state) || (!req.body.zip) ) {
		res.render('update', {title: 'Product Addition', errorMessage: 'There was a problem with this action'});
	} else {
		var userInfo = {
		username: req.body.username,
		password: req.body.password,
	 	firstName: req.body.fname,
	 	lastName: req.body.lname,
	 	email: req.body.email,
	 	role: 'customer',
		address: req.body.address,
	 	city: req.body.city,
	 	state: req.body.state,
	 	zip: req.body.zip,
		};
		pool.getConnection(function (err, connection) {
			if (err) {
	           	res.json({"code" : 100, "status" : "Error in connection database"});
	           	return;
			} 
			console.log("connected as id " + connection.threadId);
			connection.query('INSERT INTO users SET ?', userInfo, function (err, result) {
				connection.release();
				if (!err) {
					res.render('update', {title: 'Registration', errorMessage: 'Your account has been registered'});
					return;
				}
			});

			connection.on('error', function (err) {      
				if (err.code == 'ER_DUP_ENTRY') {
					res.render('update', {title: 'Registration', errorMessage: 'There was a problem with this action'});
				} else {
               		res.json({"code" : 100, "status" : "Error in connection database"});
					return;
				}        
        	});
		});
	} 
});

/* POST logout */
router.post('/logout', function(req, res, next) {
   if (req.session.userId) {
		delete req.session.userId;
		res.send("You have been logged out.");
	} else {
		res.send("You are not currently logged in.");
	}
});


/* POST updateInfo */
router.post('/updateInfo', function(req, res, next) {
	if (req.session.userId) {
		var queryString = 'UPDATE users SET ';
		if (req.body.username) {
			queryString = queryString + 'username =\'' + req.body.username + '\',';
		}
		if (req.body.password) {
			queryString = queryString + 'password =\'' + req.body.password + '\',' ;
		}
		if (req.body.fname) {
			queryString += 'firstName =\'' + req.body.fname + '\',' ;
		}
		if (req.body.lname) {
			queryString += 'lastName =\'' + req.body.lname + '\',' ;
		}
		if (req.body.email) {
			queryString += 'lastName =\'' + req.body.email + '\',' ;
		}
		if (req.body.address) {
			queryString += 'address =\'' + req.body.address + '\',' ;
		}
		if (req.body.city) {
			queryString += 'city =\'' + req.body.city + '\',' ;
		}
		if (req.body.state) {
			queryString += 'state =\'' + req.body.state + '\',' ;
		}
		if (req.body.zip) {
			queryString += 'zip =\'' + req.body.zip + '\',' ;
		}
		
		if (queryString.length > 17) {
			var newQueryString = queryString.substr(0, queryString.length - 1);
			newQueryString += ' WHERE username = \'' + req.session.userId + '\'';
			
			pool.getConnection(function (err, connection) {
				if (err) {
					//connection.release();
					res.json({"code" : 100, "status" : "Error in connection database"});
           			return;
				}

				console.log("connected as id " + connection.threadId);

				connection.query(newQueryString, function (err, result) {
					connection.release();
					if (!err) {
						res.render('update', {title: 'Update Contact Information', successMessage: 'Your information has been updated'});
						return;     
					}
				});
				connection.on('error', function(err) {      
					res.render('update', {title: 'Update Contact Information', errorMessage: 'There was a problem with this action'});		            
		        	return;
		        });
			});
		} else {
			res.render('update', {title: 'Update Contact Information', successMessage: 'Your information has been updated'});
		}
	} else {
		res.render('update', {title: 'Update Contact Information', errorMessage: 'You must be logged in to perform this action'});
	}
});

/* POST addProducts */
router.post('/addProducts', function(req, res, next) {
	if (req.session.userId && req.session.userId == 'jadmin') {
		var product = {
			productId: req.body.productId,
			name: req.body.name,
			productDescription: req.body.productDescription,
			product_group: req.body.group
		}

		pool.getConnection(function (err, connection) {
			if (err) {
				//connection.release();
				res.json({"code" : 100, "status" : "Error in connection database"});
       			return;
			}
			console.log("connected as id " + connection.theradId);

			connection.query('INSERT INTO products SET ?', product, function (err, result) {
				connection.release();
				if (!err) {
					res.render('update', {title: 'Product Addition', successMessage: 'The product has been added to the system'});
					return;
				}
			});


			connection.on('error', function (err) {      
				if (err.code == 'ER_DUP_ENTRY') {
					res.render('update', {title: 'Product Addition', errorMessage: 'There was a problem with this action'});
					return;
				} else {
					console.log("Error in connection database");
					return;
				}
	        });
		});
	} else if(req.session.userId) {
		res.render('update', {title: 'Product Addition', errorMessage: 'Only admin can perform this action'});
	} else{
		res.render('update', {title: 'Product Addition', errorMessage: 'You must be logged in to perform this action'});
	}
});

/* POST modifyProduct */
router.post('/modifyProduct', function(req, res, next) {
	if (req.session.userId && req.session.userId == 'jadmin') {
		if ((!req.body.productId) || (!req.body.name) || (!req.body.productDescription)) {
			res.render('update', {title: 'Product Addition', errorMessage: 'There was a problem with this action'});
		} else {

			pool.getConnection(function (err, connection) {
				if (err) {
					//connection.release();
					res.json({"code" : 100, "status" : "Error in connection database"});
       				return;
				}

				console.log("connected as id " + connection.threadId);

				connection.query('UPDATE products SET name = ?, productDescription = ? WHERE productId = ?', [req.body.name, req.body.productDescription, req.body.productId], 
					function (err, result) {
					connection.release();
					if (!err) {
						res.render('update', {title: 'Product Addition', successMessage: 'The product information has been updated'});
						return;
					}
				});

				connection.on('error', function (err) {
					res.json({"code": 100, "status": "Error in connection database"});
					return;
				});

			});
		}
	} else if(req.session.userId) {
		res.render('update', {title: 'Product Addition', errorMessage: 'Only admin can perform this action'});
	} else{
		res.render('update', {title: 'Product Addition', errorMessage: 'You must be logged in to perform this action'});
	}
});

/* POST viewUsers */
router.post('/viewUsers', function(req, res, next) {
 	if (req.session.userId && (req.session.userId == 'jadmin' || req.session.userId == 'jadmin ')) {
		if (!req.body.fname) {
			req.body.fname = '';
		} else {
			req.body.fname = req.body.fname.replace(/'/g, "");
		}
		
		if (!req.body.lname) {
			req.body.lname = '';
		} else {
			req.body.lname = req.body.lname.replace(/'/g, "");
		}
		var queryString = 'SELECT firstName, lastName from users';
		if (req.body.fname.length > 0 && req.body.lname.length > 0) {
			queryString += ' WHERE firstName LIKE \'%' + req.body.fname + '%\' AND lastName LIKE \'%' + req.body.lname + '%\'';
		} else if (req.body.fname.length > 0) {
			queryString += ' WHERE firstName LIKE \'%' + req.body.fname + '%\'';
		} else if (req.body.lname.length > 0) {
			queryString += ' WHERE lastName LIKE \'%' + req.body.lname + '%\'';
		}

		pool.getConnection(function (err, connection) {
			if (err) {
				//connection.release();
				res.json({"code" : 100, "status" : "Error in connection database"});
   				return;
			}
			console.log("connected as id " + connection.threadId);

			connection.query(queryString, function (err, result) {
				connection.release();
				if (!err) {
					res.render('view', {title: 'View users', results: JSON.stringify(result)});
					return;
				}
			});

			connection.on('error', function (err) {
				res.json({"code": 100, "status": "Error in connection database"});
				return;
			});
		}); 
	} else if(req.session.userId) {
		res.render('update', {title: 'View Users', errorMessage: 'Only admin can perform this action'});
	} else{
		res.render('update', {title: 'View Users', errorMessage: 'You must be logged in to perform this action'});
	}
});

/* POST viewProducts */
router.post('/viewProducts', function(req, res, next) {
	var queryString = '';
	queryString = 'SELECT name from products WHERE';
	if (req.body.productId) {
		queryString += ' productId = \'' + req.body.productId + '\'';
	}
	if (req.body.group) {
		if (queryString.length > 31) {
			queryString += ' AND product_group = \'' + req.body.group + '\'';
		} else {
			queryString += ' product_group = \'' + req.body.group + '\'';
		}
	}
	if (req.body.keyword) {
		if (queryString.length > 31) {

			queryString += ' AND (name LIKE \'%' + req.body.keyword + '%\' OR productDescription LIKE \'%' + req.body.keyword + '%\')';
		} else {
			queryString += ' name LIKE \'%' + req.body.keyword + '%\' OR productDescription LIKE \'%' + req.body.keyword + '%\'';
		}
	}
	if (queryString.length == 31) {
		queryString = queryString.substr(0, queryString.length-6);
	}

	pool.getConnection(function (err, connection) {
		if(err) {
			//connection.release();
			res.json({"code" : 100, "status" : "Error in connection database"});
   			return;
   		}
   		
   		console.log("View Products connected as id " + connection.threadId);

		connection.query(queryString, function (err, result) {
			connection.release();
			if (!err) {
				if (result.length == 0) {
					res.render('update', {title: 'View Products', successMessage: 'There were no products in the system that met that criteria'});
					return;
				} else {
					res.render('view', {title: 'Product Addition', results: JSON.stringify(result)});
					return;
				}
			}
		});

		connection.on('error', function (err) {
			res.json({"code": 100, "status": "Error in connection database"});
			return;
		});
		
	});
});


module.exports = router;

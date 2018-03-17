var express = require('express');
var app = express();
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "kristiqn",
  password: "hacktues",
  database : "InternShipper"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get('/login/', function (req, res) {
	console.log(req.query.email);
	if (!req.query.email) {
		res.json({Error : 'Please enter a valid email'});
	} else if (!req.query.email) {
		res.json({Error : 'Please enter a valid password'});
	}

	con.query('SELECT * FROM Person WHERE email = "' + req.query.email + '";' , function (err, result, fields) {
		console.log(result);
		if (result.passwordHash === req.query.password) {
			res.json(result);
		}
	});
});

app.listen(3000);

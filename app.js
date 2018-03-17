var express = require('express');
var app = express();
var Cryptr = require('cryptr'),
    cryptr = new Cryptr('myTotalySecretKey');
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
		var password = cryptr.decrypt(result.passwordHash);
		if (password === req.query.password) {
			res.json(result);
		} else {
			res.json({Error : 'Password is incorrect'});
		}
	});
});

app.get('/offers', function (req, res) {
   con.query('SELECT * from Offer', function(err, rows, fields) {
   if (!err)
     res.json(rows);
   else
     console.log('Error while performing Query.');
 });
});

app.get('/offers/hardware', function (req, res) {
   con.query('SELECT * FROM Offer WHERE offerType = "HARDWARE"', function(err, rows, fields) {
   if (!err)
     res.json(rows);
   else
     console.log('Error while performing Query.');
 });
});

app.get('/offers/software', function (req, res) {
   con.query('SELECT * FROM Offer WHERE offerType = "SOFTWARE"', function(err, rows, fields) {
   if (!err)
     res.json(rows);
   else
     console.log('Error while performing Query.');
 });
});

app.get('/offers/embedded', function (req, res) {
   con.query('SELECT * FROM Offer WHERE offerType = "EMBEDDED"', function(err, rows, fields) {
   if (!err)
     res.json(rows);
   else
     console.log('Error while performing Query.');
 });
});

app.get('/publisher/offers', function (req, res) {
   con.query('SELECT * FROM Offer WHERE publisherId = ' + req.get('publisherid'), function(err, rows, fields) {
   if (!err)
     res.json(rows);
   else
     console.log('Error while performing Query.');
 });
});

app.get('/user/applications', function (req, res) {
   con.query('SELECT * FROM Application INNER JOIN Offer ON Offer.id = Application.offerId WHERE userId = ' + req.get('userid'), function(err, rows, fields) {
   if (!err)
     res.json(rows);
   else
     console.log('Error while performing Query.');
 });
});

app.get('/publisher/applications', function (req, res) {
   con.query('SELECT * FROM Application INNER JOIN Offer ON Offer.id = Application.offerId WHERE publisherId = ' + req.get('publisherid'), function(err, rows, fields) {
   if (!err)
     res.json(rows);
   else
     console.log('Error while performing Query.');
 });
});

app.listen(3000);

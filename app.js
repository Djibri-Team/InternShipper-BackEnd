var express = require('express');
var app = express();
var Cryptr = require('cryptr'),
    cryptr = new Cryptr('myTotalySecretKey');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database : "InternShipper"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get('/login', function (req, res) {
	if (!req.query.email) {
		res.json({Error : 'Please enter a valid email'});
	} else if (!req.query.email) {
		res.json({Error : 'Please enter a valid password'});
	}

	con.query('SELECT * FROM Person WHERE email = "' + req.query.email + '";' , function (err, result, fields) {
		if (result.passwordHash === req.query.password) {
		console.log(result);
		var password = cryptr.decrypt(result.passwordHash);
		if (password === req.query.password) {
			res.json(result);
		} else {
			res.json({Error : 'Password is incorrect'});
		}
	   };
  });
});

app.get('/offers', function (req, res) {
   con.query('SELECT * from Offer', function(err, rows, fields) {
   if (!err) {
     res.json(rows);
   }
   else {
     console.log('Error while performing Query.');
     res.end('error');
   }
 });
});

app.get('/offers/hardware', function (req, res) {
   con.query('SELECT * FROM Offer WHERE offerType = "HARDWARE"', function(err, rows, fields) {
   if (!err) {
     res.json(rows);
   }
   else {
     console.log('Error while performing Query.');
     res.end('error');
   }
 });
});

app.get('/offers/software', function (req, res) {
   con.query('SELECT * FROM Offer WHERE offerType = "SOFTWARE"', function(err, rows, fields) {
   if (!err) {
     res.json(rows);
   }
   else {
     console.log('Error while performing Query.');
     res.end('error');
   }
 });
});

app.get('/offers/embedded', function (req, res) {
   con.query('SELECT * FROM Offer WHERE offerType = "EMBEDDED"', function(err, rows, fields) {
   if (!err) {
     res.json(rows);
   }
   else {
     console.log('Error while performing Query.');
     res.end('error');
   }
 });
});

app.get('/publisher/offers', function (req, res) {
   con.query('SELECT * FROM Offer WHERE publisherId = ' + req.query.publisherId + ';', function(err, rows, fields) {
   if (!err) {
     res.json(rows);
   }
   else {
     console.log('Error while performing Query.');
     res.end('error');
   }
 });
});

app.get('/user/applications', function (req, res) {
   con.query('SELECT * FROM Application INNER JOIN Offer ON Offer.id = Application.offerId WHERE userId = ' + req.query.userId + ';', function(err, rows, fields) {
   if (!err) {
     res.json(rows);
   }
   else {
     console.log('Error while performing Query.');
     res.end('error');
   }
 });
});

app.get('/publisher/applications', function (req, res) {
   con.query('SELECT * FROM Application INNER JOIN Offer ON Offer.id = Application.offerId WHERE publisherId = ' + req.query.publisherId, function(err, rows, fields) {
   if (!err) {
     res.json(rows);
   } else {
     console.log('Error while performing Query.');
     res.end('error');
   }
 });
});

app.get('/publisher/applications/:id', function (req, res) {
  console.log(req.params.id);
  con.query('SELECT * FROM Application as a INNER JOIN Offer AS o ON a.offerId = o.id INNER JOIN Person AS p ON p.Id = o.publisherId OR a.userId = p.id ' +
 'WHERE a.id = ' + req.params.id + ';', function(err, rows, fields) {
   if (!err) {
     res.json(rows);
   } else {
     console.log('Error while performing Query.');
     res.end('error');
   }
 });
});

app.listen(3000);

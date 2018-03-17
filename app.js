var express = require('express');
var app = express();
var bodyParser
var Cryptr = require('cryptr'),
    cryptr = new Cryptr('myTotalySecretKey');
var mysql = require('mysql');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

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
	console.log(req.query.email);
	if (!req.query.email) {
		res.json({Error : 'Please enter a valid email'});
	} else if (!req.query.email) {
		res.json({Error : 'Please enter a valid password'});
	}
	con.query('SELECT * FROM Person WHERE email = "' + req.query.email + '"', function (err, result, fields) {
	   if (!err) {
		  console.log(result);
		  var password = cryptr.decrypt(result[0].passwordHash);
		  if (password === req.query.password) {
		  	res.json(result);
		  } else {
			  res.json({Error : 'Password is incorrect'});
		  }
	   } else {
		res.json(err);
	   }
	});
});

app.post('/register', function (req, res) {
	console.log(req);
	if (!req.body.firstName) {
		res.json({Error : 'Please enter a valid first name'});	
	} else if (!req.body.lastName) {
		res.json({Error : 'Please enter a valid last name'});	
	} else if (!req.body.email) {
		res.json({Error : 'Please enter a valid email'});
	} else if (!req.body.password) {
		res.json({Error : 'Please enter a valid password'});
	}
	
	var passwordHash = cryptr.encrypt(req.query.password);

	con.query('INSERT INTO Person(email, passwordHash, firstName, lastName, telephoneNumber, userType, description) VALUES("'+ req.body.email + '" , "' + passwordHash + '" , "' + req.body.firstName + '" , "' + req.body.lastName + '" , " ' + req.body.telephoneNumber + '" , "' + req.body.userRole + '" , "' + req.body.description + '")', function (err, result, fields) {
		if (err) {
			res.json(err);		
		}	
	});

	con.query('SELECT * FROM Person WHERE email = "' + req.body.email + '";', function (err, result, fields) {
		if (!err) {
			res.json(result[0]);		
		}	
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

app.get('/publisher/userOnOffer/:id', function (req, res) {
   con.query('SELECT a.applicationStatus, p.email, p.firstName, p.lastName, p.telephoneNumber, p.userType ' 
    + ' FROM Application as a LEFT JOIN Offer AS o ON a.offerId = o.id INNER JOIN Person AS p ON a.userId = p.id ' 
     + 'WHERE a.offerId' + res.param.id + ';', function(err, rows, fields) {
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

app.get('/user/applications/:id', function (req, res) {
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

app.post('/offers/add', function(req, res) {
  con.query('INSERT INTO Offer(publisherId, internTimeLength, workingHours, title, description, offerType) VALUES(' + req.body.publisherId  + ', ' +
  req.body.internTimeLength + ', ' + req.body.workingHours + ', ' + req.body.title + ', ' + req.body.description + ', ' + req.body.offerType + ');', function(err, result, fields) {
    if(err) {
      throw err;
    } 
    res.json('OK');
  });
});

app.post('/publisher/offer/status', function(req, res) {
  console.log(req.body);
  con.query('UPDATE Application SET applicationStatus = ' + "'" + req.body.applicationStatus + "'" + ' WHERE userId= ' 
    + req.body.userId + ' AND offerId='  + req.body.offerId + ';', function(err, result, fields) {
    if(err) {
      throw err;
    }
  res.json('OK');       
  });
});

app.listen(3000);

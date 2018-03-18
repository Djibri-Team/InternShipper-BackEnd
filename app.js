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

app.post('/login', function (req, res) {
	if (!req.body.email) {
		res.json({Error : 'Please enter a valid email'});
	} else if (!req.body.email) {
		res.json({Error : 'Please enter a valid password'});
	}
	con.query("SELECT * FROM UserAccount WHERE email = '" + req.body.email + "'", function (err, result, fields) {
	   if (!err) {
		  var passwordHash = cryptr.encrypt(req.body.password);
      if (result.length === 0) {
        res.json(err);
      }
		  if (result[0].userPassword === passwordHash) {
		  	res.json(result);
		  }
    } 
	});
});

app.post('/register', function (req, res) {
  console.log(req.body);
	if (!req.body.firstName) {
		res.json({Error : 'Please enter a valid first name'});	
	} else if (!req.body.lastName) {
		res.json({Error : 'Please enter a valid last name'});	
	} else if (!req.body.email) {
		res.json({Error : 'Please enter a valid email'});
	} else if (!req.body.password) {
		res.json({Error : 'Please enter a valid password'});
	}

	var passwordHash = cryptr.encrypt(req.body.password);

  con.query("INSERT INTO UserAccount(email, userPassword, firstName, lastName, userRole, description) VALUES('"
    + req.body.email + "' , '"
    + passwordHash + "' , '" 
    + req.body.firstName + "' , '" 
    + req.body.lastName + "' , '" 
    + req.body.userRole + "' , '" 
    + req.body.description + "')", function (err, result, fields) {
		if (err) {
			res.json(err);		
		} 
	});

	con.query("SELECT * FROM UserAccount WHERE email = '" + req.body.email + "';", function (err, result, fields) {
		if (!err) {
			res.json(result);		
		}	
	});
});

app.get('/offers', function (req, res) {
   con.query("SELECT * from Offer", function(err, rows, fields) {
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
   con.query("SELECT * FROM Offer WHERE offerType = 'HARDWARE'", function(err, rows, fields) {
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
   con.query("SELECT * FROM Offer WHERE offerType = 'SOFTWARE'", function(err, rows, fields) {
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
   con.query("SELECT * FROM Offer WHERE offerType = 'EMBEDDED'", function(err, rows, fields) {
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
  console.log(req.query);
   con.query("SELECT * FROM Offer WHERE publisherId = " + req.query.userId + ";", function(err, rows, fields) {
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
  console.log(req.query.offerId);
   con.query("SELECT * FROM Offer WHERE Offer.id = " + req.query.offerId + ";", function(err, rows, fields) {
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
   con.query("SELECT a.applicationStatus, p.email, p.firstName, p.lastName, p.userRole " 
    + " FROM Application as a LEFT JOIN Offer AS o ON a.offerId = o.id INNER JOIN UserAccount AS p ON a.userId = p.id " 
    + " WHERE a.offerId = " + res.param.id + ";", function(err, rows, fields) {
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
   con.query("SELECT * FROM Application INNER JOIN Offer ON Offer.id = Application.offerId WHERE userId = " + req.query.userId + ";", function(err, rows, fields) {
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
  con.query("SELECT * FROM Application as a INNER JOIN Offer AS o ON a.offerId = o.id " + 
    "INNER JOIN UserAccount AS p ON p.Id = o.publisherId OR a.userId = p.id " +
    "WHERE a.id = " + req.params.id + ";", function(err, rows, fields) {
   if (!err) {
     res.json(rows);
   } else {
     console.log('Error while performing Query.');
     res.end('error');
   }
 });
});

app.get('/publisher/applications', function (req, res) {
  console.log(req.query);
   con.query("SELECT * FROM Application INNER JOIN Offer ON Offer.id = Application.offerId WHERE publisherId = " + req.query.userId + ";", function(err, rows, fields) {
   if (!err) {
     res.json(rows);
   } else {
     console.log('Error while performing Query.');
     res.end('error');
   }
 });
});

app.get('/publisher/applications/:id', function (req, res) {
  con.query("SELECT * FROM Application as a INNER JOIN Offer AS o ON a.offerId = o.id " +
  "INNER JOIN UserAccount AS p ON p.Id = o.publisherId OR a.userId = p.id " +
  "WHERE a.id = " + req.params.id + ";", function(err, rows, fields) {
   if (!err) {
     res.json(rows);
   } else {
     console.log('Error while performing Query.');
     res.end('error');
   }
 });
});

app.post('/offers/add', function(req, res) {
  console.log(req.body);
  con.query("INSERT INTO Offer(publisherId, internTimeLength, companyName, workingHours, title, description, offerType) VALUES(" 
  + req.body.publisherId  + ", '" +
  req.body.internTimeLength + "', '" + req.body.companyName + "', " + req.body.workingHours + ", '" + req.body.title + "', '" + req.body.description + "', '" + req.body.offerType + "');", function(err, result, fields) {
    if(err) {
      throw err;
    } 
    res.json('OK');
  });
});

app.post('/publisher/offer/status', function(req, res) {
  console.log(req.body);
  con.query("UPDATE Application SET applicationStatus = '"
    + req.body.applicationStatus + "' WHERE userId= "
    + req.body.userId + " AND offerId= "  + req.body.offerId + ";", function(err, result, fields) {
    if(err) {
      throw err;
    }
  res.json('OK');       
  });
});

app.listen(3000);

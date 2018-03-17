var express = require('express');
var app = express();
const Sequelize = require('sequelize');

const sequelize = new Sequelize('InternShipper', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
});

const Person = sequelize.define('Person', {
    id : { 
      type : Sequelize.INTEGER, 
      primaryKey: true,
      autoIncrement: true
    },
    email : {
      type : Sequelize.STRING, 
      notNull : true
    },
    passwordHash : {
      type : Sequelize.STRING(128),
      notNull : true
    },
    firstName : {
      type : Sequelize.STRING(128),
      notNull : true
    },
    lastName : {
      type : Sequelize.STRING(128),
      notNull : true
    },
    personType : {
      type : Sequelize.ENUM('STUDENT', 'COMPANY'),
      notNull : true
    },
    telephoneNum : {
      type : Sequelize.STRING(32),
      notNull : true
    },
    descrpiption : {
      type : Sequelize.TEXT
    }
})


const Offer = sequelize.define('Offer',  {
  id : {
    type : Sequelize.INTEGER,
    primaryKey : true,
    autoIncrement : true
  },
  publisherId : {
    type : Sequelize.INTEGER,
    notNull : true,

    references : {
        model : Person,

        key : 'id'
    }
  },
  title : {
    type : Sequelize.STRING(128)
  },
  internTimeLength : {
    type : Sequelize.STRING(128)
  },
  workingHours : {
    type : Sequelize.INTEGER
  },
  descrpiption : {
    type : Sequelize.TEXT
  },
  offerType : {
    type : Sequelize.ENUM('Software', 'Hardware', 'Embedded')
  }
});

const Application = sequelize.define('Application', {
    id : {
    type : Sequelize.INTEGER,
    primaryKey : true,
    autoIncrement : true
  },
  offerId : {
    type : Sequelize.INTEGER,
    notNull : true,

    references : {
        model : Offer,

        key : 'id'
    }
  },
  userId : {
    type : Sequelize.INTEGER,
    notNull : true,

    references : {
        model : Person,

        key : 'id'
    }
  },
  applicationState : {
    type : Sequelize.ENUM('ACCEPTED', 'PENDING', 'REJECTED')
  }
});

app.get('/login', function (req, res) {
	res.send('Hello');
});

app.post('/register', function(req, res) {

});

app.listen(3000);
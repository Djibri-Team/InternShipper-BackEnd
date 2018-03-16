var express = require('express');
var app = express();
const Sequelize = require('sequelize');
const sequelize = new Sequelize('c51debeliyaiko', 'c51debeliyaiko', 'Zy9pAhzFXnEj', {
  host: 'web01.hostbalkan.com',
  dialect: 'mysql',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});


app.get('/', function (req, res) {
	res.send('Hello');
})

app.listen(3000);
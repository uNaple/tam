"use strict"
var myTask = require('./object').myTask;

var config 	= require('../config/config.js'),
		express = require('express'),
		app 		= express(),
		path		= require('path'),
		bodyParser 	= require('body-parser'),
		db = require('../modules/db');
var http = require('http');
var url = require('url');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
app.set('view engine', 'jade');
app.set('views', '../views');
app.use(express.static(path.join(__dirname,'../public')));
app.use(logErrors);

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}


app.listen(config.api.http, function() {
	console.log('APP listening on port ' + config.api.http.port);
 });

app.get('/', function (req, res) {
  res.render('index', {
  						title: 		'tm',
  });
  // res.send('Hello World!');
});

app.get('/showAll', function (req, res) {
	// console.log('req task with id=',req.query.id);
	// console.log(req);
	db.getTasks(function(err, result) {
		if(err) {
			res.send(err);
		} else {
			res.send(JSON.stringify(result));
		}
	})
})

app.post('/addTask', function (req, res) {
	// console.log('req task with id=',req.query.id);
	// console.log(req);
	// console.log(req.body);//проверяю, добавляю в бд, и шлю ответ с результатом
	// res.send(JSON.stringify(req.body));
	// console.log(req.body);
	var task = new myTask(req.body);
	// console.log(task);

	task.add(function(err, result) {
		if(err) {
			res.send(err);
		} else {
			res.send(result);
		}
	});
		// db.addTask(function(err, result) {
	// 	if(err) {
	// 		res.send(err);
	// 	} else {
	// 		res.send(JSON.stringify(result));
	// 	}
	// })
})

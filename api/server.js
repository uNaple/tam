"use strict"
var myTask = require('./object').myTask;

var config 	= require('../config/config.js'),
		express = require('express'),
		app 		= express(),
		path		= require('path'),
		bodyParser 	= require('body-parser'),
		db = require('../modules/db'),
		redis = require('redis');

require('console-stamp')(console, {
      pattern: 'yyyy-mm-dd HH:MM:ss.l',
      metadata: function () {
          return ('['+ process.pid + ']');
      },
      colors: {
          stamp: "yellow",
          label: ["red", "bold"],
          metadata: "cyan"
      }
});
var http = require('http');
var url = require('url');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
app.set('view engine', 'jade');
app.set('views', '../views');
app.use(express.static(path.join(__dirname,'../public')));
// app.use(logErrors);

// function logErrors(err, req, res, next) {
//   console.error(err.stack);
//   next(err);
// }

app.listen(config.api.http, function() {
	console.info('APP listening on port ' + config.api.http.port);
 });

app.get('/', function (req, res) {
  res.render('index', {
  						title: 		'tm',
  });
  console.info('Request to /');
});

app.get('/showAll', function (req, res) {
	// console.log('req task with id=',req.query.id);
	// console.log(req);
	console.info('Request to /showAll');
	db.getTasks(function(err, result) {
		if(err) {
			console.error('getTasks: ', err);
			res.send(err);
		} else {
			res.send(JSON.stringify(result));
		}
	})
})

app.get('/getExtra', function (req, res){
	console.info('Request to /getExtra');
	db.getUsers('id, name', function(err, result) {
		if(err) {
			console.info(err);
		} else {
			// console.log(JSON.stringify(result));
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
	// console.log(task);
	console.info('Request /addTask');
	var task = new myTask(req.body);
	task.add(function(err, result) {
		if(err) {
			console.error('/addTask add: ', err);
			res.send(err);
		} else {
			console.log('/addTask\n', result);
			var text = 'Задача ' + result[0].name + ' добавлена с id: ' + result[0].id;
			// console.info(result);
			res.send(JSON.stringify(text));
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

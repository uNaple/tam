"use strict"
var myTask = require('./object').myTask;

var config 	= require('../config/config.js'),
		express = require('express'),
		app 		= express(),
		Promise = require('bluebird'),
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
function getUsers() {	//проверка на права пользователя
	return new Promise(function(resolve, reject) {
		db.getUsers('id, name', function(err, result) {
			if(err) {
				console.info(err);
				reject(err);
			} else {
				var res = new Object({Users: {}});
				for(var i = 0; i < result.length; i++) {
					res.Users[result[i].id] = result[i].name;
				}
				resolve(res);
			}
		});
	}).then(function(result) {
		return result;
		console.log(result);
	}, function(err) {
		return false;
	})
}

function getStatus() {
	return new Promise(function(resolve, reject) {
		db.getStatus(function(err, result) {
			if(err) {
				reject(err);
				console.info(err);
			} else {
				var res = new Object({Status: {}});
				for(var i = 0; i < result.length; i++) {
					res.Status[result[i].id] = result[i].sign;
				}
				resolve(res);
			}
		})
	}).then(function(result) {
		return result;
	}, function(err) {
		return false;
	})
}

function getTasks() {
	return new Promise(function(resolve, reject) {
		db.getTasks(function(err, result) {
			if(err) {
				console.info(err);
				reject(err);
			} else { //поменять
				var res = new Object();
				res.Tasks = result;
				resolve(res);
			}
		});
	}).then(function(result) {
		return result;
	}, function(err) {
		return false;
	})
}

function getTypes() {
	return new Promise(function(resolve, reject) {
		db.getTypes(function(err, result) {
			if(err) {
				reject(err);
				console.info(err);
			} else {
				var res = new Object({Types: {}});
				for(var i = 0; i < result.length; i++) {
					res.Types[result[i].id] = result[i].sign;
				}
				resolve(res);
			}
		})
	}).then(function(result) {
		return result;
	}, function(err) {
		return false;
	})
}

app.listen(config.api.http, function() {
	console.info('APP listening on port ' + config.api.http.port);
 });

app.get('/', function (req, res) {
  res.render('index', {
  						title: 		'tm',
  });
  console.info('Request to /');
});

app.get('/123', function (req, res) {
  res.render('temp1', {
  						title: 		'tm',
  });
  console.info('Request to /123');
});

app.get('/getTasks', function (req, res) {
	var params = [], where = '';
	// console.log('str:',req.query.str);
	for (var key in req.query) {
		if (where.length > 0) where += ' AND ';
		params.push(req.query[key]);
		where += key + '= $' + params.length;
	}
	console.warn('WHERE STRING: "'+where+'" with VALUES ', params);
	console.info('Request to /getTasks');
	db.getTasks(where, params, function(err, result) {
		if(err) {
			console.error('getTasks: ', err);
			res.send(err);
		} else {
			var tasks = new Object();
			for(var i = 0; i < result.length; i++) {
				tasks[result[i].id] = result[i];
			}
			res.send(JSON.stringify(tasks));
		}
	})
})

app.get('/getExtra', function (req, res) {
	console.info('Request to /getExtra');
	var resList = new Object();
	Promise.all([getUsers(), getTypes(), getStatus()]).then(function(resultArray) {
		for(var i in resultArray) {
			if(resultArray[i] == false) {
				break;
				console.err('err');
			} else {
				// console.info(resultArray[i]);
				// resList[resultArray[i]];
			}
		}
		// console.log(resultArray);
		res.send(JSON.stringify(resultArray));
	})
})

app.post('/addTask', function (req, res) {
	console.info('Request /addTask');
	var task = new myTask(req.body);
	console.debug(task);
	// task.add(function(err, result) {
	// 	if(err) {
	// 		console.error('/addTask add: ', err);
	// 		res.send(err);
	// 	} else {
	// 		console.log('/addTask\n', result);
	// 		var text = 'Задача ' + result[0].name + ' добавлена с id: ' + result[0].id;
	// 		// console.info(result);
	// 		res.send(JSON.stringify(text));
	// 	}
	// });

})

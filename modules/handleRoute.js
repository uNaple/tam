var Promise = require('bluebird'),
		path		= require('path'),
		bodyParser = require('body-parser'),
		redis = require('redis'),
		http = require('http'),
		url = require('url');

var myTask = require('../api/objectTask').myTask,
		db = require('./db');

function reqHome(req, res) {
	res.render('index', {
  						title: 		'tm',
  });
  console.info('Request to /');
}

function reqTemp1(req, res) {
  res.render('temp1', {
  						title: 		'tm',
  });
  console.info('Request to /123');
}

function reqGetTasks(req, res) {
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
}

function reqGetExtra(req, res) {
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
}

function reqAddTask(req, res) {
	console.info('Request /addTask');
	var task = new myTask(req.body);
	console.info(task);
	task.add(function(err, result) {
		if(err) {
			console.error('/addTask add: ', err);
			var answer = {err: err}
			res.send(JSON.stringify(answer));
		} else {
			console.log('/addTask\n', result);
			var text = 'Задача ' + result[0].name + ' добавлена с id: ' + result[0].id;
			var answer = {text: text, task: result[0]};
			res.send(JSON.stringify(answer));
		}
	});
}

function reqUpdateTask(req, res) {
	console.info('Request /updateTask');
	console.log('reqUpdateTask');
	var task = new myTask(req.body);
	console.info(task);
	task.update(function(err) {
		if(err) {
			console.error('/updateTask add: ', err.message);
			var answer = {err: err.message};
			res.send(JSON.stringify(answer));
		} else {
			console.log('/updateTask');
			var text = 'Задача с id ' + task.id + ' обновлена';
			var answer = {text: text};
			res.send(JSON.stringify(answer));
		}
	});
}

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

module.exports = {
	reqHome: reqHome,
	reqTemp1: reqTemp1,
	reqGetTasks: reqGetTasks,
	reqGetExtra: reqGetExtra,
	reqAddTask: reqAddTask,
	reqUpdateTask: reqUpdateTask
}

var fs = require('fs'),
		config = require('../config/config').postgres,
		pg = require('pg');

function connectDB(cb) { 							//коннект к ДБ
	var conString = config;
	var client = new pg.Client(conString);
	client.connect(function(err) {
		if(err) {
			console.error('could not connect to postgres', err);
			// throw new Error('could not connect to postgres');
 		}
		cb(client);
	});
}

function addPermission(val){
	connectDB(function(client){
		var query = `INSERT INTO global_permissions(sign)
									VALUES ('${val}')`;
		client.query(query, function(err, result) {
			if(err) {
				console.log(err);
			} else {
				console.log(result);
			}
		})
		//client.end();
	})
}

function addScope(val) {
	connectDB(function(client) {
		var query = `INSERT INTO scope(sign)
									VALUES ('${val}');`;
		client.query(query, function (err, result) {
			if(err) {
				console.log(err);
			} else {
				console.log(result);
			}
		})
	})
}

function addStatus(val) {
	connectDB(function(client) {
		var query = `INSERT INTO status(sign)
									VALUES ('${val}');`;
		client.query(query, function (err, result) {
			if(err) {
				console.log(err);
			} else {
				console.log(result);
			}
		})
	})
}

function addTypeAction(val) {
	connectDB(function(client) {
		var query = `INSERT INTO type_action(sign, description)
									VALUES ('${val}', 'action');`;
		client.query(query, function (err, result) {
			if(err) {
				console.log(err);
			} else {
				console.log(result);
			}
		})
	})
}

function addUser(user) {														//добавить пользователя
	connectDB(function(client){
		var query = `INSERT INTO users(name, password, email, global_permission, group_permission)
					 VALUES ('${user.name}', '${user.password}', '${user.email}', '${user.global_permission}', '${user.group_permission}' ) RETURNING id`;
		client.query(query, function(err, result) {
	    if (err) {
	    	console.log(err);
	    } else {
	    	var text = 'Пользователь с id: ' + result.rows[0].id + ' добавлен';
	    }
		})
	})
}

function addTask(task, cb) {
		connectDB( function (client) {					//подключаемся и создаем запрос
		var queryHead = `INSERT INTO tasks(name, type, director, controller, time_add, status`,
				queryTail = `VALUES('${task.name}',
														'${task.type}',
														'${task.director}',
														'${task.controller}',
														'${getNowDate()}',
														'${task.status}'`;
		if(task.executor !== null) {
			queryHead += ', executor';
			queryTail += `, '${name.executor}'`;
		}
		if(task.description !== null) {
			queryHead += ', description';
			queryTail += `, '${name.description}'`;
		}
		if(task.parentid !== null) {
			queryHead += ', parentid';
			queryTail += `, '${name.parentName}'`;
		}

		// if(task.priority !== null) {
		// 	queryHead += ', priority';
		// 	queryTail += `, '${name.parentName}'`;
		// }
		// if(task.dependence !== null) {
		// 	queryHead += ', dependence';
		// 	queryTail += `, '${name.parentName}'`;
		// }

		queryHead += ')';
		queryTail += ')';
		var queryFinal = queryHead + queryTail + ' RETURNING id;';
		client.query(queryFinal, function(err, result) {						//отправляем запрос
		    if(err) {
		    	cb(err)
		    }
		    else {
		    	cb(result.rows);
		    	console.log('Задача с id: ' + result.rows[0].id);
    			var text = 'Задача с id: ' + result.rows[0].id + ' добавлена';
		    }
		});
	});
}

function updateTask (task, cb){                      							//обновить задание
	connectDB(function(client) {
		var query = `UPDATE tasks	SET `;
		if(task.name !== null) {
			query += `name = '${task.name}'`;
		}
		// for(var i in task) {
		// 	if(typeof(task[i]) == 'string') {
		// 		query += ` ${i} = '${task[i]}'`;
		// 		console.log(i + ': ' + task[i]);
		// 		console.log(typeof(task[i]));
		// 	}
		// }
		if(task.type !== null) {
			query += `, type = '${task.type}'`;
		}
		if(task.director !== null) {
			query += `, director = '${task.director}'`;
		}
		if(task.controller !== null) {
			query += `, controller = '${task.controller}'`;
		}
		if(task.executor !== null) {
			query += `, executor = '${task.executor}'`;
		}
		if(task.duration !== null) {
			query += `, duration = '${task.duration}'`;
		}
		if(task.status !== null) {
			query += `, status = '${task.status}'`;
		}
		if(task.priority !== null) {
			query += `, priority = '${task.priority}'`;
		}
		if(task.dependence !== null) {
			query += `, dependence = '${task.dependence}'`;
		}
		if(task.parentid !== null) {
			query += `, parentid = '${task.parentid}'`;
		}
		if(task.description !== null) {
			query += `, description = '${task.description}'`;
		}
		if(task.scope !== null) {
			query += `, scope = '${task.scope}'`;
		}
		query += ` WHERE id = ${task.id};`;
		console.log(query);
		client.query(query, function(err, result) {
			    if (err) {
			    	cb(err);
			    } else {
			    	cb(null)
			    }
			});
		// var text = 'Задача с id: ' + `${obj.id}` + ' изменена';
		// addHistory(client, text, typeOfAction[3]); 	//добавляем в историю
		//client.end();
	})
}

function getUser(id, cb){
	connectDB(function(client){
		var query = `SELECT * FROM users WHERE id = ${id}`;
		client.query(query, function(err, result) {
			if(err) {
				console.log(err);
				cb(err);
			} else if (result.rows.length == 0) {
				cb(new Error('Нет такого пользователя'));
			} else {
				cb(null, result.rows);
			}
		})
	})
}

function getTask(id, cb){
	connectDB(function(client){
		var query = `SELECT * FROM tasks WHERE id = ${id}`;
		client.query(query, function(err, result) {
			if (err) {
				console.log(err);
				cb(err);
			} else if (result.rows.length == 0) {
				cb(new Error('Нет задачи с таким id'));
			} else {
				cb(null, result.rows);
			}
		})
	})
}

function getNowDate(){
	var objToday = new Date(),
       	curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
       	curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
       	curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds();
	var today = objToday.getFullYear() + '-' + (objToday.getMonth()+1) + '-' +  objToday.getDate() + ' ' +  curHour + ":" + curMinute + ":" + curSeconds;
	return today;                       //текущая дата в формате timestamp without time zone
}


module.exports = {
	connectDB: 			connectDB,
	addPermission: 	addPermission,
	addScope: 			addScope,
	addStatus: 			addStatus,
	addTypeAction: 	addTypeAction,
	addUser: 				addUser,
	addTask: 				addTask,
	updateTask: 		updateTask,
	getTask: 				getTask,
	getUser: 				getUser,
	getNowDate: 		getNowDate
}

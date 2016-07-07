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

function getUsers() {
	connectDB(function(client){
		var queryFinal = 'SELECT * FROM users;'
		client.query(queryFinal, function(err, result) {						//отправляем запрос
		    if (err) {
		    	console.log(err);
		    } else {
		    	console.log(result.rows);
		    }
	    })
	})
}
//==========================Перетянул у Сани БД к себе
// var arr = new Array();
// function get(arr){
// 	connectDB1(function(client){
// 		var query = `SELECT * FROM users;`;
// 		client.query(query, function(err, result){
// 			if(err) {
// 				console.log(err)
// 			} else {
// 				for(var i = 0; i < result.rows.length; i++) {
// 					arr.push(result.rows[i]);
// 				}
// 			}
// 			writeIn(arr);
// 			client.end();
// 		})
// 	})
// }

// function writeIn(arr){
// 	connectDB(function(client){
// 		for(var i = 0; i < arr.length; i++) {
// 			var query = `INSERT INTO users(name, password, email, global_permission, group_permission)
// 							VALUES ('${arr[i].first_name}', '${arr[i].last_name}', '${arr[i].key}', '1', '2') RETURNING id;`;
// 			client.query(query, function(err, result) {
// 				if(err) {
// 					console.log(err);
// 				} else {
// 					console.log(result.rows[0]);
// 				}
// 			})
// 		}
// 	})
// }

// function connectDB1(cb) { 							//коннект к ДБ
// 	var pg = require('pg');
// 	var conString = "postgres://chat:rXjRHIpp6XrXWcDtWN3KZbBnyppVcu@78.140.171.239:5432/chat";
// 	var client = new pg.Client(conString);
// 	client.connect(function(err) {
// 		if(err) {
// 			console.error('could not connect to postgres', err);
// 			// throw new Error('could not connect to postgres');
//  		}
// 		cb(client);
// 	});
// }
// get(arr);

module.exports = {
	connectDB: 			connectDB,
	addPermission: 	addPermission,
	addScope: 			addScope,
	addUser: 				addUser,
	getUsers: 			getUsers,
	connectDB1: 		connectDB1,
}

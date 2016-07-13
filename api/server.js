"use strict"

var config 	= require('../config/config.js'),
		express = require('express'),
		app 		= express(),
		path		= require('path'),
		bodyParser 	= require('body-parser'),
		db = require('../modules/db');
var http = require('http');
var url = require('url');

app.listen(config.api.http, function() {
	console.log('APP listening on port ' + config.api.http.port);
 });

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/test', function (req, res) {
	// console.log('req task with id=',req.query.id);
	// db.getTask(req.query.id, function(err, result) {
	// 	if(err) {
	// 		res.send(err);
	// 	} else {
	// 		res.send(result);
	// 	}
	// })

});

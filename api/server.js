"use strict"

var config 	= require('../config/config.js'),
		express = require('express'),
		app 		= express(),
		path		= require('path'),
		bodyParser 	= require('body-parser');

app.listen(config.api.http, function() {
	console.log('APP listening on port ' + config.api.http.port);
 });

app.get('/', function (req, res) {
  res.send('Hello World!');
});

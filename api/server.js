"use strict"
var config 	= require('../config/config.js'),
		express = require('express'),
		app 		= express(),
		Promise = require('bluebird'),
		path		= require('path'),
		bodyParser 	= require('body-parser'),
		redis = require('redis'),
		http = require('http'),
		url = require('url');

var router = require('../modules/router')(app,express);

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
app.set('view engine', 'jade');
app.set('views', '../views');
app.use(express.static(path.join(__dirname,'../public')));

app.listen(config.api.http, function() {
	console.info('APP listening on port ' + config.api.http.port);
 });

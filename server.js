"use strict"

var express 	= require('express'),
	app 		= express(),
	path		= require('path'),
	bodyParser 	= require('body-parser');

app.listen(8000, function () { 
   console.log('APP listening on port 8000');
 });

function myTask() {
	this.id				= null;
	this.name 			= null;
	this.type 			= null;
	this.director		= null;
	this.controller		= null;
	this.executor		= null;
	this.time_add		= null;
	this.time_start		= null;
	this.time_end		= null;
	this.duration		= null;
	this.status			= null;
	this.priority		= null;
	this.dependence		= null;
	this.parentid		= null;
	this.reminder		= null;
	this.scope			= null;
	this.description	= null;
}

function print(){
	var task = new myTask();
	task.name = 'tmp';
	console.log(task);
}

// var $ = require('jquery-3.0.0');
var xhr = new XMLHttpRequest();

$(document).ready(function() {

//======== Добавление задачи
	$('#buttonAddTask').on('click', function(event) {
	 	//console.debug(e);
	 	// alert(event);
	 	$('#panelTaskEdit').show();
	 	// Custombox.open({
   //        target: '#formAddTask',
   //        effect: 'slip'
   //    });
    event.preventDefault();
  	// $('#tableAdd').show();
  	// $('#tableAdd').hide();
  });

  $('#tableButtonCancel').click(function(event) {
  	console.debug(event);
  	Custombox.close();
  });

  $('#tableButtonAdd').click(function(event) {
  	console.debug(event);
  	var data = $('#tableAdd tr td input');
  	var task = new Object();
  	for(var i = 0; i < (data.length-2); i++) {
  		task[$(data[i]).attr('name')] = $.trim($(data[i]).val());
	 		console.debug(task);
  	}
  	event.preventDefault();
  	$.ajax({
  		url: 'addTask',
  		method: 'POST',
  		data: task,
  		success: function(result) {
	  			result = JSON.parse(result);
	  			alert(result)
					console.debug(result);
  			}
  			// $('#par1').append(result);
  	});
  	// $('#par1').load('addTask', data));
  	Custombox.close();
  });

//======== Отображение задач
	var allTasks = new Array(),//здесь хранятся задачи, потом редиска будет
			myTasks = new Array();

	// $('#buttonHide').click(function() {
	// 		$('#listTask').hide();
	// 		$('#buttonShow').show();
	// 		$('#buttonHide').hide();
	// 		arrTasks.splice(0,arrTasks.length);//временно, потом протухать будет по времени или по добавлению нвоой задачи
	// 		$('#listTask').empty();//и очищаю элементы листа
	// 		console.debug('arrTasks:', arrTasks);
	// 		console.debug('arrTasks.length:', arrTasks.length);
 //  	});

	$('#buttonMyTasks').click(function() {
			var params = 'director=' + encodeURIComponent(679); //тут id из сессии
			if(!checkTasksExist(myTasks)) {
				xhr.open('GET', '/getTasks?str=' + params, true);
				xhr.send();
				xhr.onreadystatechange = function() {
				  if(xhr.readyState != 4)	return;
				  if(xhr.status != 200) {
				    alert(xhr.status + ': ' + xhr.statusText);
				  } else {
				  	myTasks = JSON.parse(xhr.responseText);
				  	console.debug('myTasks: ', myTasks);
				  	$('#fieldTasks tbody').empty();
				  	showAll(myTasks);
					}
				}
			} else {
				$('#fieldTasks tbody').empty();
				showAll(myTasks);
			}
	});


	$('#buttonAllTasks').click(function() {
		var params = 'status !=7'; //тут id из сессии
		if(!checkTasksExist(allTasks)) {
			xhr.open('GET', '/getTasks?str=' + params, true);
			xhr.send();
			xhr.onreadystatechange = function() {
			  if(xhr.readyState != 4)	return;
			  if(xhr.status != 200) {
			    alert(xhr.status + ': ' + xhr.statusText);
			  } else {
			  	allTasks = JSON.parse(xhr.responseText);
			  	console.debug('allTasks: ', allTasks);
			  	showAll(allTasks);
			  	// console.debug(JSON.parse(xhr.responseText));
				}
			}
		} else {
			showAll(allTasks);
		}
	});


//======== Вспомогательные функции

//Подгрузка списков

	// $('#taskName').one('focus', function(event) {
	// 	getExtra();
	// })
	// $('#buttonAdd').one('click', getExtra());
	function getExtra() {
		$.get('getExtra', function (result) {
			console.debug(result);
		 	var arr = JSON.parse(result);
		 	for(var i in arr) {
		 		if(arr[i].hasOwnProperty('Users')) {
		 			for(var j in arr[i].Users) {
		 				$('#taskUsers').append('<option value='+ arr[i].Users[j].id + '>' + arr[i].Users[j].name + '</option>');
		 			}
		 		}
		 		if(arr[i].hasOwnProperty('Types')) {
		 			for(var j in arr[i].Types) {
		 				$('#taskTypes').append('<option value='+ arr[i].Types[j].id + '>' + arr[i].Types[j].sign + '</option>');
		 				// console.debug(arr[i].Types[j]);
		 			}
		 		}
		 		if(arr[i].hasOwnProperty('Status')) {
		 			for(var j in arr[i].Status) {
		 				$('#taskStatus').append('<option value='+ arr[i].Status[j].id + '>' + arr[i].Status[j].sign + '</option>');
		 				// console.debug(arr[i].Types[j]);
		 			}
		 		}
		 	}
	  })
	}

//Проверка массива всех задач
	function checkTasksExist(arr) {//тут проверять вероятно будем из редиски
		if(arr.length !== 0) {
			return true;
		} else {
			console.debug('arr.length:', arr.length);
			return false;
		}
	}
//Отображение листа с задачами. Перевести его в таблицу!
	function showAll(arr) {
		$('#fieldTasks tbody').empty();
		// console.debug('show all',arr);
		for(var i = 0; i <  arr.length; i++) {
			// var task = '';
			// for(var key in arr[i]) {
			// 	if(arr[i][key] !== null) {
			// 		task += arr[i][key] + ' ';
			// 	}
			// }
			// console.debug('current task:', task);
			$('#fieldTasks tbody').append('<tr><td>' + arr[i].name);
		}
		// $('#listTask').show();
	}

});

	// $('#input1').click(function() {
	// 	$("#par1").animate({fontSize:"1.3em"},1000);
	// 	$("#par1").animate({marginLeft:"30px"},1000);
	// 	$("#par1").animate({marginTop:"50px"},1000);
	// 	$("#par1").animate({fontSize:"1em"},1000);
	// 	$("#par1").animate({marginLeft:"0px"},1000);
	// 	$("#par1").animate({marginTop:"0px"},1000);
	// })

	// $('#input1').click(function() {
	// 	// $('#par1').append('XYi');
	// 	//alert($('#input2').attr('value'));
	// 	// $('#par1').wrap('<div></div>');
	// 	// $('#par1').addClass('testclass');
	// 	// $('.testclass').css('color', 'green');
	// 	$("#par1").ajaxSend(function(){
	// 		alert('dsdd');
	// 		// $('#input1').css('display', 'none');
	// 		// $('#input1').css('display', 'none');
	// 		// $('#input1').css('display', 'none');
	// 	})
	// 	$("#par1").ajaxComplete(function(){
	// 		// $('#input1').css('display', 'inline');
	// 		// alert($(par).html());
	// 		alert();
	// 	})
	// 	$("#par1").ajaxError(function(){
 //      alert("Выполнение AJAX запроса завершено с ошибкой.\nПроверьте Ваш запрос на наличие ошибок и попробуйте отправить его еще раз.");
 //  	 });
	// 	$("#par1").ajaxSuccess(function(){
 //      alert("AJAX запрос успешно выполнен!");
 //   });
	// 	var data = {id:4};
	// 	$.get('test', data, function(result){
	// 		console.debug(xhr);
	// 		$('#par1').html(result);
	// 	})
	// 	// $('#par1').load('test', data);
	// 	// $.ajax({url:'test',
	// 	// 								data: {
	// 	// 									id: 4
	// 	// 								},
	// 	// 								success: function(result) {
	// 	// 										$('#par1').html(result);
	// 	// 									}
	// 	// 								});
	// })


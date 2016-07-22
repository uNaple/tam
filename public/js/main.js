// var $ = require('jquery-3.0.0');
var xhr = new XMLHttpRequest();

$(document).ready(function() {

//======== Добавление задачи
	$('#buttonAddTask1').on('click', function(event) {
	 	$('#listTasks').prepend('<li class="flexrow" style=""><span class="handle ui-sortable-handle"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span><input value="" type="checkbox"><span class="text taskedit" contenteditable="true" >New task' );
  });
  $('#buttonAddTask2').on('click', function(event) {
	 	$('#listTasks').append('<li class="flexrow" style=""><span class="handle ui-sortable-handle"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span><input value="" type="checkbox"><span class="text taskedit" contenteditable="true" >New task' );
  });

  $('.todo-list').click(function() {
  	getExtra();
  	$('#panelTaskEdit').show();
  })

  $('#tableButtonCancel').click(function(event) {
  	console.debug(event);
  	Custombox.close();
  });

  $('#buttonTaskAdd').click(function(event) {
  	console.debug($('#panelTaskEdit').html());

  	// var data = $('#tableAdd tr td input');
  	// var task = new Object();
  	// for(var i = 0; i < (data.length-2); i++) {
  	// 	task[$(data[i]).attr('name')] = $.trim($(data[i]).val());
	 	// 	console.debug(task);
  	// }
  	// event.preventDefault();
  	// $.ajax({
  	// 	url: 'addTask',
  	// 	method: 'POST',
  	// 	data: task,
  	// 	success: function(result) {
	  // 			result = JSON.parse(result);
	  // 			alert(result)
			// 		console.debug(result);
  	// 		}
  	// });
  	// Custombox.close();
  });

//======== Отображение задач
	var allTasks = new Array(),//здесь хранятся задачи, потом редиска будет
			myTasks = new Array();

	$('#buttonMyTasks').click(function() {
			// alert('ds');
			var params = 'director=' + encodeURIComponent(679); //тут id из сессии
			if(!checkTasksExist(myTasks)) {
				xhr.open('GET', '/getTasks?' + params, true);
				xhr.send();
				xhr.onreadystatechange = function() {
				  if(xhr.readyState != 4)	return;
				  if(xhr.status != 200) {
				    alert(xhr.status + ': ' + xhr.statusText);
				  } else {
				  	myTasks = JSON.parse(xhr.responseText);
				  	console.debug('myTasks: ', myTasks);
				  	showAll(myTasks);
					}
				}
			} else {
				showAll(myTasks);
			}
	});


	$('#buttonAllTasks').click(function() {
		var params = 'status != 7'; //тут id из сессии
		if(!checkTasksExist(allTasks)) {
			xhr.open('GET', '/getTasks?' + params, true);
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

	function getExtra() {
		$.get('getExtra', function (result) {
		 	var arr = JSON.parse(result);
			// var data = [{ id: 0, text: 'enhancement' }, { id: 1, text: 'bug' }];
		 	// console.debug(arr[0].Users);
		 	$("#listUsers").select2();
		 	$("#listTypes").select2();
		 	$("#listStatus").select2();
		 	for(var i in arr) {
		 		if(arr[i].hasOwnProperty('Users')) {
		 			for(var j in arr[i].Users) {
		 				$('#listUsers').append('<option value='+ arr[i].Users[j].id +'>'+ arr[i].Users[j].name +'</option>');
		 			}
		 		}
				if(arr[i].hasOwnProperty('Types')) {
					for(var j in arr[i].Types) {
						$('#listTypes').append('<option value='+ arr[i].Types[j].id + '>' + arr[i].Types[j].sign + '</option>');
						// console.debug(arr[i].Types[j]);
					}
				}
				if(arr[i].hasOwnProperty('Status')) {
					for(var j in arr[i].Status) {
						$('#listStatus').append('<option value='+ arr[i].Status[j].id + '>' + arr[i].Status[j].sign + '</option>');
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
		$('#listTasks').empty();
		for(var i = 0; i <  arr.length; i++) {
			$('#listTasks').append('<li class="flexrow" style=""><span class="handle ui-sortable-handle"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span><input value="" type="checkbox"><span class="text taskedit" contenteditable="true" >' + arr[i].name);
		}
	}
});


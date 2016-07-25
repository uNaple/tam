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
		console.debug('on task click');
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
			myTasks = new Array(),
			listStatus = new Array(),
			listTypes = new Array(),
			listUsers = new Array();

	$('#buttonMyTasks').click(function() {
			console.debug('myTasks func');
			var params = 'director=' + encodeURIComponent(679); //тут id из сессии
			if(!checkExist(myTasks)) {
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
		console.debug('allTasks func');
		var params = 'status != 7'; //тут id из сессии
		if(!checkExist(allTasks)) {
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

//Отображение листа с задачами. Перевести его в таблицу!
	function showAll(arr) {
		$('#listTasks').empty();
		for(var i = 0; i <  arr.length; i++) {
			$('#listTasks').append('<li class="flexrow" style=""><span class="handle ui-sortable-handle"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span><input value="" type="checkbox"><span class="text taskedit" contenteditable="true" >' + arr[i].name);
		}
	}
//Отображение доп инфы
	function showExtra() {
		$("#listUsers").select2({
			data: listUsers
		});
		$("#listTypes").select2({
			data: listTypes
		});
		$("#listStatus").select2({
			data: listStatus
		});
	}

//Подгрузка списков
	function getExtra() {
		if(checkExist(listUsers)) { //тут еще проверки на полноту типов и статусов, вообще статусы и типа и прочую статику надо вшить, либо один раз грузить, но отдельно от динамической инфы
			showExtra();
		} else {
			$.get('getExtra', function (result) {
				var arr = JSON.parse(result);
				for(var i in arr) {
					if(arr[i].hasOwnProperty('Users')) {
						for(var j in arr[i].Users) {
							listUsers.push(new Object({id: arr[i].Users[j].id, text: arr[i].Users[j].name}));
						}
					}
					if(arr[i].hasOwnProperty('Types')) {
						for(var j in arr[i].Types) {
							listTypes.push(new Object({id: arr[i].Types[j].id, text: arr[i].Types[j].sign}));
						}
					}
					if(arr[i].hasOwnProperty('Status')) {
						for(var j in arr[i].Status) {
							listStatus.push(new Object({id: arr[i].Status[j].id, text: arr[i].Status[j].sign}));
						}
					}
				}
				showExtra();
			})
		}
	}

//Проверка массива всех задач
	function checkExist(arr) {//тут проверять вероятно будем из редиски
		console.debug(arr);
		if(arr.length !== 0) {
			return true;
		} else {
			console.debug('arr.length:', arr.length);
			return false;
		}
	}
});


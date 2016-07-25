// var $ = require('jquery-3.0.0');
var xhr = new XMLHttpRequest();

$(document).ready(function() {

	var allTasks = new Array(),//здесь хранятся задачи, потом редиска будет
		myTasks = new Array(),
		listStatus = new Array(),
		listTypes = new Array(),
		listUsers = new Array();
		getExtra();

//======== Добавление задачи
	$('#buttonAddTask1').on('click', function(event) {
		$('#listTasks').prepend('<li class="flexrow" style=""><span class="handle ui-sortable-handle"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span><input value="" type="checkbox"><span class="text taskedit" contenteditable="true" >New task' );
		var task = {name: 'New Task'};
		showInfo(task);
	});

	$('#buttonAddTask2').on('click', function(event) {
		$('#listTasks').append('<li class="flexrow" style=""><span class="handle ui-sortable-handle"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span><input value="" type="checkbox"><span class="text taskedit" contenteditable="true" >New task' );
	});

	$('#buttonTaskAdd').click(function(event) {
		var data = $('#panelTaskEdit select');
		console.debug($('select#listUsers').val(), $('select#listUsers').attr('name'));
		console.debug($('select#listTypes').val());
		console.debug($('select#listStatus').val());
		var task = new Object();
		for(var i = 0; i < data.length; i++) {
			task[data[i].name] = $('select#'+data[i].id).val();
		}
		console.debug(task);
		// event.preventDefault();
		// $.ajax({
		// 	url: 'addTask',
		// 	method: 'POST',
		// 	data: task,
		// 	success: function(result) {
		// 			result = JSON.parse(result);
		// 			alert(result)
		// 			console.debug(result);
		// 		}
		// });
	});

//======== Отображение задач

//вот эту ебалу свернуть в одну функцию, внутри которой и делать выборку по тому, что необходимо отобразить
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

	function showInfo(task) {
		// console.debug(arr[id]);
		for(var key in task) {
			if(key !== 'null') {
				if(key === 'name') {
					$('#panelTaskEdit #name').val(task.name);
				}
				if(key === 'director') {
					// console.debug($('#panelTaskEdit [name="director"]').val(myTasks[id].director));
					// console.debug($('#panelTaskEdit [name="director"]').val());
					// $('#listUsers [id='+myTasks[id].director+']').attr('selected', 'selected');
					$('#listUsers [id='+task.director+']').val();
				}
			}
		}
		$('#panelTaskEdit').show();
	};

//Отображение листа с задачами.
	function showAll(arr) {
		$('#listTasks').empty();
		for(var key in arr) {
			var elem = $('<li class="flexrow" style="" data-id="' + arr[key].id +'"><span class="handle ui-sortable-handle"><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span><input value="" type="checkbox"><span class="text taskedit" contenteditable="true" >' + arr[key].name + '</span></li>');
			$('#listTasks').append(elem);

			elem.click(function() {
				console.debug('click on task with id:', $(this).attr('data-id') );
				showInfo(arr[$(this).attr('data-id')]);
			})
		}
	};

	// $('.todo-list').click(function() {
	// 	console.debug('on task click');//надо вытащить ид у задачи по которой был клик
	// 	// console.debug(event.currentTarget.children[]);
	// 	// console.debug($(this).children().text());
	// 	// getExtra();//вынести отдельно, чтоб грузилось при входе на страницу в невидимом режиме и хранить это
	// 	// $('#')
	// 	// showInfo('5');
	// 	// $('#panelTaskEdit').show();
	// })

//Отображение инфы
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
	};

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
	};

//Проверка массива всех задач
	function checkExist(arr) {//тут проверять вероятно будем из редиски
		// console.debug(arr);
		if(arr.length !== 0) {
			return true;
		} else {
			console.debug('arr.length:', arr.length);
			return false;
		}
	};

})

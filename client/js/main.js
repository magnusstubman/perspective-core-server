require.config({
	paths: {
		"text": "../lib/text",

		"jquery": "external/jquery-1.9.1.min",
		"handlebars": "external/handlebars"
	},

	shim: {
		"jquery": {
			exports: "jQuery"
		},
		"handlebars": {
			exports: "Handlebars"
		}
	}
});

require(["jquery", "modules/tasks/tasks"], function($, tasks) {
	$(function() {
		$("#add").click(function() {
			var task = prompt("Enter task name");
			tasks.save({
				title: task,
				size: "M"
			}).done(renderTasks);
		});

		renderTasks();
	});

	function renderTasks() {
		tasks.show($("#task-list"));
	}
});
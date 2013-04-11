define(["jquery", "handlebars", "text!./tasks.html"], function($, hb, template) {

	var urlRoot = "http://localhost:8888";

	function render(template, data) {
		return hb.compile(template)(data);
	}

	function get(path) {
		return $.getJSON(urlRoot + path);
	}

	function post(path, data) {
		return $.ajax({
			url: urlRoot + path,
			data: JSON.stringify(data),
			dataType: "json",
			contentType: "application/json; charset=utf-8",
			type: "POST"
		});
	}

	return {
		show: function(el) {
			get("/tasks").done(function(data) {
				el.html(render(template, data));	
			});
		},

		save: function(task) {
			return post("/tasks", task);
		}
	}
});
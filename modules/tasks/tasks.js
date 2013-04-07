var db = require("../base/db.js");

module.exports = {
	initialize: function(server) {
		server.get('/tasks', function(req, res, next) {
			res.send([]);
			return next();
		});

		server.post('/tasks', function(req, res, next) {
			db.insert("tasks", req.body, function() {
				res.send(201, req.body);
				next();	
			});
		});
	}
};
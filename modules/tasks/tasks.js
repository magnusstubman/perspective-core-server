var db = require("../base/db.js");

module.exports = {
	initialize: function(server) {
		server.get('/tasks', function(req, res, next) {
            db.get("tasks", function(result) {
                console.log(result);
                res.send(result);
                next();
            });
		});

		server.post('/tasks', function(req, res, next) {
			db.insert("tasks", req.body, function() {
				res.send(201, req.body);
				next();	
			});
		});
	}
};
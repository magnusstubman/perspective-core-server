var services = require("../services");

module.exports = {
	initialize: function() {
		services.db.registerTable("tasks");
	},

	mountAPI: function(server) {	
		server.get('/tasks', function(req, res, next) {
            services.db.get("tasks", function(result) {
                res.send(result);
                next();
            });
		});

		server.post('/tasks', function(req, res, next) {
			services.db.insert("tasks", req.body, function() {
				res.send(201, req.body);
				next();	
			});
		});
	}
};;
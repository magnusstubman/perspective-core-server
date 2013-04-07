var tasks = [
		{
			id: 78,
			name: "Make some food",
			priority: 1
		},
		{
			id: 90,
			name: "Prepare the table",
			priority: 2
		},
		{
			id: 91,
			name: "Do the dishes",
			priority: 3
		}
	];

	module.exports = {
		initialize: function(server) {
			server.get('/tasks', function(req, res, next) {
				res.send(tasks);
				return next();
			});

			server.post('/tasks', function(req, res, next) {
				tasks.push(req.body);
				res.send(201, req.body);
				return next();
			});
		}
	};
var restify = require('restify');

var server = restify.createServer({
  name: 'perspective'
});


server.get('/tasks', function(req, res, next) {
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
	res.send(tasks);
	return next();
});

server.listen(8080);
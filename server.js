var restify = require('restify'),
	tasks = require("./modules/tasks/tasks.js");

var server = restify.createServer({
  name: 'perspective'
});

tasks.initialize(server);

server.listen(8080);
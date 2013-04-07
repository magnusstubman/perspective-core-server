var restify = require('restify'),
	tasks = require("./modules/tasks/tasks.js");

var server = restify.createServer({
  name: 'perspective'
});
server.use(restify.bodyParser({mapParams:false}));

tasks.initialize(server);

server.listen(8080);
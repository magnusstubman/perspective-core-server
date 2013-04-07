var restify = require('restify'),
	tasks = require("./modules/tasks/tasks.js"),
	db = require("./modules/base/db.js");

db.setup();

var server = restify.createServer({
  name: 'perspective'
});

server.use(restify.bodyParser({mapParams:false}));

tasks.initialize(server);

server.listen(8888);
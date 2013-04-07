var restify = require('restify'),
	db = require("./modules/base/db.js"),
	config = require("./config.json"),

    tasks = require("./modules/tasks/tasks.js"),
    users = require("./modules/users/users.js"),
    status = require("./modules/status/status.js");

var startServer = function() {
    var server = restify.createServer({
        name: 'perspective'
    });

    server.use(restify.bodyParser({mapParams:false}));

    tasks.initialize(server);
    users.initialize(server);
    status.initialize(server);

    console.log("Starting server on port " + config.server.port);
    server.listen(config.server.port);
}

db.setup({
    config: {
        host: config.rethinkdb.host,
        port: config.rethinkdb.port,
        tables: ["tasks", "users", "status"]
    },
    success: startServer
});
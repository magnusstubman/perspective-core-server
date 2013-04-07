var restify = require('restify'),
	tasks = require("./modules/tasks/tasks.js"),
	db = require("./modules/base/db.js"),
	config = require("./config.json");

var startServer = function() {
    var server = restify.createServer({
        name: 'perspective'
    });

    server.use(restify.bodyParser({mapParams:false}));

    tasks.initialize(server);

    console.log("Starting server on port " + config.server.port);
    server.listen(config.server.port);
}

db.setup({
    config: {
        tables: ["tasks"]
    },
    success: startServer
});
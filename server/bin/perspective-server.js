#!/usr/bin/env node

var Server = require('../lib/server'),
	Db = require("../lib/db"),
    services = require("../lib/services"),
	config = require("../config.json"),

    server = new Server(config.server),
    database = new Db(config.db),
    modules = []; 

services.register("server", server);
services.register("db", database);

modules = config.modules.map(function(name) {
    var module = require("../lib/" + name + "/" + name + ".js");
    module.initialize();
    return module;
});

database.setup({
    onSuccess: function() {
        server.start(modules);
    }
});
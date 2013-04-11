#!/usr/bin/env node

var Server = require('../modules/base/server.js'),
	Db = require("../modules/base/db.js"),
    services = require("../modules/services.js"),
	config = require("../config.json"),

    server = new Server(config.server),
    database = new Db(config.db),
    modules = []; 

services.register("server", server);
services.register("db", database);

modules = config.modules.map(function(name) {
    var module = require("../modules/" + name + "/" + name + ".js");   
    module.initialize();
    return module;
});

database.setup({
    onSuccess: function() {
        server.start(modules);
    }
});
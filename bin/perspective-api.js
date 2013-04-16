#!/usr/bin/env node

var Server = require('../lib/server'),
	Db = require("../lib/db"),

    config = require("../config.json"),

    loadPlugins = require("../lib/plugins"),

    server = new Server(config.server),
    database = new Db(config.db);

database.setup().then(function(){
	server.start();
	var plugins = loadPlugins(config.plugins, server, database);
	plugins.forEach(function(plugin) {
        console.log('Setting up plugin with name: ' + plugin.config.name);
		plugin.api.setup();
	});
});
#!/usr/bin/env node

var Server = require('../lib/server'),
	Db = require("../lib/db"),
    services = require("../lib/services"),
	config = require("../config.json"),

    server = new Server(config.server),
    database = new Db(config.db),
    modules = [];

function loadPlugins() {
	return config.plugins.map(function(plugin) {
		var initializor = require("perspective-api-" + plugin.name);
		return initializor(
			{
				server: server.instance,
				db: database
			},
			plugin.config || {}
		);
	});
}

database.setup().then(function(){
	server.start();
	var plugins = loadPlugins();
	plugins.forEach(function(plugin) {
		plugin.setup();
	});
});
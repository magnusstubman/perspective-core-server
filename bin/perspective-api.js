#!/usr/bin/env node

var Server = require('../lib/server');
var Db = require("../lib/db");
var config = require("../config.json");
var PluginsLoader = require("../lib/pluginsLoader");
var apiLogger = require('../lib/apiLogger');
var server = new Server(config.server);
var database = new Db(config.db);


database.setup().then(function() {
  server.start();
  var pluginsLoader = new PluginsLoader(server, database);
  var plugins = pluginsLoader.load(config.plugins);
  plugins.forEach(function(plugin) {
    apiLogger.info('Setting up plugin with name: ' + plugin.config.name);
    plugin.api.setup();
  });
}).fail(function(error) {
  apiLogger.error(error);
  process.exit(1);
});
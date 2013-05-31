#!/usr/bin/env node

var Server = require('../lib/server');
var Db = require("../lib/db");
var config = require("../config.json");
var PluginsLoader = require("../lib/pluginsLoader");
var logger = require("../lib/logger");
var server = new Server(config.server, logger);
var database = new Db(config.db, logger);


database.setup().then(function() {
  server.start();
  var pluginsLoader = new PluginsLoader(server, database, logger);
  var plugins = pluginsLoader.load(config.plugins);
  plugins.forEach(function(plugin) {
    logger.info('Setting up plugin with name: ' + plugin.config.name);
    plugin.api.setup();
  });
}).fail(function(error) {
  logger.error(error);
  process.exit(1);
});
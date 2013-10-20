#!/usr/bin/env node

var server = require('../lib/server');
var webSocketServer = require('../lib/webSocketServer');
var db = require("../lib/db");
var config = require("../config.json");
var PluginsLoader = require("../lib/pluginsLoader");
var apiLogger = require('../lib/apiLogger');


db(config.db).then(function(db) {

  var httpServer = server(config.server);
  var wsServer = webSocketServer(httpServer.server, config.server);

  var pluginsLoader = new PluginsLoader(httpServer, wsServer, db);
  var plugins = pluginsLoader.load(config.plugins);
  plugins.forEach(function(plugin) {
    apiLogger.info('Setting up plugin with name: ' + plugin.config.name);
    plugin.api.setup();
  });
}).fail(function(error) {
  apiLogger.error(error);
  process.exit(1);
});
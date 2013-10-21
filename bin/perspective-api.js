#!/usr/bin/env node

var restServer = require('../lib/restServer');
var webSocketServer = require('../lib/webSocketServer');
var db = require("../lib/db");
var config = require("../config.json");
var PluginsLoader = require("../lib/pluginsLoader");
var apiLogger = require('../lib/apiLogger');


db(config.db).then(function(db) {

  var _restServer = restServer(config.server);
  var _webSocketServer = webSocketServer(_restServer.server, config.server);

  var pluginsLoader = new PluginsLoader(_restServer, _webSocketServer, db);
  var plugins = pluginsLoader.load(config.plugins);
  plugins.forEach(function(plugin) {
    apiLogger.info('Setting up plugin with name: ' + plugin.config.name);
    plugin.api.setup();
  });
}).fail(function(error) {
  apiLogger.error(error);
  process.exit(1);
});
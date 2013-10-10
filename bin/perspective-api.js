#!/usr/bin/env node

var server = require('../lib/server');
var db = require("../lib/db");
var config = require("../config.json");
var PluginsLoader = require("../lib/pluginsLoader");
var apiLogger = require('../lib/apiLogger');


db(config.db).then(function(createRepository) {
  var pluginsLoader = new PluginsLoader(server(config.server), createRepository);
  var plugins = pluginsLoader.load(config.plugins);
  plugins.forEach(function(plugin) {
    apiLogger.info('Setting up plugin with name: ' + plugin.config.name);
    plugin.api.setup();
  });
}).fail(function(error) {
  apiLogger.error(error);
  process.exit(1);
});
#!/usr/bin/env node

var Server = require('../lib/server'),
  Db = require("../lib/db"),
  config = require("../config.json"),
  PluginsLoader = require("../lib/pluginsLoader"),
  server = new Server(config.server),
  database = new Db(config.db);

database.setup().then(function() {
  server.start();
  var pluginsLoader = new PluginsLoader(server, database);
  var plugins = pluginsLoader.load(config.plugins);
  plugins.forEach(function(plugin) {
    console.log('Setting up plugin with name: ' + plugin.config.name);
    plugin.api.setup();
  });
}).fail(function(error) {
  console.log(error);
  process.exit(1);
});
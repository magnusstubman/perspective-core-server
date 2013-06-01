var generatePluginApi = function(server, database) {
  return {
    server: server.api,
    db: database.api
  }
};

var Plugins = function(server, database) {
  this.generatedAPI = generatePluginApi(server, database);
};

Plugins.prototype.load = function(plugins) {
  var that = this;
  return plugins.map(function(plugin) {
    return that.loadPlugin(plugin, that.generatedAPI);
  });
};

Plugins.prototype.loadPlugin = function(plugin, generatedApi) {
  var pluginAPI = this.require(plugin.name)(generatedApi, plugin.config || {});
  return {
    api: pluginAPI,
    config: plugin
  };
};

Plugins.prototype.require = function(pluginName) {
  return require("perspective-api-" + pluginName);
};

module.exports = Plugins;
var Plugins = function(restServer, webSocketServer, db) {
  this.api = {
    restServer: restServer.api,
    db: db.api,
    webSocketServer: webSocketServer.api
  };
};

Plugins.prototype.load = function(plugins) {
  var that = this;
  return plugins.map(function(plugin) {
    return that.loadPlugin(plugin, that.api);
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
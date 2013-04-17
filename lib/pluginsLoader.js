var internals = {
  generatePluginApi: function(server, database) {
    return {
      server: server.api,
      db: database.api
    }
  }
};

exports = module.exports = internals.Plugins = function(server, database) {
  this.generatedAPI = internals.generatePluginApi(server, database);
};

internals.Plugins.prototype.load = function(plugins) {
  var that = this;
  return plugins.map(function(plugin) {
    return that.loadPlugin(plugin, that.generatedAPI);
  });
};

internals.Plugins.prototype.loadPlugin = function(plugin, generatedApi) {
  var pluginAPI = this.require(plugin.name)(generatedApi, plugin.config || {});
  return {
    api: pluginAPI,
    config: plugin
  };
};

internals.Plugins.prototype.require = function(pluginName) {
  return require("perspective-api-" + pluginName);
};
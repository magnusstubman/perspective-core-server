var Plugins = function(server, createRepository) {
  this.api = {
    server: server,
    createRepository: createRepository
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
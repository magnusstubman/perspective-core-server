module.exports = function loadPlugins(plugins, server, database) {
    return plugins.map(function(plugin) {
        var initializer = require("perspective-api-" + plugin.name);
        return {
            api: initializer({
                server: server.api,
                db: database.api
                },
                plugin.config || {}
            ),
            config: plugin };
    });
};
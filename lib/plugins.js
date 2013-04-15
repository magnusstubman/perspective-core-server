var _ = require('underscore');

var verbs = [
    "post",
    "put",
    "get",
    "del"
];

function context(con, func) {
    return function() {
        func.apply(con, arguments)
    }
}

module.exports = {
    initialize: function(options) {
        this.server = options.server;
        this.db = options.db;
        this.plugins = options.plugins;

        var self = this;
        _.each(this.plugins, function(plugin) {
            plugin.initialize({
                routes: {
                    registerRoute: context(self, self.registerRoute)
                },
                db: {
                    insert: context(self, self.db.insert),
                    get: context(self, self.db.get)
                }
            });
        });
    },

    registerRoute: function(verb, url, callback) {
        if (!_.contains(verbs, verb)) {
            throw new Error("The register function only support: " + verbs.join());
        }

        var verbFunc = this.server[verb];
        verbFunc.call(this.server, url, callback);
    }
};
var services = require("../services");

module.exports = {
    initialize: function(server) {
        services.db.registerTable("status");
    },

    mountAPI: function(server) {
        server.get('/status', function(req, res, next) {
            services.db.get("status", function(result) {
                res.send(result);
                next();
            });
        });

        server.post('/status', function(req, res, next) {
            services.db.insert("status", req.body, function() {
                res.send(201, req.body);
                next();
            });
        });
    }
};
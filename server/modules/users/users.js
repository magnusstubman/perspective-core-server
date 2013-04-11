var services = require("../services"),
    validation = require("../../components/validation.js");

module.exports = {
    initialize: function(server) {
        services.db.registerTable("users");
    },

    mountAPI: function(server) {

        server.get('/users', function(req, res, next) {
            services.db.get("users", function(result) {
                res.send(result);
                next();
            });
        });

        server.post('/users', function(req, res, next) {
            var errors = validation(req.body, {
                username: {
                    required: true
                }
            });

            if (errors !== undefined) {
                res.send(400, errors);
                next();
                return;
            }

            services.db.insert("users", req.body, function() {
                res.send(201, req.body);
                next();
            });
        });
    }
};
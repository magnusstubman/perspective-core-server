var db = require("../base/db.js"),
    validation = require("../../components/validation.js");

module.exports = {
    initialize: function(server) {
        server.get('/users', function(req, res, next) {
            db.get("users", function(result) {
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

            db.insert("users", req.body, function() {
                res.send(201, req.body);
                next();
            });
        });
    }
};
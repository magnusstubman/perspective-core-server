var db = require("../base/db.js");

module.exports = {
    initialize: function(server) {
        server.get('/users', function(req, res, next) {
            db.get("users", function(result) {
                res.send(result);
                next();
            });
        });

        server.post('/users', function(req, res, next) {
            db.insert("users", req.body, function() {
                res.send(201, req.body);
                next();
            });
        });
    }
};
var db = require("../base/db.js");

module.exports = {
    initialize: function(server) {
        server.get('/status', function(req, res, next) {
            db.get("status", function(result) {
                res.send(result);
                next();
            });
        });

        server.post('/status', function(req, res, next) {
            db.insert("status", req.body, function() {
                res.send(201, req.body);
                next();
            });
        });
    }
};
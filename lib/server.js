var restify = require('restify');
var _ = require('underscore');
var apiLogger = require('./apiLogger');

var configure = function(server, config) {
  if (config.crossSiteRequest) {
    var xRequestedWith = 'x-requested-with';
    server.use(restify.CORS({
      headers: [xRequestedWith],
      origins: [config.crossSiteRequest.allowedOrigin]
    }));

    restify.CORS.ALLOW_HEADERS.push(xRequestedWith);
  }

  server.use(restify.dateParser());
  server.use(restify.queryParser());
  server.use(restify.bodyParser({mapParams: false}));

  server.on('after', restify.auditLogger({ log: apiLogger }));

  server.on('uncaughtException', function(req, res, route, err) {
    apiLogger.error(err);
    res.send(err);
  });

};

var generateAPI = function(server) {

  return {
    route: function(verb, url, callback) {
      var verbs = [
        "post",
        "put",
        "get",
        "del",
        "patch"
      ];

      if (!_.contains(verbs, verb)) {
        throw new Error("These verbs are supported: " + verbs.join());
      }

      var verbFunc = server[verb];
      verbFunc.call(server, url, callback);
    }
  }
};

module.exports = function(config) {
  apiLogger.info("Starting server on port " + config.port);
  var server = restify.createServer({
    name: 'perspective',
    log: apiLogger
  });

  configure(server, config);
  server.listen(config.port);
  apiLogger.info("Server started");

  return generateAPI(server);
};
var restify = require('restify');
var _ = require('underscore');
var apiLogger = require('./apiLogger');

var configure = function(instance, config) {
  if (config.crossSiteRequest) {
    var xRequestedWith = 'x-requested-with';
    instance.use(restify.CORS({
      headers: [xRequestedWith],
      origins: [config.crossSiteRequest.allowedOrigin]
    }));

    restify.CORS.ALLOW_HEADERS.push(xRequestedWith);
  }

  instance.use(restify.dateParser());
  instance.use(restify.queryParser());
  instance.use(restify.bodyParser({mapParams: false}));

  instance.on('after', restify.auditLogger({ log: apiLogger }));

  instance.on('uncaughtException', function(req, res, route, err) {
    apiLogger.error(err);
    res.send(err);
  });

};

var api = function(server) {

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

var Server = function(config) {
  this.config = config;
  this.instance = null;
  this.api = null;
};

Server.prototype = {
  start: function() {
    apiLogger.info("Starting server on port " + this.config.port);
    this.instance = restify.createServer({
      name: 'perspective',
      log: apiLogger
    });

    configure(this.instance, this.config);
    this.instance.listen(this.config.port);
    apiLogger.info("Server started");

    this.api = api(this.instance);
  }
};

module.exports = Server;
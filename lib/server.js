var restify = require('restify');
var _ = require('underscore');

var configure = function(instance, config, logger) {
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

  instance.on('after', restify.auditLogger({ log: logger }));

  instance.on('uncaughtException', function(req, res, route, err) {
    this.logger.error(err);
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

var Server = function(config, logger) {
  this.logger = logger;
  this.config = config;
  this.instance = null;
  this.api = null;
};

Server.prototype = {
  start: function() {
    this.logger.info("Starting server on port " + this.config.port);
    this.instance = restify.createServer({
      name: 'perspective',
      log: this.logger
    });

    configure(this.instance, this.config, this.logger);
    this.instance.listen(this.config.port);
    this.logger.info("Server started");

    this.api = api(this.instance);
  }
};

module.exports = Server;
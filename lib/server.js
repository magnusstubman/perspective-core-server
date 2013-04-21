var restify = require('restify'),
  _ = require('underscore');

var configure = function(instance, config) {
  instance.use(restify.bodyParser({mapParams: false}));

  if (config.crossSiteRequest) {
    instance.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", config.crossSiteRequest.allowedOrigin);
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      next();
    });
  }
};

var api = function(server) {

  return {
    route: function(verb, url, callback) {
      var verbs = [
        "post",
        "put",
        "get",
        "del"
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
    console.log("Starting server on port " + this.config.port);
    this.instance = restify.createServer({
      name: 'perspective'
    });

    this.instance.on('uncaughtException', function (req, res, route, err) {
      console.log(err);
      res.send(err);
    });

    configure(this.instance, this.config);
    this.instance.listen(this.config.port);
    console.log("Server started!");

    this.api = api(this.instance);
  }
};

module.exports = Server;
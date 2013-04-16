var restify = require('restify');

function Server(config) {
  this.config = config;
}

Server.prototype = {
  start: function(modules) {
    console.log("Starting server on port " + this.config.port);
    this.instance = restify.createServer({
      name: 'perspective'
    });

    configure(this.instance, this.config);
    this.mount(modules);

    this.instance.listen(this.config.port);
    console.log("Server started!");
  },

  mount: function(modules) {
    var server = this;
    modules.forEach(function(module) {
      module.mountAPI(server.instance);
    });
  }
};

function configure(instance, config) {
  instance.use(restify.bodyParser({mapParams: false}));

  if (config.crossSiteRequest) {
    instance.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", config.crossSiteRequest.allowedOrigin);
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      next();
    });
  }
}

module.exports = Server;
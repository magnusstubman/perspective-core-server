var restify = require('restify');

function Server(config) {
    this.config = config;
	this.instance = null;
}

Server.prototype = {
    start: function() {
        console.log("Starting server on port " + this.config.port);
        this.instance = restify.createServer({
            name: 'perspective'
        });

        configure(this.instance, this.config);

        this.instance.listen(this.config.port);
        console.log("Server started!");
    }
};

function configure(instance, config){
    instance.use(restify.bodyParser({mapParams:false}));

    if(config.crossSiteRequest) {
        instance.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", config.crossSiteRequest.allowedOrigin);
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            next();
        });
    }
}

module.exports = Server;
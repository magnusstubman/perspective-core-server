var apiLogger = require('./apiLogger');
var WebSocketServer = require('websocket').server;
var webSocketHelper = require('perspective-core').webSocketHelper;

function generateAPI(wsServer) {

  return function(channel) {

    var send = function(event, object) {
      var jsonString = webSocketHelper.createJSONString(channel, event, object);

      wsServer.connections.forEach(function(connection) {
        connection.send(jsonString);
      });
    };

    return {
      send: send,
      on: function(event, callback) {
        webSocketHelper.on(channel, event, callback);
      },
      standardEvents: webSocketHelper.standardEvents
    }
  }
}

function originIsAllowed(origin, config) {
  return origin === config.crossSiteRequest.allowedOrigin;
}

function configure(wsServer, api, config) {

  wsServer.on('request', function(request){
    if (!originIsAllowed(request.origin, config)) {
      request.reject();
      apiLogger.info('Connection from origin ' + request.origin + ' rejected');
      return;
    }

    var connection = request.accept('perspective-protocol', request.origin);

    connection.on("message", function(message) {
      var errors = webSocketHelper.onMessage(message, api);

      if (errors) {
        api('server').send(webSocketHelper.standardEvents.error, errors);
      }
    });

    apiLogger.info(connection.remoteAddress + " connected - Protocol Version " + connection.webSocketVersion);
    apiLogger.info(wsServer.connections.length + ' clients connected to WS');
  });

  wsServer.on('close', function(connection) {
    apiLogger.info(connection.remoteAddress + " disconnected");
    apiLogger.info(wsServer.connections.length + ' clients connected to WS');
  });
}

module.exports = function(httpServer, config) {
  apiLogger.info("Setting up WebSocket connection");

  var wsServer = new WebSocketServer({
    httpServer: httpServer
  });

  var api = generateAPI(wsServer);
  configure(wsServer, api, config);

  return {api: api};
};
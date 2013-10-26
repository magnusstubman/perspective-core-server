var Logger = require('bunyan');

module.exports = function(name) {
  name = 'perspective-' + name;
  return new Logger({
    name: name,
    streams: [
      {
        stream: process.stdout,
        level: 'debug'
      },
      {
        path: 'trace-' + name + '.log',
        level: 'trace'
      }
    ],
    serializers:Logger.stdSerializers
  });
};
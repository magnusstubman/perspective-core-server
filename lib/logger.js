var Logger = require('bunyan');

module.exports = new Logger({
  name: 'perspective',
  streams: [
    {
      stream: process.stdout,
      level: 'debug'
    },
    {
      path: 'trace.log',
      level: 'trace'
    }
  ],
  serializers:Logger.stdSerializers
});
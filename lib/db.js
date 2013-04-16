var rethinkdb = require('rethinkdb'),
  Q = require('q');

function api(instance) {

  return {
    registerTable: function(table) {
      instance.tables.push(table);
    },
    insert: function(table, json, callback) {
      instance.connect(function(conn, db) {
        db.table(table).insert(json).run(conn, function(err, result) {
          if (err) throw err;
          callback(result);
        });
      });
    },
    get: function(table, callback) {
      instance.connect(function(conn, db) {
        db.table(table).run(conn, function(err, cur) {
          if (err) throw err;

          cur.toArray(function(err, results) {
            callback(results);
          });
        });
      });
    }
  }
}

function Db(config) {
  this.config = config;
  this.tables = [];
  this.api = null;
}

Db.prototype.setup = function() {
  var deferred = Q.defer();
  var that = this;

  this.api = api(that);

  that.connect(function(conn) {
    that.tables.forEach(function(table) {
      that.db.tableCreate(table).run(conn, function(err, res) {
        if (res && res.created === 1) {
          console.log("Table created: " + table);
        }
      });
    });

    deferred.resolve();
  });

  return deferred.promise;
};

Db.prototype.connect = function(callback) {
  var instance = this;

  var dbName = 'perspective';

  if (!instance.connection) {
    rethinkdb.connect({ host: instance.config.host, port: instance.config.port }, function(err, conn) {
      if (err) throw err;
      console.log("Database connection established");
      instance.connection = conn;

      rethinkdb.dbCreate(dbName).run(conn, function(err, res) {
        if (res && res.created === 1) {
          console.log("Database created: " + dbName);
        }
      });

      instance.db = rethinkdb.db(dbName);
      conn.use(dbName);
      callback(conn, instance.db);
    });
  } else {
    callback(instance.connection, instance.db);
  }
};

module.exports = Db;
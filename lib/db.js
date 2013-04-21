var rethinkdb = require('rethinkdb'),
  Q = require('q');

var registerTable = function(instance, table) {
  instance.connect(function(conn, db) {
    db.tableCreate(table).run(conn, function(err, res) {
      if (res && res.created === 1) {
        console.log("Table created: " + table);
      }
    });
  });
};

var insert = function(instance, table, json, callback) {
  instance.connect(function(conn, db) {
    db.table(table).insert(json).run(conn, function(err, result) {
      if (err) throw err;
      callback(result);
    });
  });
};

var get = function(instance, table, callback, id) {
  instance.connect(function(conn, db) {

    if (id) {
      db.table(table).get(id).run(conn, function(err, result) {
        if (err) throw err;

        callback(result);
      });
    } else {
      db.table(table).run(conn, function(err, cur) {
        if (err) throw err;

        cur.toArray(function(err, results) {
          callback(results);
        });
      });
    }
  });
};

var api = function(instance) {
  return {
    registerTable: function(table) {
      registerTable(instance, table);
    },
    insert: function(table, json, callback) {
      insert(instance, table, json, callback);
    },
    get: function(table, callback, id) {
      get(instance, table, callback, id);
    }
  };
};

var Db = function(config) {
  this.config = config;
  this.api = null;
};

Db.prototype.setup = function() {
  var deferred = Q.defer();
  var that = this;

  this.api = api(that);

  this.connect(function() {
    deferred.resolve();
  });

  return deferred.promise;
};

Db.prototype.connect = function(callback) {
  var instance = this;
  var dbName = instance.config.name;

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
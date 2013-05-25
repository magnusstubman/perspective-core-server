var rethinkdb = require('rethinkdb'),
  Q = require('q');

var _registerTable = function(instance, table) {
  instance.connect(function(conn, db) {
    db.tableCreate(table).run(conn, function(err, res) {
      if (res && res.created === 1) {
        console.log("Table created: " + table);
      }
    });
  });
};

var _insert = function(instance, table, json) {
  var deferred = Q.defer();
  instance.connect(function(conn, db) {
    db.table(table).insert(json).run(conn, function(err, result) {
      if (err) deferred.reject(err);

      deferred.resolve(result);

    });

  });


  return deferred.promise;
};

var _get = function(instance, table, id) {
  var deferred = Q.defer();

  instance.connect(function(conn, db) {

    if (id) {
      db.table(table).get(id).run(conn, function(err, result) {
        if (err) deferred.reject(err);

        deferred.resolve(result);
      });
    } else {
      db.table(table).run(conn, function(err, cur) {
        if (err) deferred.reject(err);

        cur.toArray(function(err, results) {
          deferred.resolve(results);
        });
      });
    }
  });

  return deferred.promise;
};

var _update = function(instance, table, id, data) {
  var deferred = Q.defer();

  instance.connect(function(conn, db) {
    if (id) {
      db.table(table).get(id).update(data).run(conn, function(err, result) {
        if (err) deferred.reject(err);

        deferred.resolve(result);
      });
    }
  });

  return deferred.promise;
};

var _delete = function(instance, table, id) {
  var deferred = Q.defer();
  instance.connect(function(conn, db) {

    db.table(table).get(id).delete().run(conn, function(err, result) {
      if (err) deferred.reject(err);

      deferred.resolve(result);
    });

  });

  return deferred.promise;
};

var api = function(instance) {
  return {
    r: rethinkdb,
    db: instance.db,
    connection: instance.connection,
    helpers: {
      registerTable: function(table) {
        _registerTable(instance, table);
      },
      insert: function(table, json) {
        return _insert(instance, table, json);
      },
      get: function(table, id) {
        return _get(instance, table, id);
      },
      delete: function(table, id) {
        return _delete(instance, table, id);
      },
      update: function(table, id, data) {
        return _update(instance, table, id, data);
      }
    }
  };
};

var Db = function(config) {
  this.config = config;
  this.api = null;
  this.connection = null;
  this.db = null;
};

Db.prototype.setup = function() {
  var deferred = Q.defer();
  var that = this;

  this.connect(function() {
    that.api = api(that);
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
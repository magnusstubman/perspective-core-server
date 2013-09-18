var rethinkdb = require('rethinkdb');
var Q = require('q');
var apiLogger = require('./apiLogger');
var backendErrors = require('perspective-core').errors.backend;
var _ = require('underscore');

var _connection = null;

var _registerTable = function(tableName) {
  rethinkdb.tableCreate(tableName).run(_connection, function(err, res) {
    if (res && res.created === 1) {
      apiLogger.info("Table created: " + tableName);
    }
  });
};

var _insert = function(tableName, object) {
  var deferred = Q.defer();

  rethinkdb.table(tableName).insert(object.attributes).run(_connection, function(err, result) {
    if (err) {
      apiLogger.error(err);
      deferred.reject(err);
      return;
    }

    var keys = result.generated_keys;
    if (keys.length === 1) {
      object.attributes.id = keys.pop();
      deferred.resolve(object);
      return;
    }

    throw new Error("Something is wrong, I should not be here!");
  });

  return deferred.promise;
};

function createStandardArrayCallback(Clazz, deferred) {
  return function(error, cursor) {
    if (error) {
      apiLogger.error(err);
      deferred.reject(err);
      return;
    }

    cursor.toArray(function(err, results) {

      if (err) {
        apiLogger.error(err);
        deferred.reject(err);
        return;
      }

      var objects = _.map(results, function(dbObject) {
        return new Clazz(dbObject);
      });

      deferred.resolve(objects);
    });
  }
}

var _get = function(tableName, Clazz, id) {
  var deferred = Q.defer();

  if (id) {
    rethinkdb.table(tableName).get(id).run(_connection, function(err, result) {
      if (err) {
        apiLogger.error(err);
        deferred.reject(err);
        return;
      }

      if (!result) {
        deferred.reject(new backendErrors.NotFoundError("Could not find " + tableName + " with id: " + id));
        return;
      }

      deferred.resolve(new Clazz(result));

    });
  } else {
    rethinkdb.table(tableName).run(_connection, createStandardArrayCallback(Clazz, deferred));
  }

  return deferred.promise;
};

var _update = function(tableName, Clazz, object) {
  var deferred = Q.defer();

  rethinkdb.table(tableName).get(object.attributes.id).update(object.attributes).run(_connection, function(err, result) {
    if (err) {
      apiLogger.error(err);
      deferred.reject(err);
    }

    deferred.resolve(object);
  });

  return deferred.promise;
};

var _delete = function(tableName, Clazz, id) {
  var deferred = Q.defer();

  rethinkdb.table(tableName).get(id).delete().run(_connection, function(err, result) {
    if (err) {
      apiLogger.error(err);
      deferred.reject(err);
    }

    deferred.resolve(result);
  });

  return deferred.promise;
};

var api = function() {
  return function createRepository(tableName, Clazz) {
    _registerTable(tableName);

    return {
      table: function() {
        return rethinkdb.table(tableName);
      },
      connection: _connection,
      insert: function(object) {
        return _insert(tableName, object);
      },
      get: function(id) {
        return _get(tableName, Clazz, id);
      },
      delete: function(id) {
        return _delete(tableName, Clazz, id);
      },
      update: function(object) {
        return _update(tableName, Clazz, object);
      },
      all: function() {
        return _get(tableName, Clazz);
      },
      createStandardArrayCallback: function(deferred) {
        return createStandardArrayCallback(Clazz, deferred);
      }
    }
  }
};


module.exports = function(config) {
  var deferred = Q.defer();

  rethinkdb.connect({ host: config.host, port: config.port }, function(err, connection) {
    if (err) {
      deferred.reject(err);
    }

    apiLogger.info("Database connection established");
    _connection = connection;

    var dbName = config.name;
    rethinkdb.dbCreate(dbName).run(_connection, function(err, res) {
      if (res && res.created === 1) {
        apiLogger.info("Database created: " + dbName);
      }
    });

    _connection.use(dbName);

    deferred.resolve(api());
  });

  return deferred.promise;
};
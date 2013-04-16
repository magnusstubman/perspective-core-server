var rethinkdb = require('rethinkdb'),
	Q = require('q');

function Db(config) {
    this.config = config;
    this.tables = [];
}

Db.prototype.setup = function() {
	var deferred = Q.defer();
	var that = this;

    that.connect(function(conn) {
        that.tables.forEach(function(table, index) {
            that.db.tableCreate(table).run(conn, function(err, res) {
                if(res && res.created === 1) {
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

	if(!instance.connection) {
		rethinkdb.connect({ host: instance.config.host, port: instance.config.port }, function(err, conn) {
	  		if(err) throw err;
	  		console.log("Database connection established");
            instance.connection = conn;

	  		rethinkdb.dbCreate(dbName).run(conn, function(err, res) {
				if(res && res.created === 1) {
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

Db.prototype.registerTable = function(table) {
    this.tables.push(table);
}

Db.prototype.insert = function(table, json, callback) {
    this.connect(function(conn, db){
        db.table(table).insert(json).run(conn, function(err, result) {
            if(err) throw err;
            callback(result);
        });
    });
};

Db.prototype.get = function(table, callback) {
    this.connect(function(conn, db) {
        db.table(table).run(conn, function(err, cur) {
            if(err) throw err;

            cur.toArray(function(err, results) {
                callback(results);
            });
        });
    });
}

module.exports = Db;
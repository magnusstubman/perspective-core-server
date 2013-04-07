var rethinkdb = require('rethinkdb');

function Db() {

}

Db.prototype.setup = function(options) {
	var tables = options.config.tables,
		that = this;

    that.connect(function(conn) {
        tables.forEach(function(table) {
            that.db.tableCreate(table).run(conn, function(err, res) {
                if(res && res.created === 1) {
                    console.log("Database created");
                }
            });
        });

        options.success();
    });
};

Db.prototype.connect = function(callback) {
	var instance = this;

    var dbName = 'perspective';

	if(!instance.connection) {
		rethinkdb.connect({ host: 'localhost', port: 28015 }, function(err, conn) {
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

module.exports = new Db();
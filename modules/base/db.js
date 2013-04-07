var rethinkdb = require('rethinkdb');

function Db() {

}

Db.prototype.setup = function() {
	var tables = ["tasks"],
		that = this;

    that.connect(function(conn) {
        tables.forEach(function(table) {
            that.db.tableCreate(table).run(conn, function(err, res) {
                if(err) {
                    console.log(table + " already exists");
                }
            });
        });
    });
};

Db.prototype.connect = function(callback) {
	var instance = this;

	if(!instance.connection) {
		console.log("no connection, creating new connection");
		rethinkdb.connect({ host: 'localhost', port: 28015 }, function(err, conn) {
	  		if(err) throw err;
	  		console.log("Connection established");
            instance.connection = conn;

            console.log("Creating database");
	  		rethinkdb.dbCreate('perspective').run(conn, function(err, res) {
				if(res && res.created === 1) {
                    console.log("Database created");
                } else {
                    console.log("Database already exists");
                }
			});

			instance.db = rethinkdb.db('perspective');
			conn.use('perspective');
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
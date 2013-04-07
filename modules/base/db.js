var r = require('rethinkdb');

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
		r.connect({ host: 'localhost', port: 28015 }, function(err, conn) {
	  		if(err) throw err;
	  		console.log("Connection established");
	  		instance.connection = conn;

            console.log("Creating database");
	  		r.dbCreate('perspective').run(instance.connection, function(err, res) {
				if(err) {
                    console.log("Database already exists");
                } else {
                    console.log("Database created");
                }
			});

			instance.db = r.db('perspective');
			instance.connection.use('perspective');
            callback(instance.connection);
	  	});
  	} else {
        callback(instance.connection);
    }
};

Db.prototype.insert = function(table, json, callback) {
    var instance = this;

    this.connect(function(conn){

        instance.db.table(table).insert(json).run(conn, function(err, result) {
            if(err) throw err;
            console.log(result);
            callback();
        });
    });

};

module.exports = new Db();
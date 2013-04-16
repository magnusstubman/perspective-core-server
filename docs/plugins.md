# plugins

## Requirements
* defines its own datastructure and database tables
* defines its api. Mounted under its own namespace
* back-end/server plugins have no knowledge of front-end and should be designed in a RESTful and client-agnostic way

## Example: Task

	{
		namespace: 'tasks',

		// Runs on server startup (step 1)
		setup: function() {
			// create/validate/migrate db (tasks)
		},
		// Runs on server startup (step 2)
		api: function(server) {
			// GET http://server/tasks
			server.get('/' + this.namespace + '/', function(req, res, next) {
				services.db.get(this.namespace, function(result) {
					res.send(result);
					next();
				});
			});
			// mount other public resources
		}
	}

## Example: plugin extending tasks (Status)

	{
		namespace: 'statuses',
		setup: function() {
			// create/validate/migrate db (statuses)
			// backfill other objects as necessary, e.g. existing tasks
		},
		api: function(server) {
			// Define own api
		},
		extensions: function() {
			// hook into other plugins and decorate data somehow
		}
	}

## Inspiration / how have others solved plugins?
* [architect](https://github.com/c9/architect)
	* plugins are npm modules
	* the [server](https://github.com/c9/architect/blob/master/demos/calculator/server.js) loads plugins via a
	[config.js](https://github.com/c9/architect/blob/master/demos/calculator/config.js) file. Seems to load each plugin/package.json
	and discover the plugin.provides / plugin.consumes relations before it loads plugins in the correct order
	* plugins implement a `function setup(options, imports, register)` interface
	* plugins calls `register()` and can use `imports.whateverineedasaplugin`
	* npm config in each plugin has a `consumes` and/or `provides` nodes

			"plugin": {
				"provides": ["database"]
			}

* [grunt](https://github.com/gruntjs)
	* plugins are npm modules
	* Each project's Gruntfile loads plugins via `grunt.loadNpmTasks('grunt-contrib-pluginname');`. A plugin may load other plugins
	the same way
	* plugins implement a `function(grunt)` interface where some of grunt's methods are exposed (`initConfig`, `loadTasks`, etc)
* [connect](https://github.com/senchalabs/connect) - proxied by [express](https://github.com/visionmedia/express)' `app.use(middleware)` calls
	* Explicity require plugins with `var plugin = require("plugin"); app.use(plugin())`
	* `use()` implemented in [proto.js](https://github.com/senchalabs/connect/blob/master/lib/proto.js)
	* plugins implement `function(req, res, next)` (webserver/inspired from filters)
	* plugins are found in
		* [https://github.com/senchalabs/connect/tree/master/lib/middleware](https://github.com/senchalabs/connect/tree/master/lib/middleware)
* [hapi](https://github.com/spumko/hapi)

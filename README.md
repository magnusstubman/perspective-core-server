# perspective-api
A simple task manager for agile software development. 

This is perspective's api component. If you're not familiar with perspective, you should check out the [perspective client repo](https://github.com/perspective/perspective-client) first.

Alpha quality for now - work in progress!

## Usage
1. Install node.js (tested on 0.10.2) and RethinkDB (tested on 1.4.2)
2. `npm install`
3. Install desired plugins from `perspective-<pluginrepo>` (not implemented yet)
4. Start RethinkDB server with `rethinkdb`
5. Start the server with `perspective-api`
6. Access API via `http://localhost:8888/tasks`
7. Looking for a front-end? Checkout the [perspective client repo](https://github.com/perspective/perspective-client)

## Contributing

### Assembling modules
While developing you'll need to:

1. Clone the desired modules
2. Run `npm link` inside each module in the correct order to setup symlinks

To ease this process, we recommend using [myrepos](https://github.com/joeyh/myrepos) - a tool to handle multiple repositories at once. Simply put [mr](https://github.com/joeyh/myrepos/blob/master/mr) on your `PATH` and you are good to go:

1. `mkdir perspective`
2. `curl -o .mrconfig https://github.com/perspective/perspective-api/blob/master/.mrconfig.example`
3. (review the .mrconfig file)
4. `mr checkout`  
    will git clone all modules
5. `mr link`  
    will invoke `npm link` in correct order on each module. Note: you probably get a warning here requiring you to add the path to `...perspective/.mrconfig` file to `~/.mrtrust`.

By now you should have:

	perspective
	├── perspective-api
	├── perspective-api-tasks
	├── perspective-api-views
	├── perspective-client
	└── perspective-core

Other useful `mr` commands are:

* `mr update` to run `git pull` on all modules
* `mr status` to run `git status` on all modules
* ... you get the point. See `mr help` for more info.

### Boot the server, and reload on changes:
1. `npm install -g nodemon`
2. `nodemon bin/perspective-api.js`

Want a UI? Go visit the [perspective client repo](https://github.com/perspective/perspective-client)

## Plugin architecture
Work in progress - see [docs/plugins.md](docs/plugins.md)


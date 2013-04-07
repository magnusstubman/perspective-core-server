# perspective
A simple task manager for agile software development.

Alpha quality for now - work in progress!

## Installation
1. Install node.js (tested on 0.10.2) and RethinkDB (tested on 1.4.2)
2. npm install

## Usage
1. Start RethinkDB server with `rethinkdb`
2. Start the server with `node server.js`
3. Access API via `http://localhost:8888/tasks`

Currently only a REST-api is available, but we plan to add a front-end shortly.

## TODO
* Make ports etc. configurable
* Support for `/users`
* Support for `/statuses`
* Create simple front-end
	* Prioritize tasks (ie. product backlog)
	* Scrum/kanban board
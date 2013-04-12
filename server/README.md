# perspective-server
A simple task manager for agile software development.

Alpha quality for now - work in progress!

## Installation
1. Install node.js (tested on 0.10.2) and RethinkDB (tested on 1.4.2)
2. `npm install`

## Usage
1. Start RethinkDB server with `rethinkdb`
2. Start the server with `perspective-server`
3. Access API via `http://localhost:8888/tasks`

## Development

### Reload server on changes
1. `npm install -g nodemon`
2. `nodemon bin/perspective-server.js`

## TODO
* Prioritize tasks (ie. product backlog)
* Plugin architecture
* Tests
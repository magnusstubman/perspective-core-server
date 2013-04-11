# perspective
A simple task manager for agile software development.

Alpha quality for now - work in progress!

## Installation
1. Install node.js (tested on 0.10.2) and RethinkDB (tested on 1.4.2)
2. cd server && npm install

## Usage
1. Start RethinkDB server with `rethinkdb`
2. Start the server with `perspective-server`
3. Access API via `http://localhost:8888/tasks`

Currently only a REST-api is available, but we plan to add a front-end shortly.

## Development

### Reload server on changes
1. `npm install -g nodemon`
2. `nodemon bin/perspective-server.js`

## TODO
* Prioritize tasks (ie. product backlog)
* Scrum/kanban board
* Tests (mocha?). Both front-end and back-end
* Front-end build pipeline, r.js
* Binary and NPM package for client
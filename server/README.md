# perspective-api
A simple task manager for agile software development. 

This is perspective's api component. If you're not familiar with perspective, you should check out the [perspective client repo](https://github.com/perspective/perspective) first.

Alpha quality for now - work in progress!

## Usage
1. Install node.js (tested on 0.10.2) and RethinkDB (tested on 1.4.2)
2. `npm install`
3. Install desired plugins from `perspective-<pluginrepo>` (not implemented yet)
4. Start RethinkDB server with `rethinkdb`
5. Start the server with `perspective-api`
6. Access API via `http://localhost:8888/tasks`
7. Looking for a front-end? Checkout the [perspective client repo](https://github.com/perspective/perspective)

## Development

### Reload server on changes
1. `npm install -g nodemon`
2. `nodemon bin/perspective-api.js`

## TODO
* Prioritize tasks (ie. product backlog)
* Plugin architecture
* Tests
* Choose open-source licence

## Plugin architecture

* defines its own datastructure and database tables
* defines its api. Mounted under its own namespace
* back-end/server plugins have no knowledge of front-end and should be designed in a RESTful and client-agnostic way

### Example: Task

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

### Example: plugin extending tasks (Status)

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

## Data structure

### List
The core data structure in Perspective.

* Can contain relations to other datatypes
* Can be converted to a task (TODO: plugin architecture should allow transition from one datatype to another? E.g. list
-> task, or list -> list for splitting. Similar to android intents?)

		[
			{
				id: l1,
				name: "Stuff to watch",
				description: "As a user, I want a stuff to watch list, so that I can track TV-shows I follow",
				relations: [
					{
						type: "list",
						id: l2
					}
				],
				workflow: [s1, s2, s3]
			},
			{
				id: l2,
				name: "Homeland",
				description: null,
				relations: [
					{
						type: "list",
						id: l3
					},
					{
						type: "task",
						id: t1
					}
				],
				workflow: [s1, s2, s3]
			},
			{
				id: l3,
				name: "Season 1",
				description: "Season 1 of Homeland",
				relations: [
					{
						type: "task",
						id: t2
					},
					{
						type: "task",
						id: t3
					}
				],
				workflow: [s4, s5]
			}
		]

***Relations***: An ordered array of relations to other objects. Example: represent the priority/order of the tasks in
a tasklist. Example 2: attach other lists, such as "risks", "tests" or users as "stakeholders"

***Workflow***: An ordered array of possible statuses a task in this list can have, so that:

* lists may define different types of workflow (statuses)
* modifying a workflow, or renaming/deleting a status in one list does not affect other lists

## Tasks

* A specific task which may be assigned to a user
* Cannot have subtasks, instead a task can be converted to a list. This makes it easy to break "Unspecified task 1" into "Tasklist 1"

		[
			{
				id: t2,
				name: "Research information on Brody",
				status: s2,
				assignee: u1
			},
			{
				id: t3,
				name: "Watch episode 1",
				status: s5,
				assignee: u1
			},
			{
				id: t3,
				name: "Watch episode 2",
				status: s4,
				assignee: u1
			}
		]

* Assignee: a user responsible for this task
* TODO: support "blocked" via labels?

### Activity

	[
		{
			id: a1,
			time: utc,
			user: u1,
			parent: {
				type: "task",
				id: t2
			}
			text: "Created task",
			labels: [lab1]
		},
		{
			id: a1,
			time: utc,
			user: u1,
			parent: {
				type: "list",
				id: tl2
			}
			text: "Awesome show!",
			labels: [lab2]
		}
	]

### Labels

	[
		{
			id: lab1,
			name: "Task event"
		},
		{
			id: lab2,
			name: "Comment"
		}
	]

### Statuses

	[
		{
			id: s1,
			name: "Todo"
		},
		{
			id: s2,
			name: "In progress"
		},
		{
			id: s3,
			name: "Done"
		},
		{
			id: s4,
			name: "Not seen"
		},
		{
			id: s5,
			name: "Seen"
		}
	]

### Users

	[
		{
			id: u1,
			name: "Mads"
		},
		{
			id: u2,
			name: "Hans Magnus"
		}
	]


* Can be assigned to a task
* No password (at least for now)
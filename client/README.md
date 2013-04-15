# perspective
A simple task manager for agile software development. 

!!! Alpha quality for now - work in progress !!!

By providing information tailored to the needs of each individual at any given time, our vision is that Perspective
is ***the*** single tool you or your team needs to work in the most productive way possible.

## Usage
Perspective is split into multiple parts. You are now looking at the front-end web client.

1. Install [perspective-api](https://github.com/perspective/perspective-api)
2. Install desired plugins from `perspective-pluginrep` (not implemented yet)
3. Clone this repo and run [index.html](index.html)

## Goals
* Provide each member of a team with the information most relevant to them
* Free and open-source so that anyone can use it and contribute
* Accessible, as in:
	* installable behind a company's firewall or on your own machine
	* designed for use with a regular computer, phone, TV or projector
* Flexible:
	* Have a need that is not covered by Perspective? Need to integrate with existing tools?
		* Look for a existing plugin that extends Perspective with the features you want
		* Write your own plugin and conquer the world :)
	* Can be tailored to fit most processes
* Simple:
	* A user interface that is easy to use
	* No complex workflows or permission schemes
	* Sensible defaults that helps the end user or team

## Technical details, please?
* perspective-api
	* Plugin architecture
	* REST api
	* RethinkDB
* perspective
	* Responsive

## TODO
* Prioritize tasks (ie. product backlog)
* Scrum/kanban board
* Tests
* Front-end build pipeline, r.js
* Binary and NPM package for client
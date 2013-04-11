function Services() {
}

Services.prototype = {
	register: function(key, value) {
		this[key] = value;
	}
}

module.exports = new Services();
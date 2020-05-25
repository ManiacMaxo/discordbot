const events = require('events')

class TMedia extends events.EventEmitter {
	constructor(auth) {
		super()
		this.auth = auth
	}
	async search(term) {
		throw 'Implement a search() method';
	}
}

module.exports = TMedia
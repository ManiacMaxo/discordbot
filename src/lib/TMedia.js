const events = require('events')

module.exports = class TMedia extends events.EventEmitter {
    constructor(auth) {
        super()
        this.auth = auth
    }
    async search(term) {
        throw 'Implement a search() method'
    }
}

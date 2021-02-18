const events = require('events')

module.exports = class TMediaFile extends events.EventEmitter {
    constructor(...args) {
        // TODO: setup an api if api auth is provided, instead of api object

        super()
        const self = this
        self._meta = null
        self._api = null
        self._id = null
        args.forEach((arg) => {
            switch (typeof arg) {
                case 'object':
                    if (arg.constructor.name == 'Object') {
                        Object.keys(arg).forEach((k) => {
                            switch (
                                k // TODO: api key
                            ) {
                                case 'id':
                                    self.id(arg[k])
                                    break
                                case 'api':
                                    self.api(arg[k])
                                    break
                                default:
                                // ignore unknown parameters
                            }
                        })
                    } else {
                        self.api(arg)
                    }
                    break
                case 'string':
                    self.id(arg)
                    break
                default:
                    throw Error(`Unknown parameter type "${typeof arg}"`)
            }
        })
    }
    id(id) {
        if (id === undefined) {
            return this._id
        } else {
            if (this._id === null) {
                this._id = id
            } else if (this._id !== id) {
                throw Error(
                    `Second attempt to set an id (${id} => ${this._id})`
                )
            }
        }
    }
    api(api) {
        if (api === undefined) {
            return this._api
        } else {
            if (this._api === null) {
                this._api = api
            } else if (this._api !== api) {
                throw Error(
                    `Second attempt to set an API (${api.constructor.name} => ${this._api.constructor.name})`
                )
            }
        }
    }
    _extract_raw_meta() {
        throw Error('Implement an _extract_meta() method')
    }
    _convert_raw_meta(raw) {
        throw Error('Implement a _convert_meta() method')
    }
    async meta(meta) {
        if (meta == undefined) {
            // meta lookup
            if (this._meta !== null) {
                // meta found. return
                return this._meta
            } else {
                // meta not found. attempt extract
                if (this._api !== null) {
                    // api available. extract, convert, apply and return
                    return this.meta(
                        this._convert_raw_meta(await this._extract_raw_meta())
                    )
                } else {
                    // unable to extract
                    return this._meta
                }
            }
        } else {
            // set meta and return
            this._meta = meta
            //			console.log(meta)
            return this._meta
        }
    }
    stream() {
        throw Error('Implement a stream() method')
    }
    stream_audio() {
        throw Error('Implement a stream_audio() method')
    }
    stream_video() {
        throw Error('Implement a stream_video() method')
    }
    pause() {
        throw Error('Implement a pause() method')
    }
}

const { google } = require('googleapis')

const TMedia = require('./TMedia')
const TMediaFileYoutube = require('./TMediaFileYoutube')

module.exports = class TMediaYoutube extends TMedia {
    constructor(...args) {
        super(...args)
        this.api = google.youtube({
            version: 'v3',
            auth: this.auth // specify your API key here
        })
    }

    async search(q, maxResults) {
        const self = this
        const list = await this.api.search.list({
            part: 'id',
            type: 'video',
            maxResults,
            q
        })

        list.map((item) => {
            return new TMediaFileYoutube(self.api, item.id.videoId)
        })

        return list
    }

    video(id) {
        return new TMediaFileYoutube(this.api, id)
    }
}

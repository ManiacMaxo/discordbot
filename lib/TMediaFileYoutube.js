const moment = require('moment')
const ytdl = require('ytdl-core')
//const ytdl = require('ytdl-core-discord')
const TMediaFile = require('./TMediaFile.js')

const YOUTUBE_REGEXP = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/

class TMediaFileYoutube extends TMediaFile {
	constructor(...args) {
		super(...args)
	}
	id(id) {
		if (id != undefined) {
			let x = YOUTUBE_REGEXP.exec(id)
			if (x != undefined) {
				id = x[5]
			}
		}
		return super.id(id)
	}
	async _extract_raw_meta() {
		return (await this._api.videos.list({part: 'id,snippet,contentDetails', id: this._id})).data.items[0]
	}
	_convert_raw_meta(raw) {
//		console.log(require('util').inspect(raw, { showHidden: true, depth: null }))
		return {
			id: raw.id,
			title: raw.snippet.title,
			description: raw.snippet.description.split('\n')[0],
			pubDate: moment(raw.snippet.publishedAt),
			duration: moment.duration(raw.contentDetails.duration),
			url: `https://youtu.be/${raw.id}`,
			thumbnail: raw.snippet.thumbnails.default.url,
		}
	}
	stream() {
		return ytdl(this._id, {quality: 'highest'})
	}
	stream_audio() {
//		return ytdl(this._id, {quality: 'highestaudio', filter: 'audioonly'})
		return ytdl(this._id)
	}
	stream_video() {
		return this.stream()
	}
}

module.exports = TMediaFileYoutube
const YouTube = require('discord-youtube-api')
const youtube = new YouTube(require('../config.json').youtubeKey)

const yt_regex = new RegExp(
    '/^(?:https?://)?(?:www.)?(?:youtube.com/S*(?:(?:/e(?:mbed)?)?/|watch/??(?:S*?&?v=))|youtu.be/)([w-]{11})(?:[^w-]|$)/'
)

module.exports = searchYouTube = async (args) => {
    try {
        return (video =
            args.toString == yt_regex
                ? await youtube.getVideo(args.toString())
                : await youtube.searchVideos(args.toString()))
    } catch (e) {
        return null
    }
}

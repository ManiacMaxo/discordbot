const YouTube = require('discord-youtube-api')
const youtube = new YouTube(require('./config.json').youtubeKey)

const yt_regex = new RegExp(
    '/^(?:https?://)?(?:www.)?(?:youtube.com/S*(?:(?:/e(?:mbed)?)?/|watch/??(?:S*?&?v=))|youtu.be/)([w-]{11})(?:[^w-]|$)/'
)

modules.exports = async function searchYouTube(args) {
    let video
    if (args.toString == yt_regex) {
        video = await youtube.getVideo(args.toString())
    } else {
        video = await youtube.searchVideos(args.toString())
    }
    return video
}

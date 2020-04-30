const { youtubeKey } = require("./config.json")
const YouTube = require("discord-youtube-api")
const youtube = new YouTube(youtubeKey)

async function searchYouTube(args) {
    var video = await youtube.searchVideos(args.toString())
    console.log(video)
    return String(video.url)
}

export { searchYouTube }

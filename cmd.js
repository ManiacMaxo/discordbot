const Discord = require("discord.js")
const { youtubeKey, ownerID } = require("./config.json")
const YouTube = require("discord-youtube-api")
const youtube = new YouTube(youtubeKey)
const ytdl = require("ytdl-core")

async function searchYouTube(args, channel) {
    var video = await youtube.searchVideos(args.toString())

    const msg = new Discord.MessageEmbed()
        .setColor(3447003)
        .setTitle(`**Now Playing**`)
        .setDescription(`[${video.title}](${video.url})`)
        .setThumbnail(`http://img.youtube.com/vi/<${video.id}>/default.jpg`)
        .setFooter(
            "Bot by ManiacMaxo#2456",
            "https://cdn.discordapp.com/avatars/196002293915582464/a76df50e4922dc496d2c966232ae5489.png?size=1024"
        )

    return channel.send(msg)
    // return String(video.thumbnail.url)
}

module.exports = { search: searchYouTube }

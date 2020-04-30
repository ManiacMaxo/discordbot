const { youtubeKey, ownerID } = require("../config.json")
const YouTube = require("discord-youtube-api")
const youtube = new YouTube(youtubeKey)
const ytdl = require("ytdl-core")

// --------------------------------------------------------------------------------------
// search for video on youtube
async function searchYouTube(args) {
    var video = await youtube.searchVideos(args.toString())
    console.log(video)
    return String(video.url)
}

// --------------------------------------------------------------------------------------
// stop music and clear queue
function stop(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        )
    serverQueue.songs = []
    serverQueue.connection.dispatcher.end()
}

// skip songs
function skip(message, serverQueue) {
    if (!message.member.voice.channel && !message.member.id != ownerID)
        return message.channel.send({
            embed: {
                color: 3447003,
                description:
                    "You have to be in a voice channel to stop the music!",
                footer: {
                    // icon_url: client.user.avatarURL,
                    text: "This bot was made by __ManiacMaxo#2456__",
                },
            },
        })
    if (!serverQueue)
        return message.channel.send("There is no song that I could skip!")
    serverQueue.connection.dispatcher.end()
}

// --------------------------------------------------------------------------------------
// print queue of songs
function queue(serverQueue) {
    return message.channel.send({
        embed: {
            color: 3447003,
            description: serverQueue.queue,
            footer: {
                // icon_url: client.user.avatarURL,
                text: "This bot was made by __ManiacMaxo#2456__",
            },
        },
    })
}

// --------------------------------------------------------------------------------------
// print command help
function help(message, command = null) {
    if (command) {
        switch (command) {
            case "play":
                return message.channel.send({
                    embed: {
                        color: 3447003,
                        title: "[prefix]play (name/url)",
                        description:
                            "lays the specified link or searches youtube for the query",
                        footer: {
                            // icon_url: client.user.avatarURL,
                            text: "This bot was made by __ManiacMaxo#2456__",
                        },
                    },
                })
            case "pause":
                return message.channel.send(
                    "Use: [prefix]pause\npauses the current playback"
                )
            case "stop":
                return message.channel.send(
                    "Use: [prefix]stop\nclears the queue and stops playback"
                )
            case "queue":
                return message.channel.send(
                    "Use: [prefix]queue\nprints the queue contents"
                )
            case "skip":
                return message.channel.send(
                    "Use: [prefix]skip\nskip to the next song in the queue"
                )
        }
    } else {
        return message.channel.send({
            embed: {
                color: 3447003,
                description:
                    "All the commands are available at https://maniacmaxo.github.io/musicbot/",
                footer: {
                    // icon_url: client.user.avatarURL,
                    text: "This bot was made by __ManiacMaxo#2456__",
                },
            },
        })
    }
}

// --------------------------------------------------------------------------------------
// playing a video
const YOUTUBE_REGEXP = new RegExp(
    "/^(?:https?://)?(?:www.)?(?:youtube.com/S*(?:(?:/e(?:mbed)?)?/|watch/??(?:S*?&?v=))|youtu.be/)([w-]{11})(?:[^w-]|$)/"
)

async function execute(message, args, serverQueue, srvQueue) {
    const voiceChannel = message.member.voice.channel
    if (!voiceChannel) {
        return message.channel.send({
            embed: {
                color: 3447003,
                description: "You have to be in a voice channel to play music!",
                footer: {
                    // icon_url: client.user.avatarURL,
                    text: "This bot was made by __ManiacMaxo#2456__",
                },
            },
        })
    }
    // const permissions = voiceChannel.permissionsFor(message.client.user)
    // if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    //     return message.channel.send(
    //         "I need the permissions to join and speak in your voice channel!"
    //     )
    // }

    if (!args.length && (serverQueue == undefined || !serverQueue.length)) {
        return message.channel.send({
            embed: {
                color: 3447003,
                description: "You have no songs in queue!",
                footer: {
                    // icon_url: client.user.avatarURL,
                    text: "This bot was made by __ManiacMaxo#2456__",
                },
            },
        })
    }

    const songInfo = await ytdl.getInfo(args[0])
    const song = {
        title: songInfo.title,
        url: songInfo.video_url,
    }

    if (serverQueue == undefined) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        }

        srvQueue.set(message.guild.id, queueContruct)

        queueContruct.songs.push(song)

        try {
            let connection = await voiceChannel.join()
            queueContruct.connection = connection
            play(message.guild, queueContruct.songs[0], srvQueue, args)
        } catch (err) {
            console.log(err)
            queue.delete(message.guild.id)
            return message.channel.send(err)
        }
    } else {
        serverQueue.songs.push(song)
        return message.channel.send({
            embed: {
                color: 3447003,
                description: `${song.title} has been added to the queue!`,
                thumbnail: {
                    url: song.thumbnail,
                },
                footer: {
                    // icon_url: client.user.avatarURL,
                    text: "This bot was made by __ManiacMaxo#2456__",
                },
            },
        })
    }
}

function play(guild, song, srvQueue, args) {
    let serverQueue = srvQueue.get(guild.id)
    if (!song) {
        serverQueue.voiceChannel.leave()
        queue.delete(guild.id)
        return
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(searchYouTube(args), { filter: "audioonly" }))
        .on("finish", () => {
            serverQueue.songs.shift()
            play(guild, serverQueue.songs[0])
        })
        .on("error", (error) => console.error(error))
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5)
    serverQueue.textChannel.send({
        embed: {
            color: 3447003,
            description: `Start playing: **${song.url}**`,
            footer: {
                icon_url: client.user.avatarURL,
                text: `Added by ${client.user.name}`,
            },
        },
    })
}

function pause() {
    return
}

module.exports = {
    stop: stop,
    skip: skip,
    pause: pause,
    queue: queue,
    execute: execute,
    help: help,
    searchYouTube: searchYouTube,
}

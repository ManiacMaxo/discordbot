const ytdl = require("ytdl-core")

const YOUTUBE_REGEXP = new RegExp(
    "/^(?:https?://)?(?:www.)?(?:youtube.com/S*(?:(?:/e(?:mbed)?)?/|watch/??(?:S*?&?v=))|youtu.be/)([w-]{11})(?:[^w-]|$)/"
)

async function execute(message, args, serverQueue) {
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

    const songInfo = await ytdl.getInfo(args[1])
    const song = {
        title: songInfo.title,
        url: songInfo.video_url,
    }

    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        }

        queue.set(message.guild.id, queueContruct)

        queueContruct.songs.push(song)

        try {
            let connection = await voiceChannel.join()
            queueContruct.connection = connection
            play(message.guild, queueContruct.songs[0])
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
                footer: {
                    // icon_url: client.user.avatarURL,
                    text: "This bot was made by __ManiacMaxo#2456__",
                },
            },
        })
    }
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id)
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
                // icon_url: client.user.avatarURL,
                text: "This bot was made by __ManiacMaxo#2456__",
            },
        },
    })
}

export { execute }

const ytdl = require('ytdl-core')
const utils = require('../utils')

module.exports = async function play(message, queue, masterQueue) {
    const args = message.content.trim().split(' ')
    const voiceChannel = message.member.voice.channel

    if (!voiceChannel) {
        return message.channel.send(new utils.Message().setTitle('**You need to be in a voice channel to play**'))
    }

    if (args.length === 1) {
        return message.channel.send(new utils.Message().setTitle('**No video specified**'))
    }

    const video = await utils.search(args.slice(1))
    if (!video) {
        return message.channel.send(new utils.Message().setTitle('**No video found**'))
    }

    if (!queue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            videos: [],
            volume: 1,
            playing: true,
        }

        masterQueue.set(message.guild.id, queueContruct)

        queueContruct.videos.push(video)
        try {
            queueContruct.connection = await voiceChannel.join()
            playAudio(message.guild, queueContruct)
        } catch (e) {
            console.log(e)
            queue.delete(message.guild.id)
            return message.channel.send(new utils.Message().setTitle('**There has been an error**'))
        }
    } else {
        queue.videos.push(video)
        return message.channel.send(
            new utils.Message()
                .setTitle('**video successfully added**')
                .setThumbnail(video.thumbnail)
                .setDescription(`[${video.title}](${video.url})`)
        )
    }
}

function playAudio(guild, queue) {
    const video = queue.videos[0]
    const dispatcher = queue.connection
        .play(ytdl(video.url, { quality: 'highestaudio' }), { type: 'opus' })
        .on('finish', () => {
            queue.videos.shift()
            playAudio(guild, queue)
        })
        .on('error', (e) => console.log(`hmm error: ${e}`))

    dispatcher.setVolumeLogarithmic(queue.volume / 5)
    queue.textChannel.send(
        new utils.Message()
            .setTitle('**Playing video**')
            .setThumbnail(video.thumbnail)
            .setDescription(`[${video.title}](${video.url})`)
    )
}

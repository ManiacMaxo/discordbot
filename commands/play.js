const ytdl = require('ytdl-core')
const utils = require('../utils')

module.exports = async function play(message) {
    const args = message.content.trim().split(' ')

    if (!message.member.voice.channel) {
        message.channel.send(new utils.Message().setTitle('**You need to be in a voice channel to play**'))
        return
    }

    if (args.length === 1) {
        message.channel.send(new utils.Message().setTitle('**No video specified**'))
        return
    }

    const video = await utils.search(args.slice(1))
    if (!video) {
        message.channel.send(new utils.Message().setTitle('**No video found**'))
        return
    }

    console.log(video.url)
    const output = new utils.Message()
        .setTitle('**Playing video**')
        .setThumbnail(video.thumbnail)
        .setDescription(`[${video.title}](${video.url})`)
    message.channel.send(output)
    message.member.voice.channel
        .join()
        .then((connection) => {
            console.log(`joined channel in ${message.member.voice.channel.guild}`)
            const yt = ytdl(video.url).on('end', (end) => {
                console.log('left channel')
                message.member.voice.channel.leave()
            })
            connection.play(yt, {
                quality: 'highestaudio',
                volume: 1,
            })
        })
        .catch((err) => console.log(err))
}

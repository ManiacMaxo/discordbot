const ytdl = require('ytdl-core')
const utils = require('../utils')

module.exports = async function play(message) {
    const args = message.content
        .trim()
        .split(/(?<=^\S+)\s/)[1]
        .split(' ')

    if (message.member.voice.channel) {
        if (args.length == 0) {
            message.channel.send(new utils.Message().setTitle('**No song specified**'))
            return
        }
        let video = await utils.search(args)

        console.log(video.url)
        let output = new utils.Message()
            .setTitle('**Playing Song**')
            .setThumbnail(video.thumbnail)
            .setDescription(`[${video.title}](${video.url})`)
        message.channel.send(output)
        message.member.voice.channel
            .join()
            .then((connection) => {
                console.log(`joined channel in ${message.member.voice.channel.guild}`)
                let yt = ytdl(video.url)
                // .on("end", (end) => {
                //   console.log("left channel");
                //   message.member.voice.channel.leave();
                // });
                connection.play(yt, {
                    quality: 'highestaudio',
                    volume: 1,
                })
            })
            .catch((err) => console.log(err))
    } else {
        message.channel.send(new utils.Message().setTitle('You need to be in a voice channel to play'))
    }
}

const { Message } = require('../utils')

module.exports = function stop(message, queue) {
    if (!message.member.voice.channel) {
        return message.channel.send(new Message.setTitle('**You have to be in a voice channel to stop the music!**'))
    }
    queue.videos = []
    queue.connection.dispatcher.end()
}

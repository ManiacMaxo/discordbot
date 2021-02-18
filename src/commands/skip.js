const { Message } = require('../utils')

module.exports = function skip(message, queue) {
    if (!queue)
        return message.channel.send(
            new Message.setTitle('**There is no song that I could skip!**')
        )
    queue.connection.dispatcher.end()
}

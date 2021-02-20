const { Message } = require('../utils')

module.exports = function volume(message, queue) {
    return

    // volume = parseInt(message.content.split(' ')[1])
    // if (message.content.length === 1 || !volume) {
    //     message.channel.send(new Message().setTitle('**Invalid volume**'))
    // }
    // queue.volume = message.volume
    // queue.connection.setVolumeLogarithmic(volume > 10 ? 10 : volume / 5)
}

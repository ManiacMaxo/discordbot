const { Message } = require('../utils')

module.exports = function queue(message, queue) {
    let content = ''
    queue.videos.forEach((video, index) => {
        content += `**${index}.** [${video.title}](${video.url})\n`
    })
    return message.channel.send(
        new Message().setTitle('**Current queue**').setDescription(content)
    )
}

const { Message } = require('../utils')

module.exports = async function clear(message) {
    const { channel } = message

    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
        channel.send(new Message().setTitle('Error!').setDescription('You do not have sufficient permissions'))
        return
    }

    let numberMessages = message.content.split(/ +/g)[1] || 1
    try {
        while (numberMessages > 0) {
            let fetched = await channel.messages.fetch({
                limit: numberMessages > 100 ? 100 : numberMessages,
            })

            channel.bulkDelete(fetched)
            numberMessages -= 100
        }
    } catch (e) {
        console.log(`hmm error: ${e}`)
    }
}

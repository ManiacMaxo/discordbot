const Message = require('../utils/Message')

module.exports = async function clear(message) {
    if (message.member.hasPermission('MANAGE_MESSAGES')) {
        let numberMessages = message.content.split(/ +/g)[1] || 1
        const channel = message.channel
        try {
            let fetched = await channel.messages.fetch({
                limit: numberMessages,
            })
            channel.bulkDelete(fetched)
        } catch (e) {
            console.log('hmm error: ')
            console.log(e)
        }
    } else {
        message.channel.send(new Message().setTitle('Error!').setDescription('You do not have sufficient permissions'))
    }
}

module.exports = async function clear(args, message) {
    let numberMessages = int(args[1]) || 1
    message.delete() // delete command call message
    let fetched = await channel.messages.fetch({
        limit: numberMessages,
    })
    channel.bulkDelete(fetched)
}

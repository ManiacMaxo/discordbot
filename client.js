const Discord = require('discord.js')
const { prefix } = require('./config')
const commands = require('./commands')

const client = new Discord.Client()

const queue = new Map()

client.once('ready', () => {
    console.log('Ready')
})

client.on('message', (message) => {
    if (message.content[0] !== prefix) return
    if (message.author.bot) return

    const command = message.content.slice(prefix.length).split(' ')[0].toLowerCase()
    console.log(command)

    let args = [message, queue.get(message.guild.id)]

    if (commands.hasOwnProperty(command)) {
        if (command === 'play') {
            args.push(queue)
        }
        commands[command](...args)
    }
})

module.exports = client

const Discord = require('discord.js')
const { prefix } = require('./config')
const commands = require('./commands')

const client = new Discord.Client()

const masterQueue = new Map()

client.once('ready', () => {
    console.log('Ready')
})

client.on('message', (message) => {
    if (message.content[0] !== prefix) return
    if (message.author.bot) return

    const command = message.content
        .slice(prefix.length)
        .split(' ')[0]
        .toLowerCase()
    console.log(command)

    const args = [message, masterQueue.get(message.guild.id)]

    if (commands.hasOwnProperty(command)) {
        if (command === 'play') {
            args.push(masterQueue)
        }
        commands[command](...args)
    }
})

module.exports = client

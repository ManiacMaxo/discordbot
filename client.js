const Discord = require('discord.js')
const cfg = require('./config')
const commands = require('./commands')

const client = new Discord.Client()

client.on('message', (message) => {
    if (message.content[0] !== cfg.prefix) return
    if (message.author.bot) return

    const command = message.content.slice(cfg.prefix.length).split(/ +/g)[0].toLowerCase()
    console.log(command)

    if (commands.hasOwnProperty(command)) {
        commands[command](message)
    }
})

// client.on('')

module.exports = client

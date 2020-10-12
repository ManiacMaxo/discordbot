#!/usr/bin/env node

const eventEmitter = require('events').EventEmitter
const Discord = require('discord.js')
const cfg = require('./config.json')
const utils = require('./utils')

const commands = ['play', 'clear']

class DiscordBot extends EventEmitter {
    constructor(token) {
        super()
        let self = this
        self.client = new Discord.Client()
            .once('ready', () => {
                console.log('Ready!')
            })
            .once('reconnecting', () => {
                console.log('Reconnecting!')
            })
            .once('disconnect', () => {
                console.log('Disconnect!')
            })

            .on('message', (message) => {
                if (!message.content.startsWith(cfg.cmdPrefix)) return
                self.emit('command', message)
            })
        self.client.login(token)
    }
}

DiscordBot.on('command', (message) => {
    const command = message.content
        .slice(cfg.cmdPrefix.length)
        .split(/ +/g)[0]
        .toLowerCase()

    if (command in commands) {
        command(message)
    } else {
        message.channel
            .send(new utils.Message().setTitle('Error!'))
            .setDescription('Unknown command')
    }
})

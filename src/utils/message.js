const Discord = require('discord.js')

module.exports = class Message extends Discord.MessageEmbed {
    constructor() {
        super({
            color: 3447003,
            footer: {
                text: 'Bot by ManiacMaxo#1111',
                iconURL:
                    'https://cdn.discordapp.com/avatars/196002293915582464/2a130f61b61ef8627e564b98ae329833.webp'
            }
        })
    }
}

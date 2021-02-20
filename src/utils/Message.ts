import { MessageEmbed } from 'discord.js'

export class Message extends MessageEmbed {
    constructor(title: string, iconURL?: string) {
        super({
            title,
            color: '#ffcc3b',
            footer: {
                text: 'Bot by ManiacMaxo#1111',
                iconURL:
                    iconURL ||
                    'https://cdn.discordapp.com/avatars/196002293915582464/2a130f61b61ef8627e564b98ae329833.webp'
            }
        })
    }
}

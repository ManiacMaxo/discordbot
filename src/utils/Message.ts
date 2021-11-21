import { MessageEmbed } from 'discord.js'
import { Client } from '../Client'

export class Message extends MessageEmbed {
    constructor(client: Client, title: string) {
        super({
            title,
            color: '#ffcc3b',
            footer: {
                text: `Bot by ${client.owner.username}#${client.owner.discriminator}`,
                iconURL: client.getOwnerAvatar() + '?size=64'
            }
        })
    }
}

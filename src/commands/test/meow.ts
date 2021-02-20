import { CommandoMessage } from 'discord.js-commando'
import { Client } from '../../client'
import { Command, Message } from '../../utils'

export class Meow extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'meow',
            group: 'first',
            memberName: 'meow',
            description: 'Replies with a meow, kitty cat.'
        })
    }

    run(message: CommandoMessage) {
        return message.channel.send(new Message('Meow!'))
    }
}

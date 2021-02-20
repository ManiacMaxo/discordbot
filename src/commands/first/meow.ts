import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando'

export class Meow extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'meow',
            group: 'first',
            memberName: 'meow',
            description: 'Replies with a meow, kitty cat.'
        })
    }

    run(message: CommandoMessage) {
        return message.channel.send('Meow!')
    }
}

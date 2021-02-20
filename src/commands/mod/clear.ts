import { CommandoMessage } from 'discord.js-commando'
import { Client } from '../../client'
import { Command } from '../../utils'

export class Clear extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'clear',
            group: 'mod',
            memberName: 'clear',
            description: 'Clear channel messages.',
            guildOnly: true,
            userPermissions: ['MANAGE_MESSAGES'],
            args: [
                {
                    key: 'count',
                    prompt: 'How many messagess should be deleted?',
                    type: 'number',
                    validate: (count: number) => {
                        count > 0
                    }
                }
            ]
        })
    }

    async run(message: CommandoMessage, args: any) {
        const { channel } = message

        let numberMessages = args.count || 1
        try {
            while (numberMessages > 0) {
                let fetched = await channel.messages.fetch({
                    limit: numberMessages > 100 ? 100 : numberMessages
                })

                channel.bulkDelete(fetched)
                numberMessages -= 100
            }
        } catch (e) {
            console.log(`hmm error: ${e}`)
        }
    }
}

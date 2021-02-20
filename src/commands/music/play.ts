import { Command, CommandoMessage } from 'discord.js-commando'
import { Client } from 'src/client'
import { Message } from 'src/utils'

export class Play extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'play',
            group: 'music',
            memberName: 'play',
            description: 'Play audio from YouTube.',
            guildOnly: true
        })
    }

    async run(message: CommandoMessage) {
        const args = message.content.trim().split(' ')
        const voiceChannel = message.member
            ? message.member.voice.channel
            : null

        if (!voiceChannel) {
            return message.channel.send(
                new Message().setTitle(
                    '**You need to be in a voice channel to play**'
                )
            )
        }

        if (message.content.length === 1) {
            return message.channel.send(
                new Message().setTitle('**No video specified**')
            )
        }

        const video = this.search(args.slice(1))
        if (!video) {
            return message.channel.send(
                new Message().setTitle('**No video found**')
            )
        }
    }

    async search(args: any) {
        const yt_regex = new RegExp(
            '/^(?:https?://)?(?:www.)?(?:youtube.com/S*(?:(?:/e(?:mbed)?)?/|watch/??(?:S*?&?v=))|youtu.be/)([w-]{11})(?:[^w-]|$)/'
        )

        return args.toString == yt_regex
            ? await this.client.youtube.getVideo(args.toString())
            : await this.client.youtube.searchVideos(args.toString())
    }
}

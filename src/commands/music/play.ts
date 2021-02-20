import { Video } from 'discord-youtube-api'
import { CommandoMessage } from 'discord.js-commando'
import { Client } from '../../client'
import { Message, Command } from '../../utils'

export class Play extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'play',
            group: 'music',
            memberName: 'play',
            description: 'Play audio from YouTube.',
            guildOnly: true,
            args: [
                {
                    key: 'video',
                    prompt: 'What video should be played',
                    type: 'string'
                }
            ]
        })
    }

    async run(message: CommandoMessage, args: any) {
        // const args = message.content.trim().split(' ')
        const voiceChannel = message.member
            ? message.member.voice.channel
            : null

        if (!voiceChannel) {
            return message.channel.send(
                new Message('**You need to be in a voice channel to play**')
            )
        }

        if (message.content.length === 1) {
            return message.channel.send(new Message('**No video specified**'))
        }

        const video = await this.search(args.video)
        if (!video) {
            return message.channel.send(new Message('**No video found**'))
        }

        return message.channel.send(new Message('everything is fine'))
    }

    async search(query: string): Promise<Video> {
        const ytRegex = new RegExp(
            '/^(?:https?://)?(?:www.)?(?:youtube.com/S*(?:(?:/e(?:mbed)?)?/|watch/??(?:S*?&?v=))|youtu.be/)([w-]{11})(?:[^w-]|$)/'
        )

        return ytRegex.test(query)
            ? await this.client.youtube.getVideo(query)
            : await this.client.youtube.searchVideos(query)
    }
}

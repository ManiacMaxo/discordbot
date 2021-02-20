import YouTube from 'discord-youtube-api'
import { CommandoClient, CommandoClientOptions } from 'discord.js-commando'
import path from 'path'
import { ClientOptions } from './utils'

export class Client extends CommandoClient {
    public youtube: YouTube
    public ownerPicture?: string

    constructor(options: ClientOptions) {
        super(options as CommandoClientOptions)
        this.youtube = new YouTube(options.youtubeKey)

        this.ownerPicture = options.ownerPicture

        this.registry
            .registerDefaultTypes()
            .registerGroups([
                ['test', 'Test'],
                ['music', 'Music'],
                ['mod', 'Moderation']
            ])
            .registerDefaultGroups()
            .registerDefaultCommands({
                help: false
            })
            .registerCommandsIn(path.join(__dirname, 'commands'))

        this.on('error', console.error)
    }
}

import YouTube from 'discord-youtube-api'
import { CommandoClient, CommandoClientOptions } from 'discord.js-commando'
import path from 'path'
import { ClientOptions } from 'src/utils'

export class Client extends CommandoClient {
    constructor(options: ClientOptions) {
        super(options as CommandoClientOptions)
        this.youtube = new YouTube(options.youtubeKey)

        this.ownerPicture = options.ownerPicture

        this.registry
            .registerDefaultTypes()
            .registerGroups([
                ['first', 'Your First Command Group'],
                ['second', 'Your Second Command Group']
            ])
            .registerDefaultGroups()
            .registerDefaultCommands({
                help: false
            })
            .registerCommandsIn(path.join(__dirname, 'commands'))

        this.on('error', console.error)
    }

    private youtube: YouTube
    private ownerPicture?: string

    public say() {}
}

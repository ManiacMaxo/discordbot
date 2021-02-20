import { CommandoClientOptions } from 'discord.js-commando'

export interface ClientOptions extends CommandoClientOptions {
    youtubeKey: string
    ownerPicture?: string
}

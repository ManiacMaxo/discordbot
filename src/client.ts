import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import {
    Client as DiscordClient,
    ClientOptions,
    Interaction,
    User
} from 'discord.js'
import { Message, OWNER_ID } from 'utils'

export interface IClientOptions extends ClientOptions {
    youtubeKey: string
    discordKey: string
}

export class Client extends DiscordClient {
    public owner: User
    private discordKey: string
    private youtubeApi: AxiosInstance
    private discordApi: AxiosInstance

    constructor(options: IClientOptions) {
        super(options)

        this.youtubeApi = axios.create({
            baseURL: 'https://www.googleapis.com/youtube/v3/',
            headers: {
                Authorization: `Bearer ${options.youtubeKey}`
            }
        })

        this.discordKey = options.discordKey
        this.discordApi = axios.create({
            baseURL: 'https://discordapp.com/api/v9/',
            headers: {
                Authorization: `Bot ${this.discordKey}`
            }
        })

        this.discordApi.get(`/users/${OWNER_ID}`).then((res) => {
            this.owner = res.data
            console.log('owner', res.data)
        })

        this.on('error', console.error)

        this.on('interactionCreate', async (interaction) => {
            this.handleCommand(interaction)
        })
    }

    public getOwnerAvatar() {
        return `https://cdn.discordapp.com/avatars/${this.owner.id}/${this.owner.avatar}.webp`
    }

    public getYoutubeVideo(id: string) {
        return this.youtubeApi
            .get('/videos', { params: { part: 'snippet', id } })
            .then((res: AxiosResponse) => res.data)
    }

    public async login() {
        const res = await super.login(this.discordKey)
        this.discordApi
            .put(`/applications/${this.user?.id}/commands`, {
                body: {
                    commands: [
                        {
                            name: 'ping',
                            description: 'Replies with Pong!'
                        }
                    ]
                }
            })
            .catch((err: AxiosError) => console.error(err.response?.data))
        return res
    }

    private async handleCommand(interaction: Interaction) {
        if (!interaction.isCommand()) return

        return await interaction.channel?.send({
            embeds: [new Message(this, 'Pong')]
        })
    }
}

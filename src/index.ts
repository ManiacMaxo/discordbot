require('dotenv').config()
import { Intents } from 'discord.js'
import { Client } from './Client'

const client = new Client({
    youtubeKey: process.env.YOUTUBE_KEY ?? '',
    intents: [Intents.FLAGS.GUILDS],
    discordKey: process.env.DISCORD_TOKEN ?? ''
})

client.login()

client.once('ready', () => {
    if (!client.user) return
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`)
    client.user.setActivity('Hey there!')
})

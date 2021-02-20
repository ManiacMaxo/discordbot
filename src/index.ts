require('dotenv').config()
import { Client } from 'src/client'

const client = new Client({
    commandPrefix: process.env.prefix,
    owner: process.env.owner,
    youtubeKey: process.env.youtubeKey || '',
    ownerPicture: process.env.ownerPicture
})

client.login(process.env.discordToken)

client.once('ready', () => {
    if (client.user) {
        console.log(`Logged in as ${client.user.tag}! (${client.user.id})`)
        client.user.setActivity('Hey there!')
    }
})

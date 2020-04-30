const Discord = require("discord.js")
const { prefix, token } = require("./config.json")
const ytdl = require("ytdl-core")

const client = new Discord.Client()

const queue = new Map()

client.once("ready", () => {
    console.log("Ready!")
})

client.once("reconnecting", () => {
    console.log("Reconnecting!")
})

client.once("disconnect", () => {
    console.log("Disconnect!")
})

client.on("message", async (message) => {
    if (message.author.bot || !message.content.startsWith(prefix)) return

    const serverQueue = queue.get(message.guild.id)
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()

    if (command == "play") {
        execute(message, serverQueue)
        return
    } else if (command == "skip") {
        skip(message, serverQueue)
        return
    } else if (command == "stop") {
        stop(message, serverQueue)
        return
    } else if (command == "queue") {
        queue(message, serverQueue)
    } else if (command == "help") {
        help(message)
    }
})

client.login(token)

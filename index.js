import * as cmd from "/commands"

const Discord = require("discord.js")
const { prefix, token } = require("./config.json")

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
        cmd.execute(message, args, serverQueue)
        return
    } else if (command == "skip") {
        cmd.skip(message, serverQueue)
        return
    } else if (command == "stop") {
        cmd.stop(message, serverQueue)
        return
    } else if (command == "queue") {
        cmd.queue(message, serverQueue)
    } else if (command == "help") {
        cmd.consolehelp(message, args)
    }
})

client.login(token)

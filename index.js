#!/usr/bin/env node
const cmd = require("./cmd.js")
const Discord = require("discord.js")
const { prefix, token } = require("./config.json")

const client = new Discord.Client()

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

    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const command = args.shift().toLowerCase()
    switch (command) {
        case "play":
            cmd.play(args)
            return
        case "skip":
            cmd.skip()
            return
        case "stop":
            cmd.stop()
            return
        case "queue":
            cmd.queue()
            return
        case "pause":
            cmd.pause()
            return
        case "help":
            cmd.help(args)
            return
        case "search":
            cmd.search(args, message.channel)
            return
    }
})

client.login(token)

#!/usr/bin/env node
const cmd = require("./cmd.js");
const Discord = require("discord.js");
const { prefix, token, testers } = require("./config.json");

const client = new Discord.Client();

client.once("ready", () => {
  console.log("Ready!");
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.on("message", async (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;
  if (!testers.includes(message.author.id)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  let MUTED = message.guild.roles.cache.find((r) => r.name === "MUTED");

  switch (command) {
    case "play":
      return;
    case "skip":
      return;
    case "stop":
      return;
    case "queue":
      return;
    case "pause":
      return;
    case "help":
      return;
    case "search":
      cmd.search(args, message.channel);
      return;
    case "hello":
      console.log(message);
      message.channel.send(
        new Discord.MessageEmbed()
          .setColor(3447003)
          .setTitle(`**HELLO!**`)
          .setFooter(
            "Bot by ManiacMaxo#2456",
            "https://cdn.discordapp.com/avatars/196002293915582464/a76df50e4922dc496d2c966232ae5489.png?size=1024"
          )
      );
      let role = message.guild.roles.cache.get("653353334668787772");
      let member = message.member;
      console.log(member.id);
      member.roles.add(role);
      return;
    case "clear":
      message.delete();
      const fetched = await message.channel.messages.fetch({ limit: 99 });
      message.channel.bulkDelete(fetched);
      return;
    case "mute":
      cosole.log(MUTED);
      let mute_member = message.mentions.members.first();
      mute_member.roles.add(MUTED);
      return;
    case "unmute":
      let unmute_member = message.mentions.members.first();
      unmute_member.roles.remove(MUTED);
      return;
  }
});

client.login(token);

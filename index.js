const events = require("events");
// const util = require("util");
const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const cfg = require("./config.json");
const cmd = require("./cmd.js");
// const YouTube = require("discord-youtube-api");

class DiscordBot extends events.EventEmitter {
  constructor(token) {
    super();
    let self = this;
    self.client = new Discord.Client()
      .once("ready", () => {
        console.log("Ready!");
      })
      .once("reconnecting", () => {
        console.log("Reconnecting!");
      })
      .once("disconnect", () => {
        console.log("Disconnect!");
      })
      .on("message", (message) => {
        if (message.author.bot || !message.content.startsWith(cfg.cmdPrefix))
          return;
        if (!cfg.testers.includes(message.author.id)) return;

        const args = message.content
          .slice(cfg.cmdPrefix.length)
          .trim()
          .split(/ +/g);
        const command = args.shift().toLowerCase();
        let MUTED = message.guild.roles.cache.find((r) => r.name === "Muted");
        self.emit("command", command, args, message);
      });
    self.client.login(token);
  }
}

class Message extends Discord.MessageEmbed {
  constructor() {
    let data = {
      color: 3447003,
      footer: {
        text: "Bot by ManiacMaxo#2456",
        iconURL:
          "https://cdn.discordapp.com/avatars/196002293915582464/a76df50e4922dc496d2c966232ae5489.png?size=1024",
      },
    };
    super(data);
  }
}

const d = new DiscordBot(cfg.discordToken).on(
  "command",
  async (command, args, message) => {
    switch (command) {
      // play youtube video
      case "play":
        if (message.member.voice.channel) {
          if (args.length == 0) {
            message.channel.send(
              new Message().setTitle("**No song specified**")
            );
            return;
          }
          let video = await cmd.search(args);
          console.log(video.url);
          let output = new Message()
            .setTitle("**Playing Song**")
            .setThumbnail(video.thumbnail)
            .setDescription(`[${video.title}](${video.url})`);
          message.channel.send(output);
          message.member.voice.channel
            .join()
            .then((connection) => {
              console.log(
                `joined channel in ${message.member.voice.channel.guild}`
              );
              let yt = ytdl(video.url);
              // .on("end", (end) => {
              //   console.log("left channel");
              //   message.member.voice.channel.leave();
              // });
              connection.play(yt, {
                quality: "highestaudio",
                volume: 1,
              });
            })
            .catch((err) => console.log(err));
        } else {
          message.channel.send(
            new Message().setTitle("You need to be in a voice channel to play")
          );
        }
        break;
      // clear chat
      case "clear":
        cmd.clear(args, message);
    }
  }
);

/*
class YouTubeBot extends events.EventEmitter {
  constructor() {
    let self = this;
  }
}

client.on("message", (message) => {
  if (message.author.bot || !message.content.startsWith(cfg.cmdPrefix)) return;
  if (!cfg.testers.includes(message.author.id)) return;

  const args = message.content.slice(cfg.cmdPrefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  let MUTED = message.guild.roles.cache.find((r) => r.name === "Muted");

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
    case "clear":
      cmd.clear(args, message);
      return;
    case "mute":
      console.log(MUTED);
      let mute_member = message.mentions.members.first();
      mute_member.roles.add(MUTED);
      return;
    case "unmute":
      let unmute_member = message.mentions.members.first();
      unmute_member.roles.remove(MUTED);
      return;
    case "hello":
      // console.log(message);
      message.channel.send(
        new Discord.MessageEmbed()
          .setColor(3447003)
          .setTitle(`**HELLO!**`)
          .setFooter(
            "Bot by ManiacMaxo#2456",
            "https://cdn.discordapp.com/avatars/196002293915582464/a76df50e4922dc496d2c966232ae5489.png?size=1024"
          )
      );
      // let role = message.guild.roles.cache.get("653353334668787772");
      // let member = message.author;
      // console.log(member);
      // member.roles.add(role);
      return;
  }
});

client.login(token);
*/

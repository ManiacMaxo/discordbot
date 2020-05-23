const { youtubeKey } = require("./config.json");
const constants = require("./constants.js");
const YouTube = require("discord-youtube-api");
const youtube = new YouTube(youtubeKey);

async function searchYouTube(args) {
  let video;
  if (args.toString == constants.YOUTUBE_REGEXP) {
    video = await youtube.getVideo(args.toString());
  } else {
    video = await youtube.searchVideos(args.toString());
  }
  return video;
}

async function clear(args, message) {
  let numberMessages = 1;
  let pos = 0;
  let channel = message.channel;
  if (args.length > 0) {
    if (args[0][0] == "#") {
      channel = message.guild.channels.cache.find("name", args[0]);
      console.log(channel);
      pos++;
    }
    if (!isNaN(args[pos][0])) {
      numberMessages = parseInt(args[pos]);
      pos++;
    }
  }
  message.delete();
  let fetched = await channel.messages.fetch({
    limit: numberMessages,
  });
  channel.bulkDelete(fetched);
  return;
}

module.exports = { search: searchYouTube, clear: clear };

function help(message, command = null) {
    if (command) {
        switch (command) {
            case "play":
                return message.channel.send(
                    "Use: [prefix]play (name/url)\nplays a video from youtube or queue"
                )
            case "pause":
                return message.channel.send(
                    "Use: [prefix]pause\npauses the current playback"
                )
            case "stop":
                return message.channel.send(
                    "Use: [prefix]stop\nclears the queue and stops playback"
                )
            case "queue":
                return message.channel.send(
                    "Use: [prefix]queue\nprints the queue contents"
                )
            case "skip":
                return message.channel.send(
                    "Use: [prefix]skip\nskip to the next song in the queue"
                )
        }
    } else {
        return message.channel.send(
            "All the commands are available at https://maniacmaxo.github.io/musicbot/"
        )
    }
}

export { help }

#!/usr/bin/env node

const Discord = require('discord.js')
const TMediaYoutube = require('./lib/TMediaYoutube.js')
const { printMeta } = require('./utils')
const cfg = require('./config.json')

const play = async (l, connection) => {
    let v
    if (Array.isArray(l)) {
        console.log(`\nPlaying 1 of ${l.length} clips`)
        v = l.shift()
    } else {
        v = l
    }

    connection
        .play(v.stream_audio(), { volume: false }) //, type: 'opus'})
        .once('start', async () => {
            console.log()
            printMeta(await v.meta())
        })
        .once('finish', () => {
            if (Array.isArray(l) && l.length) {
                play(l, connection)
            } else {
                console.log()
                console.log('Finished playing!')
            }
        })
        .once('end', () => {
            console.log('ended')
        })
        .on('error', console.error)
}

const main = async (q) => {
    if (q === undefined) {
        throw Error('no query parameter(s)')
    } else {
        q = q.join(' ')
    }
    const yt = new TMediaYoutube(cfg.media.youtube.auth)

    console.log(`\nSearching for "${q}"\n`)
    const s = yt.search(q)

    const d = new Discord.Client().once('ready', async () => {
        console.log('Connected to Discord')

        let channel = await d.channels
            .fetch('714420069060313091')
            .catch(console.error)
        console.log(`Joined channel "${channel.name}"`)

        play(await s, await channel.join())
    })

    d.login(cfg.service.discord.auth)
}

main(process.argv.slice(2)).catch(console.error)

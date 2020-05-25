#!/usr/bin/env node

const util = require('util')
const Discord = require("discord.js")
const TMediaYoutube = require('./lib/TMediaYoutube.js')

const cfg = require("./config.json")

function printMeta(m) {
	console.log(`Title: ${m.title}`)
	console.log(`Description: ${m.description}`)
	console.log(`Published: ${m.pubDate}`)
	console.log(`Duration: ~${m.duration.humanize()}`)
	console.log(`Link: ${m.url}`)
	console.log(`Thumbnail: ${m.thumbnail}`)
}

async function play(l, connection) {
	let v
	if (Array.isArray(l)) {
		console.log('\nPlaying 1 of %d clips', l.length)
		v = l.shift()
	} else {
		v = l
	}

	connection.play(v.stream_audio(), {volume: false}) //, type: 'opus'})
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

async function main(q) {
	if (q === undefined) {
		throw Error('no query parameter(s)')
	} else {
		q = q.join(' ')
	}
	const yt = new TMediaYoutube(cfg.media.youtube.auth)

	console.log(`\nSearching for "${q}"\n`)
	const s = yt.search(q)

	const d = new Discord.Client()
		.once('ready', async () => {
			console.log('Connected to Discord')
			
			let channel = await d.channels.fetch('714420069060313091').catch(console.error)
			console.log(`Joined channel "${channel.name}"`)

			play((await s), (await channel.join()))
		})
		
	d.login(cfg.service.discord.auth)
}

main(process.argv.slice(2)).catch(console.error)


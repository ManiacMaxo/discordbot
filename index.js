#!/usr/bin/env node

const client = require('./client')
const { discordToken } = require('./config')

// console.log(discordToken)
client.login(discordToken)

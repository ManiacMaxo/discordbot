#!/usr/bin/env node

const client = require('./client')
const { discordToken } = require('./config')

client.login(discordToken)

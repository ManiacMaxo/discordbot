import { Message, PermissionResolvable } from 'discord.js'
import {
    ArgumentCollector,
    ArgumentCollectorResult,
    CommandGroup,
    CommandInfo,
    CommandoMessage,
    ThrottlingOptions
} from 'discord.js-commando'
import { Client } from '../client'
import { permissions } from './constants'
import { oneLine } from 'common-tags'

/** A command that can be run in a client */
export abstract class Command {
    public client: Client
    public name: string
    public aliases: string[]
    public groupID: string
    public group: CommandGroup | null
    public memberName: string
    public description: string
    public format: string | null
    public details: string | null
    public examples: string[] | null
    public guildOnly: boolean
    public ownerOnly: boolean
    public clientPermissions: PermissionResolvable[] | null
    public userPermissions: PermissionResolvable[] | null
    public nsfw: boolean
    public defaultHandling: boolean
    public throttling: ThrottlingOptions | null
    public argsCollector: ArgumentCollector | null
    public argsType: string
    public argsCount: number
    public argsSingleQuotes: boolean
    public patterns: RegExp[] | null
    public guarded: boolean
    public hidden: boolean
    public unknown: boolean

    private _throttles: Map<string, Object>

    constructor(client: Client, info: CommandInfo) {
        Command.validateInfo(client, info)

        this.client = client

        this.name = info.name

        this.aliases = info.aliases || []
        if (typeof info.autoAliases === 'undefined' || info.autoAliases) {
            if (this.name.includes('-'))
                this.aliases.push(this.name.replace(/-/g, ''))
            for (const alias of this.aliases) {
                if (alias.includes('-'))
                    this.aliases.push(alias.replace(/-/g, ''))
            }
        }

        this.groupID = info.group

        this.group = null

        this.memberName = info.memberName

        this.description = info.description

        this.format = info.format || null

        this.details = info.details || null

        this.examples = info.examples || null

        this.guildOnly = Boolean(info.guildOnly)

        this.ownerOnly = Boolean(info.ownerOnly)

        this.clientPermissions = info.clientPermissions || null

        this.userPermissions = info.userPermissions || null

        this.nsfw = Boolean(info.nsfw)

        this.defaultHandling =
            info.defaultHandling !== undefined ? info.defaultHandling : true

        this.throttling = info.throttling || null

        this.argsCollector =
            info.args && info.args.length
                ? new ArgumentCollector(client, info.args, info.argsPromptLimit)
                : null
        if (this.argsCollector && typeof info.format === 'undefined') {
            this.format = this.argsCollector.args.reduce((prev, arg) => {
                const wrapL = arg.default !== null ? '[' : '<'
                const wrapR = arg.default !== null ? ']' : '>'
                return `${prev}${prev ? ' ' : ''}${wrapL}${arg.label}${
                    arg.infinite ? '...' : ''
                }${wrapR}`
            }, '')
        }

        this.argsType = info.argsType || 'single'

        this.argsCount = info.argsCount || 0

        this.argsSingleQuotes =
            info.argsSingleQuotes !== undefined ? info.argsSingleQuotes : true

        this.patterns = info.patterns || null

        this.guarded = Boolean(info.guarded)

        this.hidden = Boolean(info.hidden)

        this.unknown = Boolean(info.unknown)

        this._throttles = new Map()
    }

    hasPermission(
        message: CommandoMessage,
        ownerOverride = true
    ): boolean | string {
        if (!this.ownerOnly && !this.userPermissions) return true
        if (ownerOverride && this.client.isOwner(message.author)) return true

        if (
            this.ownerOnly &&
            (ownerOverride || !this.client.isOwner(message.author))
        ) {
            return `The \`${this.name}\` command can only be used by the bot owner.`
        }

        if (message.channel.type === 'text' && this.userPermissions) {
            const missing = message.channel
                .permissionsFor(message.author)
                .missing(this.userPermissions)

            if (missing.length > 0) {
                if (missing.length === 1) {
                    return `The \`${this.name}\` 
                    command requires you to have the
                    "${permissions[missing[0]]}"
                    permission.`
                }
                return oneLine`
                    The \`${this.name}\`
                    command requires you to have the following permissions:
                    ${missing.map((perm) => permissions[perm]).join(', ')}
                `
            }
        }

        return true
    }

    async run(
        message: CommandoMessage,
        args?: Object | string | string[],
        fromPattern?: boolean,
        result?: ArgumentCollectorResult
    ): Promise<Message | void> {
        throw new Error(`${this.constructor.name} doesn't have a run() method.`)
    }

    onBlock(
        message: CommandoMessage,
        reason: string,
        data: any
    ): Promise<Message> | null {
        switch (reason) {
            case 'guildOnly':
                return message.reply(
                    `The \`${this.name}\` command must be used in a server channel.`
                )
            case 'nsfw':
                return message.reply(
                    `The \`${this.name}\` command can only be used in NSFW channels.`
                )
            case 'permission': {
                if (data.response) return message.reply(data.response)
                return message.reply(
                    `You do not have permission to use the \`${this.name}\` command.`
                )
            }
            case 'clientPermissions': {
                if (data.missing.length === 1) {
                    return message.reply(
                        `I need the "${
                            permissions[data.missing[0]]
                        }" permission for the \`${this.name}\` command to work.`
                    )
                }
                return message.reply(oneLine`
                    I need the following permissions for the \`${
                        this.name
                    }\` command to work:
                    ${data.missing
                        .map((perm: any) => permissions[perm])
                        .join(', ')}
                `)
            }
            case 'throttling': {
                return message.reply(
                    `You may not use the \`${
                        this.name
                    }\` command again for another ${data.remaining.toFixed(
                        1
                    )} seconds.`
                )
            }
            default:
                return null
        }
    }

    private throttle(userID: string): Object | null {
        if (!this.throttling || this.client.isOwner(userID)) return null

        let throttle = this._throttles.get(userID)
        if (!throttle) {
            throttle = {
                start: Date.now(),
                usages: 0,
                timeout: this.client.setTimeout(() => {
                    this._throttles.delete(userID)
                }, this.throttling.duration * 1000)
            }
            this._throttles.set(userID, throttle)
        }

        return throttle
    }

    static validateInfo(client: Client, info: CommandInfo): void {
        // eslint-disable-line complexity
        if (!client) throw new Error('A client must be specified.')
        if (typeof info !== 'object')
            throw new TypeError('Command info must be an Object.')
        if (typeof info.name !== 'string')
            throw new TypeError('Command name must be a string.')
        if (info.name !== info.name.toLowerCase())
            throw new Error('Command name must be lowercase.')
        if (
            info.aliases &&
            (!Array.isArray(info.aliases) ||
                info.aliases.some((ali) => typeof ali !== 'string'))
        ) {
            throw new TypeError('Command aliases must be an Array of strings.')
        }
        if (
            info.aliases &&
            info.aliases.some((ali) => ali !== ali.toLowerCase())
        ) {
            throw new RangeError('Command aliases must be lowercase.')
        }
        if (typeof info.group !== 'string')
            throw new TypeError('Command group must be a string.')
        if (info.group !== info.group.toLowerCase())
            throw new RangeError('Command group must be lowercase.')
        if (typeof info.memberName !== 'string')
            throw new TypeError('Command memberName must be a string.')
        if (info.memberName !== info.memberName.toLowerCase())
            throw new Error('Command memberName must be lowercase.')
        if (typeof info.description !== 'string')
            throw new TypeError('Command description must be a string.')
        if ('format' in info && typeof info.format !== 'string')
            throw new TypeError('Command format must be a string.')
        if ('details' in info && typeof info.details !== 'string')
            throw new TypeError('Command details must be a string.')
        if (
            info.examples &&
            (!Array.isArray(info.examples) ||
                info.examples.some((ex) => typeof ex !== 'string'))
        ) {
            throw new TypeError('Command examples must be an Array of strings.')
        }
        if (info.clientPermissions) {
            if (!Array.isArray(info.clientPermissions)) {
                throw new TypeError(
                    'Command clientPermissions must be an Array of permission key strings.'
                )
            }
            for (const perm of info.clientPermissions) {
                if (!permissions[perm as string])
                    throw new RangeError(
                        `Invalid command clientPermission: ${perm}`
                    )
            }
        }
        if (info.userPermissions) {
            if (!Array.isArray(info.userPermissions)) {
                throw new TypeError(
                    'Command userPermissions must be an Array of permission key strings.'
                )
            }
            for (const perm of info.userPermissions) {
                if (!permissions[perm as string])
                    throw new RangeError(
                        `Invalid command userPermission: ${perm}`
                    )
            }
        }
        if (info.throttling) {
            if (typeof info.throttling !== 'object')
                throw new TypeError('Command throttling must be an Object.')
            if (
                typeof info.throttling.usages !== 'number' ||
                isNaN(info.throttling.usages)
            ) {
                throw new TypeError(
                    'Command throttling usages must be a number.'
                )
            }
            if (info.throttling.usages < 1)
                throw new RangeError(
                    'Command throttling usages must be at least 1.'
                )
            if (
                typeof info.throttling.duration !== 'number' ||
                isNaN(info.throttling.duration)
            ) {
                throw new TypeError(
                    'Command throttling duration must be a number.'
                )
            }
            if (info.throttling.duration < 1)
                throw new RangeError(
                    'Command throttling duration must be at least 1.'
                )
        }
        if (info.args && !Array.isArray(info.args))
            throw new TypeError('Command args must be an Array.')
        if (
            info.argsPromptLimit !== undefined &&
            typeof info.argsPromptLimit !== 'number'
        ) {
            throw new TypeError('Command argsPromptLimit must be a number.')
        }
        if (info.argsPromptLimit !== undefined && info.argsPromptLimit < 0) {
            throw new RangeError('Command argsPromptLimit must be at least 0.')
        }
        if (info.argsType && !['single', 'multiple'].includes(info.argsType)) {
            throw new RangeError(
                'Command argsType must be one of "single" or "multiple".'
            )
        }
        if (
            info.argsType === 'multiple' &&
            info.argsCount &&
            info.argsCount < 2
        ) {
            throw new RangeError('Command argsCount must be at least 2.')
        }
        if (
            info.patterns &&
            (!Array.isArray(info.patterns) ||
                info.patterns.some((pat: any) => !(pat instanceof RegExp)))
        ) {
            throw new TypeError(
                'Command patterns must be an Array of regular expressions.'
            )
        }
    }
}

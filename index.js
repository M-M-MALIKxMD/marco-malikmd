require('dotenv').config()
const {
    makeWASocket,
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
} = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const pino = require('pino')
const qrcode = require('qrcode-terminal')
const fs = require('fs')
const chalk = require('chalk')
const { serialize } = require('./lib/serialize')
const { loadCommands, getCommand } = require('./lib/loader')
const { formatUptime, isOwner, pickRandom, reactEmojis } = require('./lib/functions')
const config = require('./config')
const path = require('path')

const COMMANDS_DIR = path.join(__dirname, 'commands')

global.sock = null
global.store = {
    antiDelete: new Map(),
    antiLink: new Map(),
    autoReactGroups: new Set(),
    bannedUsers: new Set()
}

// ════════════════════════════════════════════
//   SESSION ID RESTORE — Section ID سے session
// ════════════════════════════════════════════
function restoreSession() {
    const sessionId = config.sessionId
    if (!sessionId) return false

    try {
        if (!fs.existsSync(config.authDir)) {
            fs.mkdirSync(config.authDir, { recursive: true })
        }

        const credsPath = path.join(config.authDir, 'creds.json')

        if (fs.existsSync(credsPath)) {
            console.log(chalk.green('✅ Session already exists — skipping restore'))
            return true
        }

        // Base64 encoded session
        if (sessionId.length > 100) {
            try {
                const decoded = Buffer.from(sessionId, 'base64').toString('utf-8')
                const parsed = JSON.parse(decoded)
                fs.writeFileSync(credsPath, JSON.stringify(parsed, null, 2))
                console.log(chalk.green('✅ Session restored from SESSION_ID (base64)'))
                return true
            } catch (_) {}
        }

        // Plain JSON session
        try {
            const parsed = JSON.parse(sessionId)
            fs.writeFileSync(credsPath, JSON.stringify(parsed, null, 2))
            console.log(chalk.green('✅ Session restored from SESSION_ID (JSON)'))
            return true
        } catch (_) {}

        // Short key format (like MARCO_MALIK_&_SYED-MD~)
        // Write as session identifier — pairing will still proceed
        console.log(chalk.yellow(`🔑 SESSION_ID found: ${sessionId}`))
        console.log(chalk.yellow('📱 Proceeding with QR pairing...'))
        return false

    } catch (err) {
        console.log(chalk.red('⚠️ Session restore error:'), err.message)
        return false
    }
}

function printBanner() {
    console.log(chalk.cyan('\n╭───────────────────────────────────────────╮'))
    console.log(chalk.cyan('│') + chalk.yellow('   ✨  MARCO MALIK MD BOT v5.0  ✨         ') + chalk.cyan('│'))
    console.log(chalk.cyan('│') + chalk.green('   👑  Powered by Marco Malik               ') + chalk.cyan('│'))
    console.log(chalk.cyan('╰───────────────────────────────────────────╯'))
    console.log(chalk.green(`  Owner   : ${config.ownerName}`))
    console.log(chalk.green(`  Prefix  : ${config.prefix}`))
    console.log(chalk.green(`  Mode    : ${config.mode}`))
    console.log(chalk.green(`  Session : ${config.sessionId ? '✅ Found' : '❌ Not Set (QR Mode)'}`))
    console.log(chalk.cyan('─────────────────────────────────────────────\n'))
}

async function startBot() {
    printBanner()
    loadCommands(COMMANDS_DIR)
    restoreSession()

    const { state, saveCreds } = await useMultiFileAuthState(config.authDir)
    const { version } = await fetchLatestBaileysVersion()
    const logger = pino({ level: 'silent' })

    const sock = makeWASocket({
        version,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger)
        },
        logger,
        printQRInTerminal: false,
        browser: ['Marco Malik MD Bot', 'Chrome', '120.0.0'],
        syncFullHistory: false,
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true
    })

    global.sock = sock

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
        if (qr) {
            console.log(chalk.yellow('\n📱 Scan this QR code with WhatsApp:\n'))
            qrcode.generate(qr, { small: true })
            console.log(chalk.cyan('\nOR use Pairing Code from your pairing website'))
            console.log(chalk.cyan(`SESSION_ID: ${config.sessionId || 'Not Set'}\n`))
        }
        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode
            console.log(chalk.red(`\n❌ Disconnected. Code: ${reason}`))
            if (reason === DisconnectReason.loggedOut) {
                console.log(chalk.red('🔒 Logged out — Deleting session...'))
                fs.rmSync(config.authDir, { recursive: true, force: true })
            }
            console.log(chalk.yellow('🔄 Reconnecting in 3 seconds...'))
            setTimeout(() => startBot(), 3000)
        }
        if (connection === 'open') {
            console.log(chalk.green('\n✅ Marco Malik MD Bot Connected Successfully!\n'))
            console.log(chalk.yellow('  👑 Powered by Marco Malik'))
            console.log(chalk.cyan('─────────────────────────────────────────────\n'))
        }
    })

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return
        for (const raw of messages) {
            try {
                if (!raw.message) continue

                const m = serialize(raw, sock)
                if (!m) continue
                if (m.fromMe) continue
                if (global.store.bannedUsers.has(m.sender)) continue

                if (config.autoRead) {
                    await sock.readMessages([raw.key]).catch(() => {})
                }

                if (config.autoReact && m.isGroup) {
                    const emoji = pickRandom(reactEmojis)
                    await sock.sendMessage(m.from, { react: { text: emoji, key: raw.key } }).catch(() => {})
                }

                if (config.autoRecord && m.isGroup) {
                    await sock.sendPresenceUpdate('recording', m.from).catch(() => {})
                }

                if (config.antiDelete && m.isGroup) {
                    global.store.antiDelete.set(m.id, { msg: raw, from: m.from })
                }

                if (m.isCmd) {
                    const cmd = getCommand(m.command)
                    if (!cmd) return

                    if (cmd.ownerOnly && !isOwner(m.sender)) {
                        return m.reply('❌ This command is for *Owner Only*!')
                    }
                    if (cmd.groupOnly && !m.isGroup) {
                        return m.reply('❌ This command can only be used in *Groups*!')
                    }
                    if (cmd.privateOnly && m.isGroup) {
                        return m.reply('❌ This command can only be used in *Private Chat*!')
                    }

                    console.log(
                        chalk.blue(`[${new Date().toLocaleTimeString()}]`) + ' ' +
                        chalk.yellow(`${m.prefix}${m.command}`) + ' from ' +
                        chalk.green(m.pushName || m.sender)
                    )

                    await cmd.run({ sock, m, config, raw })
                }

                await handlePlugins(sock, m, raw)

            } catch (err) {
                console.error(chalk.red('Message error:'), err.message)
            }
        }
    })

    sock.ev.on('messages.delete', async ({ keys }) => {
        if (!config.antiDelete) return
        for (const key of keys) {
            const stored = global.store.antiDelete.get(key.id)
            if (!stored) continue
            const { msg, from } = stored
            const m2 = serialize(msg, sock)
            if (!m2?.body) continue
            try {
                await sock.sendMessage(from, {
                    text: `🚫 *Anti-Delete*\n\n👤 *From:* ${m2.pushName}\n💬 *Message:* ${m2.body}`
                })
            } catch (_) {}
        }
    })

    sock.ev.on('call', async (calls) => {
        if (!config.antiCall) return
        for (const call of calls) {
            if (call.status === 'offer') {
                await sock.rejectCall(call.id, call.from).catch(() => {})
                await sock.sendMessage(call.from, {
                    text: `❌ *Auto Anti-Call*\nCalls are not accepted.\nType *${config.prefix}help* for commands.`
                }).catch(() => {})
            }
        }
    })

    sock.ev.on('messages.upsert', async ({ messages }) => {
        for (const msg of messages) {
            if (!msg.key?.remoteJid?.includes('status') || !config.autoStatusRead) continue
            await sock.readMessages([msg.key]).catch(() => {})
        }
    })

    return sock
}

process.on('uncaughtException', err => {
    console.error(chalk.red('Uncaught Exception:'), err.message)
})

process.on('unhandledRejection', err => {
    console.error(chalk.red('Unhandled Rejection:'), err?.message || err)
})

async function handlePlugins(sock, m, raw) {
    if (!m.body) return
    const body = m.body.toLowerCase()

    if (config.antiLink && m.isGroup) {
        const linkRegex = /(https?:\/\/[^\s]+|wa\.me\/[^\s]+|whatsapp\.com\/[^\s]+)/gi
        if (linkRegex.test(m.body)) {
            try {
                await sock.sendMessage(m.from, { delete: raw.key })
                await sock.sendMessage(m.from, {
                    text: `⚠️ @${m.sender.split('@')[0]} Links are not allowed in this group!`,
                    mentions: [m.sender]
                })
            } catch (_) {}
        }
    }

    const autoReplies = {
        'hi': `Hi ${m.pushName}! 👋\nType *${config.prefix}help* for commands.`,
        'hello': `Hello ${m.pushName}! 😊\nType *${config.prefix}help* for commands.`,
        'helo': `Hello ${m.pushName}! 😊`,
        'salam': `Wa Alaikum Salam ${m.pushName}! 🌹`,
        'assalam': `Wa Alaikum Salam ${m.pushName}! 🌹`,
        'assalamu alaikum': `Wa Alaikum Salam ${m.pushName}! 🕌`,
    }

    if (!m.isCmd) {
        for (const [trigger, reply] of Object.entries(autoReplies)) {
            if (body === trigger || body === trigger + '!') {
                await sock.sendMessage(m.from, { text: reply }, { quoted: raw }).catch(() => {})
                break
            }
        }
    }
}

startBot().catch(err => {
    console.error(chalk.red('Fatal error:'), err)
    process.exit(1)
})

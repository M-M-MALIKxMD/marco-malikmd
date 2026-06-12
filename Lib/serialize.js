const { getContentType, jidNormalizedUser } = require('@whiskeysockets/baileys')

function serialize(msg, sock) {
    if (!msg) return msg

    const m = {}
    m.key = msg.key
    m.from = msg.key.remoteJid
    m.fromMe = msg.key.fromMe
    m.id = msg.key.id
    m.isGroup = m.from?.endsWith('@g.us')
    m.sender = m.isGroup
        ? (msg.key.participant || msg.participant || '')
        : (m.fromMe ? sock.user?.id?.split(':')[0] + '@s.whatsapp.net' : m.from)
    m.pushName = msg.pushName || 'User'

    const content = msg.message
    m.type = getContentType(content)
    m.message = content

    const body =
        content?.conversation ||
        content?.extendedTextMessage?.text ||
        content?.imageMessage?.caption ||
        content?.videoMessage?.caption ||
        content?.buttonsResponseMessage?.selectedButtonId ||
        content?.listResponseMessage?.singleSelectReply?.selectedRowId ||
        content?.templateButtonReplyMessage?.selectedId ||
        ''

    m.body = body
    m.text = body

    const prefix = require('../config').prefix
    m.prefix = prefix
    m.isCmd = body.startsWith(prefix)

    const args = body.slice(prefix.length).trim().split(/\s+/)
    m.command = m.isCmd ? args[0].toLowerCase() : ''
    m.args = args.slice(1)
    m.q = m.args.join(' ')

    m.quoted = null
    const contextInfo = content?.extendedTextMessage?.contextInfo ||
        content?.imageMessage?.contextInfo ||
        content?.videoMessage?.contextInfo

    if (contextInfo?.quotedMessage) {
        m.quoted = {
            key: {
                remoteJid: m.from,
                fromMe: contextInfo.participant === sock.user?.id?.split(':')[0] + '@s.whatsapp.net',
                id: contextInfo.stanzaId,
                participant: contextInfo.participant
            },
            message: contextInfo.quotedMessage,
            type: getContentType(contextInfo.quotedMessage),
            sender: contextInfo.participant
        }
    }

    m.reply = (text, options = {}) => sock.sendMessage(m.from, { text }, { quoted: msg, ...options })
    m.react = (emoji) => sock.sendMessage(m.from, { react: { text: emoji, key: msg.key } })

    return m
}

module.exports = { serialize }

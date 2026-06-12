const { downloadMediaMessage } = require('@whiskeysockets/baileys')
const sharp = require('sharp')
const { tmpFile, cleanTmp } = require('../../lib/functions')
const fs = require('fs')

module.exports = {
    name: 'toimg',
    aliases: ['toimage', 'stickertoimg', 'webp2img'],
    description: 'Convert sticker to image',
    category: 'sticker',
    async run({ sock, m, raw }) {
        const ctx = m.message?.extendedTextMessage?.contextInfo
        const stickerMsg = m.message?.stickerMessage || ctx?.quotedMessage?.stickerMessage

        if (!stickerMsg) {
            return m.reply(`📦 *Sticker to Image*\n\nReply to a sticker with *${m.prefix}toimg*\n\n_Marco Malik MD Bot 👑_`)
        }

        await m.react('🔄')

        const msgToDownload = { key: m.key, message: { stickerMessage: stickerMsg } }
        const buffer = await downloadMediaMessage(msgToDownload, 'buffer', {},
            { logger: { info: () => {}, error: () => {}, warn: () => {} }, reuploadRequest: sock.updateMediaMessage })

        const outPath = tmpFile('png')
        await sharp(buffer).png().toFile(outPath)

        await sock.sendMessage(m.from, {
            image: fs.readFileSync(outPath),
            caption: `✅ *Sticker converted to Image!*\n\n_Marco Malik MD Bot 👑_`
        }, { quoted: { key: m.key, message: m.message } })

        cleanTmp(outPath)
        await m.react('✅')
    }
}

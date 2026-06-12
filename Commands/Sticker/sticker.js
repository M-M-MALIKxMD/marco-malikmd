const { downloadMediaMessage } = require('@whiskeysockets/baileys')
const sharp = require('sharp')
const ffmpeg = require('fluent-ffmpeg')
const ffmpegStatic = require('ffmpeg-static')
const fs = require('fs')
const { tmpFile, cleanTmp } = require('../../lib/functions')

ffmpeg.setFfmpegPath(ffmpegStatic)

async function imageToSticker(buffer) {
    const out = tmpFile('webp')
    await sharp(buffer).resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .webp({ quality: 80 }).toFile(out)
    return out
}

module.exports = {
    name: 'sticker',
    aliases: ['s', 'stiker', 'stkr'],
    description: 'Create sticker from image',
    category: 'sticker',
    async run({ sock, m, raw }) {
        const ctx = m.message?.extendedTextMessage?.contextInfo
        const imgMsg = m.message?.imageMessage || ctx?.quotedMessage?.imageMessage
        const vidMsg = m.message?.videoMessage || ctx?.quotedMessage?.videoMessage

        if (!imgMsg && !vidMsg) {
            return m.reply(`🖼️ *Sticker Maker*\n\nSend an image + *${m.prefix}sticker*\nOR reply to any image with *${m.prefix}sticker*\n\n_Marco Malik MD Bot 👑_`)
        }

        await m.react('🎨')
        await m.reply('🎨 *Creating sticker...*')

        const msgToDownload = imgMsg
            ? { key: m.key, message: { imageMessage: imgMsg } }
            : { key: m.key, message: { videoMessage: vidMsg } }

        const buffer = await downloadMediaMessage(msgToDownload, 'buffer', {},
            { logger: { info: () => {}, error: () => {}, warn: () => {} }, reuploadRequest: sock.updateMediaMessage })

        let outPath
        if (imgMsg) {
            outPath = await imageToSticker(buffer)
        } else {
            const inPath = tmpFile('mp4')
            outPath = tmpFile('webp')
            fs.writeFileSync(inPath, buffer)
            await new Promise((resolve, reject) => {
                ffmpeg(inPath).outputOptions(['-vf', 'scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000', '-loop', '0', '-t', '3', '-an', '-vsync', '0'])
                    .toFormat('webp').on('end', resolve).on('error', reject).save(outPath)
            })
            cleanTmp(inPath)
        }

        await sock.sendMessage(m.from, { sticker: fs.readFileSync(outPath) }, { quoted: { key: m.key, message: m.message } })
        cleanTmp(outPath)
        await m.react('✅')
    }
}

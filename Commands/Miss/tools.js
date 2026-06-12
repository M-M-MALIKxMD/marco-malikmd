const axios = require('axios')
const { downloadMediaMessage } = require('@whiskeysockets/baileys')
const cheerio = require('cheerio')
const config = require('../../config')

module.exports = {
    name: 'tts',
    aliases: ['translate', 'viewonce', 'sourcecode', 'qr', 'shorturl', 'carbon', 'totext', 'password', 'alive'],
    description: 'Utility tools',
    category: 'misc',
    async run({ sock, m, raw }) {
        const cmd = m.command
        const q = m.q

        if (cmd === 'tts') {
            if (!q) return m.reply(`🔊 *Text to Speech*\n\n*Usage:* ${m.prefix}tts <text>\n\n*Example:* ${m.prefix}tts Hello Marco Malik`)
            const lang = 'ur'
            const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(q)}&tl=${lang}&client=tw-ob`
            const res = await axios.get(url, { responseType: 'arraybuffer', headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 10000 })
            await sock.sendMessage(m.from, {
                audio: Buffer.from(res.data),
                mimetype: 'audio/mp4',
                ptt: true
            }, { quoted: { key: m.key, message: m.message } })
            await m.react('🔊')
        }

        else if (cmd === 'translate') {
            if (!q) return m.reply(`🌐 *Translate*\n\n*Usage:* ${m.prefix}translate en|ur <text>\n\n*Example:* ${m.prefix}translate ur|en Salam`)
            const parts = q.split('|')
            const text = parts.length >= 2 ? parts.slice(1).join('|') : q
            const toLang = parts.length >= 2 ? parts[0].toLowerCase() : 'en'

            const res = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|${toLang}`, { timeout: 10000 })
            const translated = res.data?.responseData?.translatedText
            if (!translated) return m.reply('❌ Translation failed.')
            await m.reply(`🌐 *Translation:*\n\n📝 *Original:* ${text}\n✅ *Translated:* ${translated}\n\n_Marco Malik MD Bot 👑_`)
        }

        else if (cmd === 'sourcecode' || cmd === 'viewsource') {
            if (!q || !q.startsWith('http')) return m.reply(`💻 *Source Code Viewer*\n\n*Usage:* ${m.prefix}sourcecode <URL>\n\n*Example:* ${m.prefix}sourcecode https://google.com`)
            const res = await axios.get(q.split(' ')[0], { timeout: 15000, headers: { 'User-Agent': 'Mozilla/5.0' } })
            const html = res.data.slice(0, 3000)
            await m.reply(`💻 *Source Code of:* ${q}\n\n\`\`\`\n${html}\n\`\`\`\n\n_Marco Malik MD Bot 👑_`)
        }

        else if (cmd === 'qr') {
            if (!q) return m.reply(`📱 *QR Generator*\n\n*Usage:* ${m.prefix}qr <text or URL>`)
            const url = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(q)}`
            const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 10000 })
            await sock.sendMessage(m.from, {
                image: Buffer.from(res.data),
                caption: `📱 *QR Code Generated!*\n📝 *Data:* ${q}\n\n_Marco Malik MD Bot 👑_`
            }, { quoted: { key: m.key, message: m.message } })
        }

        else if (cmd === 'shorturl') {
            if (!q || !q.startsWith('http')) return m.reply(`🔗 *URL Shortener*\n\n*Usage:* ${m.prefix}shorturl <URL>`)
            const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(q)}`, { timeout: 10000 })
            await m.reply(`🔗 *Shortened URL:*\n\n📎 ${res.data}\n\n_Marco Malik MD Bot 👑_`)
        }

        else if (cmd === 'password') {
            const len = parseInt(q) || 12
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
            const pass = Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
            await m.reply(`🔐 *Random Password:*\n\n\`${pass}\`\n\n*Length:* ${len} characters\n\n⚠️ Keep it safe!\n\n_Marco Malik MD Bot 👑_`)
        }

        else if (cmd === 'viewonce') {
            const ctx = m.message?.extendedTextMessage?.contextInfo
            const voMsg = ctx?.quotedMessage?.viewOnceMessageV2?.message || ctx?.quotedMessage?.viewOnceMessage?.message
            if (!voMsg) return m.reply(`👁️ *View Once*\n\nReply to a view-once message with *${m.prefix}viewonce*`)
            const imgMsg = voMsg.imageMessage
            const vidMsg = voMsg.videoMessage
            if (!imgMsg && !vidMsg) return m.reply('❌ Not a view-once media message.')

            const toDownload = imgMsg ? { ...raw, message: { imageMessage: imgMsg } } : { ...raw, message: { videoMessage: vidMsg } }
            const buffer = await downloadMediaMessage(toDownload, 'buffer', {},
                { logger: { info: () => {}, error: () => {}, warn: () => {} }, reuploadRequest: sock.updateMediaMessage })

            if (imgMsg) {
                await sock.sendMessage(m.from, { image: buffer, caption: '👁️ *View Once Image* revealed!\n\n_Marco Malik MD Bot 👑_' }, { quoted: { key: m.key, message: m.message } })
            } else {
                await sock.sendMessage(m.from, { video: buffer, mimetype: 'video/mp4', caption: '👁️ *View Once Video* revealed!\n\n_Marco Malik MD Bot 👑_' }, { quoted: { key: m.key, message: m.message } })
            }
        }

        else if (cmd === 'alive') {
            const { formatUptime } = require('../../lib/functions')
            await sock.sendMessage(m.from, {
                text: `╭───────────────⭓\n│ ✨ MARCO MALIK MD BOT ✨\n╰───────────────⭓\n\n✅ *Bot is Alive!*\n⏱️ *Uptime:* ${formatUptime(process.uptime())}\n🔥 *Version:* ${config.version}\n👑 *Owner:* ${config.ownerName}\n⚡ *Status:* Online 24/7\n\n_Powered by Marco Malik 👑_`
            }, { quoted: { key: m.key, message: m.message } })
        }
    }
}

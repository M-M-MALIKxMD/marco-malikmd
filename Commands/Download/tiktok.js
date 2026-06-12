const axios = require('axios')
const { tmpFile, cleanTmp } = require('../../lib/functions')
const fs = require('fs')

async function downloadTikTok(url) {
    const api = `https://tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`
    const res = await axios.get(api, { timeout: 20000 })
    if (!res.data || res.data.code !== 0) throw new Error('Failed to fetch TikTok data')
    return res.data.data
}

module.exports = {
    name: 'tiktok',
    aliases: ['tt', 'ttdl', 'tiktokdl'],
    description: 'Download TikTok video (no watermark)',
    category: 'download',
    async run({ sock, m }) {
        const url = m.q
        if (!url || !url.includes('tiktok')) {
            return m.reply(`🎵 *TikTok Downloader*\n\n*Usage:* ${m.prefix}tiktok <TikTok URL>\n\n*Example:*\n• ${m.prefix}tiktok https://vm.tiktok.com/xxxxx\n• ${m.prefix}tt https://www.tiktok.com/@user/video/xxx`)
        }

        await m.react('⬇️')
        await m.reply('⬇️ *Downloading TikTok video...*\nPlease wait...')

        const data = await downloadTikTok(url.split(' ')[0])

        const videoUrl = data.play || data.wmplay
        const audioUrl = data.music

        const res = await axios.get(videoUrl, { responseType: 'arraybuffer', timeout: 30000 })

        await sock.sendMessage(m.from, {
            video: Buffer.from(res.data),
            mimetype: 'video/mp4',
            caption: `✅ *TikTok Video*\n👤 *Creator:* ${data.author?.nickname || 'Unknown'}\n❤️ *Likes:* ${data.digg_count || 0}\n💬 *Title:* ${(data.title || '').slice(0, 100)}\n\n_Downloaded by Marco Malik MD Bot 👑_`
        }, { quoted: { key: m.key, message: m.message } })

        await m.react('✅')
    }
}

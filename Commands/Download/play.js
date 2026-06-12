const ytdl = require('@distube/ytdl-core')
const yts = require('yt-search')
const ffmpeg = require('fluent-ffmpeg')
const ffmpegStatic = require('ffmpeg-static')
const fs = require('fs')
const { tmpFile, cleanTmp } = require('../../lib/functions')
const config = require('../../config')

ffmpeg.setFfmpegPath(ffmpegStatic)

module.exports = {
    name: 'play',
    aliases: ['song', 'music', 'audio', 'mp3', 'yta', 'ytaudio'],
    description: 'Download song from YouTube',
    category: 'download',
    async run({ sock, m }) {
        const query = m.q
        if (!query) return m.reply(`🎵 *Song Download*\n\n*Usage:* ${m.prefix}play <song name>\n\n*Examples:*\n• ${m.prefix}play Tum Hi Ho\n• ${m.prefix}play Shape of You\n• ${m.prefix}play Kesariya`)

        await m.react('🔍')
        await m.reply(`🔍 Searching: *${query}*...`)

        const result = await yts(query)
        const video = result.videos[0]
        if (!video) return m.reply('❌ Song not found! Try a different name.')

        if (video.seconds > 600) return m.reply(`⚠️ Song too long (${video.timestamp}). Max 10 minutes.`)

        await m.react('⬇️')
        await sock.sendMessage(m.from, {
            text: `🎵 *Found:* ${video.title}\n👤 *Artist:* ${video.author.name}\n⏱️ *Duration:* ${video.timestamp}\n\n⬇️ *Downloading...*`
        }, { quoted: { key: m.key, message: m.message } })

        const out = tmpFile('mp3')
        await new Promise((resolve, reject) => {
            const stream = ytdl(video.url, { quality: 'highestaudio', filter: 'audioonly' })
            ffmpeg(stream).audioCodec('libmp3lame').audioBitrate(128).format('mp3')
                .on('end', resolve).on('error', reject).save(out)
        })

        await sock.sendMessage(m.from, {
            audio: fs.readFileSync(out),
            mimetype: 'audio/mp4',
            ptt: false
        }, { quoted: { key: m.key, message: m.message } })

        await sock.sendMessage(m.from, {
            text: `✅ *${video.title}*\n👤 ${video.author.name} | ⏱️ ${video.timestamp}\n\n_Downloaded by Marco Malik MD Bot 👑_`
        })

        cleanTmp(out)
        await m.react('✅')
    }
}

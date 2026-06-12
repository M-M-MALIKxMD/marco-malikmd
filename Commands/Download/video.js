const ytdl = require('@distube/ytdl-core')
const yts = require('yt-search')
const ffmpeg = require('fluent-ffmpeg')
const ffmpegStatic = require('ffmpeg-static')
const fs = require('fs')
const { tmpFile, cleanTmp } = require('../../lib/functions')

ffmpeg.setFfmpegPath(ffmpegStatic)

module.exports = {
    name: 'video',
    aliases: ['vid', 'ytv', 'ytvideo', 'youtube', 'yt'],
    description: 'Download video from YouTube',
    category: 'download',
    async run({ sock, m }) {
        const query = m.q
        if (!query) return m.reply(`🎬 *Video Download*\n\n*Usage:* ${m.prefix}video <name or URL>\n\n*Examples:*\n• ${m.prefix}video Tum Hi Ho official\n• ${m.prefix}video funny cat video\n• ${m.prefix}yt https://youtube.com/watch?v=xxx`)

        await m.react('🔍')
        await m.reply(`🔍 Searching: *${query}*...`)

        let video
        try {
            if (query.includes('youtube.com') || query.includes('youtu.be')) {
                const info = await ytdl.getInfo(query)
                const d = info.videoDetails
                video = { url: query, title: d.title, author: { name: d.author.name }, timestamp: `${Math.floor(+d.lengthSeconds/60)}:${String(+d.lengthSeconds%60).padStart(2,'0')}`, seconds: +d.lengthSeconds }
            } else {
                const r = await yts(query)
                video = r.videos[0]
            }
        } catch { return m.reply('❌ Could not find video. Please try again.') }

        if (!video) return m.reply('❌ Video not found!')
        if (video.seconds > 300) return m.reply(`⚠️ Video too long (*${video.timestamp}*). Max 5 minutes.\n\nUse *${m.prefix}play* for audio only.`)

        await m.react('⬇️')
        await sock.sendMessage(m.from, {
            text: `🎬 *Found:* ${video.title}\n📺 *Channel:* ${video.author.name}\n⏱️ *Duration:* ${video.timestamp}\n\n⬇️ *Downloading & Processing...*`
        }, { quoted: { key: m.key, message: m.message } })

        const tmp = tmpFile('mp4')
        const out = tmpFile('mp4')

        await new Promise((resolve, reject) => {
            ytdl(video.url, { quality: 'highest', filter: f => f.container === 'mp4' && f.hasAudio && f.hasVideo })
                .pipe(fs.createWriteStream(tmp)).on('finish', resolve).on('error', reject)
        })

        await new Promise((resolve, reject) => {
            ffmpeg(tmp).videoCodec('libx264').audioCodec('aac').size('854x480')
                .videoBitrate('800k').audioBitrate('128k').format('mp4')
                .outputOptions(['-movflags faststart', '-preset fast'])
                .on('end', resolve).on('error', reject).save(out)
        })

        await sock.sendMessage(m.from, {
            video: fs.readFileSync(out),
            mimetype: 'video/mp4',
            caption: `🎬 *${video.title}*\n📺 ${video.author.name} | ⏱️ ${video.timestamp}\n\n_Downloaded by Marco Malik MD Bot 👑_`
        }, { quoted: { key: m.key, message: m.message } })

        cleanTmp(tmp)
        cleanTmp(out)
        await m.react('✅')
    }
}

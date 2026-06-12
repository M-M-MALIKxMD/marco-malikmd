const ytdl = require('@distube/ytdl-core')
const ffmpeg = require('fluent-ffmpeg')
const ffmpegStatic = require('ffmpeg-static')
const fs = require('fs')
const { tmpFile, cleanTmp } = require('../../lib/functions')

ffmpeg.setFfmpegPath(ffmpegStatic)

function isYtUrl(url) {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(url)
}

module.exports = {
    name: 'yt',
    aliases: ['yta', 'ytaudio', 'yturl'],
    description: 'Download audio from YouTube URL',
    category: 'download',
    async run({ sock, m }) {
        const url = m.q?.split(' ')[0]
        if (!url || !isYtUrl(url)) {
            return m.reply(`📺 *YouTube Audio Downloader*\n\n*Usage:* ${m.prefix}yt <YouTube URL>\n\n*Example:*\n• ${m.prefix}yt https://youtube.com/watch?v=xxx\n• ${m.prefix}yt https://youtu.be/xxx\n\n_For search by name, use:_ *${m.prefix}play <name>*`)
        }

        await m.react('⬇️')

        let info
        try { info = await ytdl.getInfo(url) } catch { return m.reply('❌ Invalid or unavailable YouTube URL.') }

        const d = info.videoDetails
        const dur = parseInt(d.lengthSeconds)
        if (dur > 600) return m.reply(`⚠️ Too long (${Math.floor(dur / 60)}min). Max 10 minutes allowed.`)

        await m.reply(`🎵 *${d.title}*\n👤 ${d.author.name}\n⏱️ ${Math.floor(dur / 60)}:${String(dur % 60).padStart(2, '0')}\n\n⬇️ *Downloading audio...*`)

        const out = tmpFile('mp3')
        await new Promise((resolve, reject) => {
            const stream = ytdl(url, { quality: 'highestaudio', filter: 'audioonly' })
            ffmpeg(stream).audioCodec('libmp3lame').audioBitrate(128).format('mp3')
                .on('end', resolve).on('error', reject).save(out)
        })

        await sock.sendMessage(m.from, {
            audio: fs.readFileSync(out),
            mimetype: 'audio/mp4',
            ptt: false
        }, { quoted: { key: m.key, message: m.message } })

        cleanTmp(out)
        await m.react('✅')
    }
}

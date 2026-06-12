const axios = require('axios')

async function getFbVideo(url) {
    const apiUrl = `https://apis-prabhat.vercel.app/fbdl?url=${encodeURIComponent(url)}`
    try {
        const res = await axios.get(apiUrl, { timeout: 20000 })
        return res.data
    } catch {
        const api2 = `https://api.lolhuman.xyz/api/fbdl?apikey=lolhuman&url=${encodeURIComponent(url)}`
        const res2 = await axios.get(api2, { timeout: 20000 })
        return res2.data
    }
}

module.exports = {
    name: 'fb',
    aliases: ['facebook', 'fbdl', 'fbvideo'],
    description: 'Download Facebook video',
    category: 'download',
    async run({ sock, m }) {
        const url = m.q
        if (!url || (!url.includes('facebook.com') && !url.includes('fb.watch'))) {
            return m.reply(`📘 *Facebook Video Downloader*\n\n*Usage:* ${m.prefix}fb <Facebook video URL>\n\n*Example:*\n• ${m.prefix}fb https://www.facebook.com/watch?v=xxx\n• ${m.prefix}fb https://fb.watch/xxxxx`)
        }

        await m.react('⬇️')
        await m.reply('⬇️ *Downloading Facebook video...*\nPlease wait...')

        try {
            const data = await getFbVideo(url.split(' ')[0])
            const videoUrl = data?.result?.hd || data?.result?.sd || data?.hd || data?.sd
            if (!videoUrl) throw new Error('No video URL found')

            const res = await axios.get(videoUrl, { responseType: 'arraybuffer', timeout: 60000 })

            await sock.sendMessage(m.from, {
                video: Buffer.from(res.data),
                mimetype: 'video/mp4',
                caption: `✅ *Facebook Video Downloaded*\n\n_Downloaded by Marco Malik MD Bot 👑_`
            }, { quoted: { key: m.key, message: m.message } })

            await m.react('✅')
        } catch (err) {
            await m.react('❌')
            await m.reply(`❌ Could not download Facebook video.\n\nMake sure the video is *public* and the URL is correct.\n\nError: ${err.message}`)
        }
    }
}

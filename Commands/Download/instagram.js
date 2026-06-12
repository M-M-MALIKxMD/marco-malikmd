const axios = require('axios')

async function getIgMedia(url) {
    const api = `https://api.instagram.com/oembed?url=${encodeURIComponent(url)}`
    const res = await axios.get(`https://igdl.co/api/post?url=${encodeURIComponent(url)}`, {
        headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' },
        timeout: 20000
    })
    return res.data
}

module.exports = {
    name: 'ig',
    aliases: ['instagram', 'insta', 'igdl', 'reel'],
    description: 'Download Instagram reel/video',
    category: 'download',
    async run({ sock, m }) {
        const url = m.q?.split(' ')[0]
        if (!url || !url.includes('instagram.com')) {
            return m.reply(`📸 *Instagram Downloader*\n\n*Usage:* ${m.prefix}ig <Instagram URL>\n\n*Example:*\n• ${m.prefix}ig https://www.instagram.com/reel/xxx\n• ${m.prefix}instagram https://www.instagram.com/p/xxx`)
        }

        await m.react('⬇️')
        await m.reply('⬇️ *Downloading Instagram content...*\nPlease wait...')

        try {
            const apis = [
                `https://api.lolhuman.xyz/api/igdl?apikey=lolhuman&url=${encodeURIComponent(url)}`,
                `https://apis-prabhat.vercel.app/igdl?url=${encodeURIComponent(url)}`
            ]

            let videoUrl
            for (const api of apis) {
                try {
                    const res = await axios.get(api, { timeout: 20000 })
                    videoUrl = res.data?.result?.[0]?.url || res.data?.url || res.data?.result?.url
                    if (videoUrl) break
                } catch (_) {}
            }

            if (!videoUrl) throw new Error('Could not extract media URL')

            const res = await axios.get(videoUrl, { responseType: 'arraybuffer', timeout: 60000 })

            await sock.sendMessage(m.from, {
                video: Buffer.from(res.data),
                mimetype: 'video/mp4',
                caption: `✅ *Instagram Downloaded*\n\n_Downloaded by Marco Malik MD Bot 👑_`
            }, { quoted: { key: m.key, message: m.message } })

            await m.react('✅')
        } catch (err) {
            await m.react('❌')
            await m.reply(`❌ Could not download Instagram content.\n\nMake sure the post is *public*.\n\nError: ${err.message}`)
        }
    }
}

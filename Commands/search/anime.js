const axios = require('axios')

module.exports = {
    name: 'anime',
    aliases: ['manga', 'animesearch', 'ani'],
    description: 'Search anime/manga info',
    category: 'search',
    async run({ sock, m }) {
        const query = m.q
        if (!query) return m.reply(`🎌 *Anime Search*\n\n*Usage:* ${m.prefix}anime <anime name>\n\n*Example:*\n• ${m.prefix}anime Naruto\n• ${m.prefix}anime Attack on Titan`)

        await m.react('🔍')
        await m.reply(`🔍 Searching anime: *${query}*...`)

        const res = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`, { timeout: 15000 })
        const anime = res.data?.data?.[0]
        if (!anime) return m.reply('❌ Anime not found!')

        const text = `🎌 *${anime.title}* (${anime.title_japanese})\n\n📊 *Score:* ⭐ ${anime.score || 'N/A'}\n📅 *Year:* ${anime.aired?.prop?.from?.year || 'N/A'}\n🎬 *Type:* ${anime.type || 'N/A'}\n📺 *Episodes:* ${anime.episodes || '?'}\n⏱️ *Duration:* ${anime.duration || 'N/A'}\n📌 *Status:* ${anime.status || 'N/A'}\n🏷️ *Genres:* ${anime.genres?.map(g => g.name).join(', ') || 'N/A'}\n👥 *Members:* ${anime.members?.toLocaleString() || 'N/A'}\n\n📝 *Synopsis:*\n${(anime.synopsis || 'No synopsis').slice(0, 500)}...\n\n🔗 ${anime.url}\n\n_Powered by Marco Malik MD Bot 👑_`

        if (anime.images?.jpg?.large_image_url) {
            const imgRes = await axios.get(anime.images.jpg.large_image_url, { responseType: 'arraybuffer', timeout: 15000 })
            await sock.sendMessage(m.from, {
                image: Buffer.from(imgRes.data),
                caption: text
            }, { quoted: { key: m.key, message: m.message } })
        } else {
            await m.reply(text)
        }
        await m.react('✅')
    }
}

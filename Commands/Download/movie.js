const axios = require('axios')
const cheerio = require('cheerio')

async function searchMovies(query) {
    try {
        const res = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(query + ' full movie download 720p')}&num=5`, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            timeout: 10000
        })
        const $ = cheerio.load(res.data)
        const results = []
        $('h3').each((i, el) => {
            if (i < 5) results.push($(el).text())
        })
        return results.join('\n')
    } catch { return null }
}

module.exports = {
    name: 'movie',
    aliases: ['film', 'moviedownload', 'moviedl'],
    description: 'Search movie download links',
    category: 'download',
    async run({ sock, m }) {
        const query = m.q
        if (!query) {
            return m.reply(`🎬 *Movie Downloader*\n\n*Usage:* ${m.prefix}movie <movie name>\n\n*Examples:*\n• ${m.prefix}movie Avengers Endgame\n• ${m.prefix}movie Pathaan 2023\n• ${m.prefix}movie Animal 2023 Bollywood\n\n*Note:* Provides Google search results for movie downloads.`)
        }

        await m.react('🔍')
        await m.reply(`🔍 Searching for: *${query}*...`)

        try {
            const yts = require('yt-search')
            const r = await yts(`${query} full movie trailer`)
            const video = r.videos[0]

            let text = `🎬 *Movie Search: ${query}*\n\n`
            text += `📺 *YouTube Trailer Found:*\n`
            if (video) {
                text += `🎥 ${video.title}\n📺 ${video.author.name}\n🔗 ${video.url}\n\n`
            }

            text += `🔗 *Download Links Search:*\n`
            text += `• Google: https://www.google.com/search?q=${encodeURIComponent(query + ' full movie download 720p')}\n`
            text += `• Filmyzilla: https://www.google.com/search?q=${encodeURIComponent('filmyzilla ' + query)}\n`
            text += `• HDMoviesHub: https://www.google.com/search?q=${encodeURIComponent('hdmovies4u ' + query)}\n`
            text += `• Telegram: https://t.me/s/${encodeURIComponent(query.replace(/\s/g, ''))}\n\n`
            text += `⚠️ *Note:* Download from legal sources only.\n\n_Powered by Marco Malik MD Bot 👑_`

            await m.reply(text)
            await m.react('✅')
        } catch (err) {
            await m.react('❌')
            await m.reply('❌ Movie search failed. Please try again.')
        }
    }
}

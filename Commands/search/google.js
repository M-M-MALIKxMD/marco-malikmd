const axios = require('axios')
const cheerio = require('cheerio')

async function googleSearch(query) {
    const res = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(query)}&num=5`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0' },
        timeout: 15000
    })
    const $ = cheerio.load(res.data)
    const results = []
    $('div.g').each((i, el) => {
        if (i >= 5) return
        const title = $(el).find('h3').text()
        const link = $(el).find('a').attr('href')
        const desc = $(el).find('.VwiC3b').text()
        if (title) results.push({ title, link: link?.startsWith('/url') ? new URL('https://google.com' + link).searchParams.get('q') : link, desc })
    })
    return results
}

module.exports = {
    name: 'google',
    aliases: ['search', 'g', 'sr'],
    description: 'Search Google',
    category: 'search',
    async run({ sock, m }) {
        const query = m.q
        if (!query) return m.reply(`🔍 *Google Search*\n\n*Usage:* ${m.prefix}google <query>\n\n*Example:* ${m.prefix}google Pakistan weather today`)

        await m.react('🔍')
        await m.reply(`🔍 Searching: *${query}*...`)

        const results = await googleSearch(query)
        if (!results.length) return m.reply('❌ No results found.')

        let text = `🔍 *Google Results for:* _${query}_\n\n`
        results.forEach((r, i) => {
            text += `*${i + 1}.* ${r.title}\n`
            if (r.desc) text += `📝 ${r.desc.slice(0, 100)}...\n`
            if (r.link) text += `🔗 ${r.link}\n`
            text += '\n'
        })
        text += `_Powered by Marco Malik MD Bot 👑_`

        await m.reply(text)
        await m.react('✅')
    }
}

const axios = require('axios')
const config = require('../../config')

module.exports = {
    name: 'news',
    aliases: ['khabar', 'headlines', 'breaking'],
    description: 'Today\'s news in Urdu/English',
    category: 'search',
    async run({ sock, m }) {
        await m.react('📰')
        await m.reply('📰 *Fetching latest news...*')

        try {
            let articles = []

            if (config.newsApiKey) {
                const res = await axios.get(`https://newsapi.org/v2/top-headlines?country=pk&language=ur&pageSize=10&apiKey=${config.newsApiKey}`, { timeout: 10000 })
                articles = res.data.articles
            } else {
                const res = await axios.get(`https://gnews.io/api/v4/top-headlines?country=pk&lang=ur&max=10&token=free`, { timeout: 10000 })
                articles = res.data?.articles || []
            }

            if (!articles.length) {
                const rss = await axios.get('https://feeds.bbcurdu.com/urdu/pakistan/rss.xml', { timeout: 10000 })
                const matches = rss.data.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g) || []
                const titles = matches.slice(1, 8).map(m => m.replace(/<title><!\[CDATA\[/, '').replace(/\]\]><\/title>/, ''))
                if (titles.length) {
                    let text = `📰 *آج کی خبریں (BBC Urdu)*\n━━━━━━━━━━━━━━━━\n\n`
                    titles.forEach((t, i) => { text += `${i + 1}. ${t}\n\n` })
                    text += `🔗 *مزید خبریں:* https://www.bbcurdu.com\n\n_Powered by Marco Malik MD Bot 👑_`
                    return m.reply(text)
                }
            }

            let text = `📰 *آج کی تازہ خبریں*\n━━━━━━━━━━━━━━━━\n\n`
            articles.slice(0, 8).forEach((a, i) => {
                text += `*${i + 1}.* ${a.title}\n`
                if (a.description) text += `📝 ${a.description.slice(0, 80)}...\n`
                text += `🔗 ${a.url}\n\n`
            })
            text += `_Powered by Marco Malik MD Bot 👑_`
            await m.reply(text)
            await m.react('✅')
        } catch {
            await m.react('❌')
            await m.reply('❌ Could not fetch news. Please try again later.')
        }
    }
}

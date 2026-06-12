const axios = require('axios')

module.exports = {
    name: 'wiki',
    aliases: ['wikipedia', 'w'],
    description: 'Search Wikipedia',
    category: 'search',
    async run({ sock, m }) {
        const query = m.q
        if (!query) return m.reply(`📖 *Wikipedia Search*\n\n*Usage:* ${m.prefix}wiki <topic>\n\n*Example:* ${m.prefix}wiki Pakistan`)

        await m.react('🔍')
        const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`, { timeout: 10000 })
        const { title, extract, content_urls } = res.data

        if (!extract) return m.reply('❌ Wikipedia article not found.')

        await m.reply(`📖 *${title}*\n\n${extract.slice(0, 1000)}${extract.length > 1000 ? '...' : ''}\n\n🔗 ${content_urls?.desktop?.page || ''}\n\n_Powered by Marco Malik MD Bot 👑_`)
        await m.react('✅')
    }
}

const axios = require('axios')

module.exports = {
    name: 'lyrics',
    aliases: ['lyric', 'lyr', 'song_lyrics'],
    description: 'Get song lyrics',
    category: 'search',
    async run({ sock, m }) {
        const query = m.q
        if (!query) return m.reply(`🎵 *Lyrics Finder*\n\n*Usage:* ${m.prefix}lyrics <song name>\n\n*Example:*\n• ${m.prefix}lyrics Tum Hi Ho\n• ${m.prefix}lyrics Shape of You Ed Sheeran`)

        await m.react('🎵')
        await m.reply(`🔍 Finding lyrics: *${query}*...`)

        try {
            const res = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(query.split(' ').slice(0, 2).join(' '))}/${encodeURIComponent(query.split(' ').slice(2).join(' ') || query)}`, { timeout: 10000 })

            const lyrics = res.data.lyrics
            if (!lyrics) throw new Error('No lyrics found')

            const chunks = lyrics.match(/.{1,3000}/gs) || [lyrics]
            for (const chunk of chunks.slice(0, 3)) {
                await sock.sendMessage(m.from, {
                    text: `🎵 *Lyrics: ${query}*\n━━━━━━━━━━━━━━\n\n${chunk}\n\n_Powered by Marco Malik MD Bot 👑_`
                }, { quoted: { key: m.key, message: m.message } })
            }
            await m.react('✅')
        } catch {
            await m.react('❌')
            await m.reply(`❌ Lyrics not found for: *${query}*\n\nTry: Artist Name + Song Title`)
        }
    }
}

const axios = require('axios')
const config = require('../../config')

module.exports = {
    name: 'imagine',
    aliases: ['draw', 'generate', 'aiimage', 'genimage'],
    description: 'Generate AI image from text',
    category: 'ai',
    async run({ sock, m }) {
        const query = m.q
        if (!query) return m.reply(`🎨 *AI Image Generator*\n\n*Usage:* ${m.prefix}imagine <description>\n\n*Example:*\n• ${m.prefix}imagine beautiful sunset over mountains\n• ${m.prefix}imagine futuristic city Pakistan`)

        await m.react('🎨')
        await m.reply('🎨 *Generating AI image...*\n\nPlease wait...')

        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(query + ', high quality, detailed')}?width=512&height=512&nologo=true`

        try {
            const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000 })
            await sock.sendMessage(m.from, {
                image: Buffer.from(res.data),
                caption: `🎨 *AI Generated Image*\n📝 *Prompt:* ${query}\n\n_Powered by Marco Malik MD Bot 👑_`
            }, { quoted: { key: m.key, message: m.message } })
            await m.react('✅')
        } catch {
            await m.react('❌')
            await m.reply('❌ Image generation failed. Please try again with different prompt.')
        }
    }
}

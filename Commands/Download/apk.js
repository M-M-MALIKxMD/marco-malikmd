const axios = require('axios')
const cheerio = require('cheerio')

module.exports = {
    name: 'apk',
    aliases: ['app', 'apkdl', 'appdownload'],
    description: 'Search APK download links',
    category: 'download',
    async run({ sock, m }) {
        const query = m.q
        if (!query) {
            return m.reply(`📦 *APK Downloader*\n\n*Usage:* ${m.prefix}apk <app name>\n\n*Examples:*\n• ${m.prefix}apk WhatsApp\n• ${m.prefix}apk PUBG Mobile\n• ${m.prefix}apk Instagram\n• ${m.prefix}apk TikTok`)
        }

        await m.react('🔍')
        await m.reply(`🔍 Searching APK: *${query}*...`)

        try {
            const safeName = encodeURIComponent(query)
            let text = `📦 *APK Search: ${query}*\n\n`
            text += `🔗 *Download Sources:*\n\n`
            text += `• APKPure: https://apkpure.com/search?q=${safeName}\n`
            text += `• APKMirror: https://www.apkmirror.com/?s=${safeName}\n`
            text += `• Uptodown: https://en.uptodown.com/${safeName.toLowerCase()}\n`
            text += `• APKCombo: https://apkcombo.com/search/${safeName}\n`
            text += `• Aptoide: https://en.aptoide.com/search?query=${safeName}\n\n`
            text += `🏪 *Play Store:*\n`
            text += `• https://play.google.com/store/search?q=${safeName}\n\n`
            text += `💡 *Tip:* Open APKPure for best results!\n\n_Powered by Marco Malik MD Bot 👑_`

            await m.reply(text)
            await m.react('✅')
        } catch {
            await m.react('❌')
            await m.reply('❌ APK search failed. Please try again.')
        }
    }
}

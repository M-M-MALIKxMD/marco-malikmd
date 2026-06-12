const axios = require('axios')
const config = require('../../config')

const NAME_STYLES = {
    marco: { bg: 'dark', color: 'gold', style: 'metallic' },
    zahid: { bg: 'galaxy', color: 'purple', style: 'neon' },
    waqar: { bg: 'fire', color: 'red', style: 'flame' },
    saeed: { bg: 'ocean', color: 'cyan', style: 'wave' },
    devil: { bg: 'dark', color: 'red', style: 'evil' },
    neon: { bg: 'dark', color: 'neon', style: 'glow' },
    fire: { bg: 'fire', color: 'orange', style: 'flame' },
    stylish: { bg: 'gradient', color: 'rainbow', style: 'fancy' },
    text3d: { bg: 'white', color: 'blue', style: '3d' },
    glitch: { bg: 'dark', color: 'green', style: 'glitch' },
    shadow: { bg: 'gradient', color: 'purple', style: 'shadow' },
    rainbow: { bg: 'dark', color: 'rainbow', style: 'colorful' },
    wanted: { bg: 'wanted', color: 'sepia', style: 'poster' }
}

async function generateStylishImage(text, style, cmd) {
    const apis = [
        `https://api.popcat.xyz/welcomecard?background=https://i.imgur.com/e1AgGFP.jpg&text1=${encodeURIComponent(text)}&text2=Marco+Malik+MD+Bot&text3=Welcome&avatar=https://i.imgur.com/5WHHzfS.jpg`,
        `https://api.prabhat.xyz/stylish?text=${encodeURIComponent(text)}&style=${style}`,
        `https://image.pollinations.ai/prompt/${encodeURIComponent(`stylish text art "${text}" ${style} style, neon glowing, dark background, high quality, professional design`)}&width=800&height=400&nologo=true`
    ]

    for (const api of apis) {
        try {
            const res = await axios.get(api, { responseType: 'arraybuffer', timeout: 20000 })
            if (res.data && res.data.byteLength > 1000) return Buffer.from(res.data)
        } catch (_) {}
    }
    throw new Error('All image APIs failed')
}

module.exports = {
    name: 'marco',
    aliases: ['zahid', 'waqar', 'saeed', 'devil', 'neon', 'fire', 'stylish', 'text3d', 'glitch', 'shadow', 'rainbow', 'wanted', 'textart'],
    description: 'Generate stylish name/text image',
    category: 'image',
    async run({ sock, m }) {
        const cmd = m.command
        const text = m.q || 'Marco Malik'
        const styleInfo = NAME_STYLES[cmd] || NAME_STYLES.stylish

        if (!m.q && !['marco', 'zahid', 'waqar', 'saeed', 'devil'].includes(cmd)) {
            return m.reply(`🎨 *${cmd.toUpperCase()} Text Style*\n\n*Usage:* ${m.prefix}${cmd} <your name or text>\n\n*Example:*\n• ${m.prefix}${cmd} Marco Malik\n• ${m.prefix}${cmd} Ali Khan`)
        }

        const displayText = m.q || cmd.charAt(0).toUpperCase() + cmd.slice(1)
        await m.react('🎨')
        await m.reply(`🎨 *Generating ${cmd.toUpperCase()} style image for:* _${displayText}_...`)

        try {
            const imageBuffer = await generateStylishImage(displayText, styleInfo.style, cmd)

            await sock.sendMessage(m.from, {
                image: imageBuffer,
                caption: `✨ *${displayText}*\n🎨 *Style:* ${cmd.toUpperCase()}\n\n_Made by Marco Malik MD Bot 👑_`
            }, { quoted: { key: m.key, message: m.message } })

            await m.react('✅')
        } catch {
            await m.react('❌')
            await m.reply(`❌ Image generation failed.\n\n*Stylish Text:* ✨${displayText}✨\n\n_Marco Malik MD Bot 👑_`)
        }
    }
}

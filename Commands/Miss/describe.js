const { downloadMediaMessage } = require('@whiskeysockets/baileys')
const { OpenAI } = require('openai')
const config = require('../../config')

module.exports = {
    name: 'describe',
    aliases: ['what', 'imgdesc', 'analyze'],
    description: 'Describe/analyze an image using AI',
    category: 'ai',
    async run({ sock, m, raw }) {
        const ctx = m.message?.extendedTextMessage?.contextInfo
        const imgMsg = m.message?.imageMessage || ctx?.quotedMessage?.imageMessage
        if (!imgMsg) return m.reply(`🔍 *Image Describer*\n\nSend/reply to an image with *${m.prefix}describe*\n\n_Marco Malik MD Bot 👑_`)

        if (!config.openaiKey) return m.reply('⚠️ AI not configured.')

        await m.react('🔍')
        await m.reply('🤔 *Analyzing image with AI...*')

        const toDownload = { key: m.key, message: { imageMessage: imgMsg } }
        const buffer = await downloadMediaMessage(toDownload, 'buffer', {},
            { logger: { info: () => {}, error: () => {}, warn: () => {} }, reuploadRequest: sock.updateMediaMessage })

        const base64 = buffer.toString('base64')
        const mimeType = 'image/jpeg'

        const client = new OpenAI({ apiKey: config.openaiKey })
        const res = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{
                role: 'user',
                content: [
                    { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}` } },
                    { type: 'text', text: 'Describe this image in detail. What do you see? Be descriptive and helpful.' }
                ]
            }],
            max_tokens: 500
        })

        const desc = res.choices[0].message.content
        await m.reply(`🔍 *AI Image Analysis:*\n\n${desc}\n\n_Powered by Marco Malik MD Bot 👑_`)
        await m.react('✅')
    }
}

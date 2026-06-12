const { OpenAI } = require('openai')
const config = require('../../config')

const client = new OpenAI({ apiKey: config.openaiKey })
const history = new Map()

const PERSONAS = {
    ai: 'You are a helpful assistant. Reply concisely for WhatsApp.',
    gpt: 'You are GPT-4, a powerful AI. Be detailed and helpful.',
    gpt5: 'You are GPT-5, the most advanced AI. Provide expert-level answers.',
    deepseek: 'You are DeepSeek AI, expert in reasoning and coding. Think step by step.',
    gemini: 'You are Google Gemini, a multimodal AI assistant. Be creative and helpful.',
    copilot: 'You are Microsoft Copilot, expert in coding, productivity, and research.',
    blackbox: 'You are BlackBox AI, specialized in code and technical solutions.',
    codeai: 'You are a code expert AI. Always provide clean, working code with explanations.',
    bot: 'You are Marco Malik MD Bot assistant. Be friendly and helpful.',
    felo: 'You are Felo AI, expert in searching and summarizing information.',
    claude: 'You are Claude by Anthropic, thoughtful and nuanced in responses.',
    llama: 'You are LLaMA by Meta, open-source AI that is helpful and harmless.',
}

module.exports = {
    name: 'ai',
    aliases: ['gpt', 'gpt5', 'deepseek', 'gemini', 'copilot', 'blackbox', 'codeai', 'bot', 'felo', 'claude', 'llama', 'chat', 'ask'],
    description: 'Chat with AI',
    category: 'ai',
    async run({ sock, m }) {
        const cmd = m.command
        const query = m.q

        if (!query) {
            return m.reply(`💬 *${cmd.toUpperCase()} AI Usage:*\n\n*${m.prefix}${cmd} <your question>*\n\n*Example:*\n• ${m.prefix}${cmd} What is AI?\n• ${m.prefix}${cmd} Write a poem\n• ${m.prefix}${cmd} Explain blockchain`)
        }

        if (!config.openaiKey) {
            return m.reply('⚠️ AI not configured. Set OPENAI_API_KEY in environment variables.')
        }

        const uid = m.from + m.sender
        if (!history.has(uid)) {
            history.set(uid, [{
                role: 'system',
                content: PERSONAS[cmd] || PERSONAS.ai
            }])
        }

        const hist = history.get(uid)
        hist.push({ role: 'user', content: query })
        if (hist.length > 12) hist.splice(1, hist.length - 12)

        await m.react('🤔')

        const res = await client.chat.completions.create({
            model: config.openaiModel,
            messages: hist,
            max_tokens: 1000,
            temperature: 0.7
        })

        const answer = res.choices[0].message.content
        hist.push({ role: 'assistant', content: answer })

        await m.react('✅')
        await sock.sendMessage(m.from, {
            text: `🤖 *${cmd.toUpperCase()} Response:*\n\n${answer}\n\n_Powered by Marco Malik MD Bot_`
        }, { quoted: { key: m.key, message: m.message } })
    }
}

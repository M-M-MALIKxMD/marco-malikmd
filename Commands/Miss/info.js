const { formatUptime } = require('../../lib/functions')
const config = require('../../config')

module.exports = {
    name: 'ping',
    aliases: ['alive', 'speed', 'uptime', 'botinfo', 'owner', 'stats', 'id'],
    description: 'Bot status and info',
    category: 'misc',
    async run({ sock, m }) {
        const cmd = m.command
        const p = config.prefix
        const start = Date.now()
        const ping = Date.now() - start

        if (cmd === 'ping' || cmd === 'alive' || cmd === 'speed') {
            return m.reply(`🏓 *Pong!*

🤖 *Bot:* ${config.botName}
⚡ *Speed:* ${ping}ms
⏱️ *Uptime:* ${formatUptime(process.uptime())}
🔥 *Version:* ${config.version}
✅ *Status:* Online 24/7

_Powered by Marco Malik 👑_`)
        }

        if (cmd === 'uptime') {
            return m.reply(`⏱️ *Bot Uptime:* ${formatUptime(process.uptime())}`)
        }

        if (cmd === 'owner') {
            return m.reply(`👑 *Bot Owner Info*

👤 *Name:* ${config.ownerName}
📞 *Number:* ${config.ownerNumber}
🔗 *Contact:* wa.me/${config.ownerNumber}

_This bot is made and maintained by Marco Malik 🇵🇰_`)
        }

        if (cmd === 'botinfo') {
            return m.reply(`🤖 *Bot Information*

📛 *Name:* ${config.botName}
👑 *Owner:* ${config.ownerName}
🔥 *Version:* ${config.version}
⚙️ *Mode:* ${config.mode}
📌 *Prefix:* ${p}
📂 *Commands:* 500+
⏱️ *Uptime:* ${formatUptime(process.uptime())}
⚡ *Speed:* ${ping}ms
🌐 *Library:* Baileys
🇵🇰 *Country:* Pakistan

_Made with ❤️ by Marco Malik_`)
        }

        if (cmd === 'id') {
            return m.reply(`🆔 *Chat ID Info*

📍 *Chat:* ${m.from}
👤 *Sender:* ${m.sender}
📛 *Name:* ${m.pushName}
👥 *Is Group:* ${m.isGroup ? 'Yes' : 'No'}`)
        }
    }
}

const { isOwner } = require('../../lib/functions')
const config = require('../../config')
const { exec } = require('child_process')

module.exports = {
    name: 'broadcast',
    aliases: ['bc', 'block', 'unblock', 'restart', 'shutdown', 'setbio', 'setprefix', 'eval', 'exec', 'grouplist', 'userlist'],
    description: 'Owner commands',
    category: 'owner',
    ownerOnly: true,
    async run({ sock, m }) {
        const cmd = m.command
        const q = m.q

        if (cmd === 'broadcast' || cmd === 'bc') {
            if (!q) return m.reply(`📢 *Usage:* ${m.prefix}broadcast <message>`)
            const chats = await sock.groupFetchAllParticipating()
            const groups = Object.keys(chats)
            let sent = 0
            for (const jid of groups) {
                try {
                    await sock.sendMessage(jid, { text: `📢 *Broadcast from ${config.ownerName}:*\n\n${q}\n\n_Marco Malik MD Bot 👑_` })
                    sent++
                    await new Promise(r => setTimeout(r, 500))
                } catch (_) {}
            }
            await m.reply(`✅ Broadcast sent to *${sent}/${groups.length}* groups!`)
        }

        else if (cmd === 'block') {
            const ctx = m.message?.extendedTextMessage?.contextInfo
            const target = ctx?.participant || (q ? q.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null)
            if (!target) return m.reply(`❌ *Usage:* ${m.prefix}block @user`)
            await sock.updateBlockStatus(target, 'block')
            await m.reply(`🚫 *Blocked:* @${target.split('@')[0]}`)
        }

        else if (cmd === 'unblock') {
            const ctx = m.message?.extendedTextMessage?.contextInfo
            const target = ctx?.participant || (q ? q.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null)
            if (!target) return m.reply(`❌ *Usage:* ${m.prefix}unblock @user`)
            await sock.updateBlockStatus(target, 'unblock')
            await m.reply(`✅ *Unblocked:* @${target.split('@')[0]}`)
        }

        else if (cmd === 'restart') {
            await m.reply('🔄 *Restarting bot...*\n\nBe back in 10 seconds!')
            process.exit(0)
        }

        else if (cmd === 'shutdown') {
            await m.reply('🛑 *Shutting down bot...*\n\nGoodbye! 👋')
            setTimeout(() => process.exit(1), 2000)
        }

        else if (cmd === 'setbio') {
            if (!q) return m.reply(`❌ *Usage:* ${m.prefix}setbio <new bio>`)
            await sock.updateProfileStatus(q)
            await m.reply(`✅ Bot bio updated to: *${q}*`)
        }

        else if (cmd === 'setprefix') {
            if (!q) return m.reply(`❌ *Usage:* ${m.prefix}setprefix <new prefix>`)
            process.env.PREFIX = q
            await m.reply(`✅ Prefix changed to: *${q}*\n\nRestart bot to apply.`)
        }

        else if (cmd === 'eval') {
            if (!q) return m.reply('❌ Provide JS code to evaluate')
            try {
                let result = eval(q)
                if (result instanceof Promise) result = await result
                await m.reply(`✅ *Eval Result:*\n\n\`\`\`\n${JSON.stringify(result, null, 2)}\n\`\`\``)
            } catch (err) {
                await m.reply(`❌ *Error:*\n\n\`\`\`\n${err.message}\n\`\`\``)
            }
        }

        else if (cmd === 'exec') {
            if (!q) return m.reply('❌ Provide shell command to execute')
            exec(q, (err, stdout, stderr) => {
                const output = stdout || stderr || err?.message || 'No output'
                m.reply(`💻 *Exec:* \`${q}\`\n\n\`\`\`\n${output.slice(0, 2000)}\n\`\`\``)
            })
        }

        else if (cmd === 'grouplist') {
            const groups = await sock.groupFetchAllParticipating()
            const list = Object.values(groups).map((g, i) => `${i + 1}. ${g.subject} (${g.participants.length} members)`).join('\n')
            await m.reply(`👥 *All Groups (${Object.keys(groups).length}):*\n\n${list}\n\n_Marco Malik MD Bot 👑_`)
        }
    }
}

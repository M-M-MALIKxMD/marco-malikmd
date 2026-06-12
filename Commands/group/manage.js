const { isOwner } = require('../../lib/functions')
const config = require('../../config')

module.exports = {
    name: 'kick',
    aliases: ['remove', 'ban', 'add', 'promote', 'admin', 'demote', 'mute', 'unmute', 'lock', 'unlock', 'setname', 'setdesc', 'invite', 'groupinfo', 'members', 'admins', 'antilink', 'welcome', 'setwelcome'],
    description: 'Group management commands',
    category: 'group',
    groupOnly: true,
    async run({ sock, m }) {
        const cmd = m.command
        const groupMeta = await sock.groupMetadata(m.from)
        const botId = sock.user?.id?.split(':')[0] + '@s.whatsapp.net'
        const botAdmin = groupMeta.participants.find(p => p.id === botId)?.admin
        const senderAdmin = groupMeta.participants.find(p => p.id === m.sender)?.admin

        const requireAdmin = (label = 'admin') => {
            if (!senderAdmin && !isOwner(m.sender)) {
                m.reply(`❌ You must be *${label}* to use this command!`); return false
            }
            return true
        }
        const requireBotAdmin = () => {
            if (!botAdmin) { m.reply('❌ I must be *Group Admin* for this!'); return false }
            return true
        }

        const getMentioned = () => {
            const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid
            return mentioned?.[0] || (m.q ? m.q.replace('@', '') + '@s.whatsapp.net' : null)
        }

        if (cmd === 'kick' || cmd === 'remove' || cmd === 'ban') {
            if (!requireAdmin() || !requireBotAdmin()) return
            const target = getMentioned()
            if (!target) return m.reply(`❌ *Usage:* ${m.prefix}kick @user`)
            await sock.groupParticipantsUpdate(m.from, [target], 'remove')
            await m.reply(`✅ *@${target.split('@')[0]}* has been removed from the group!`)
        }

        else if (cmd === 'add') {
            if (!requireAdmin() || !requireBotAdmin()) return
            const num = m.q?.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
            if (!m.q) return m.reply(`❌ *Usage:* ${m.prefix}add 923xxxxxxxxx`)
            await sock.groupParticipantsUpdate(m.from, [num], 'add')
            await m.reply(`✅ *${m.q}* has been added to the group!`)
        }

        else if (cmd === 'promote' || cmd === 'admin') {
            if (!requireAdmin() || !requireBotAdmin()) return
            const target = getMentioned()
            if (!target) return m.reply(`❌ *Usage:* ${m.prefix}promote @user`)
            await sock.groupParticipantsUpdate(m.from, [target], 'promote')
            await m.reply(`✅ *@${target.split('@')[0]}* is now a Group Admin! 👑`)
        }

        else if (cmd === 'demote') {
            if (!requireAdmin() || !requireBotAdmin()) return
            const target = getMentioned()
            if (!target) return m.reply(`❌ *Usage:* ${m.prefix}demote @user`)
            await sock.groupParticipantsUpdate(m.from, [target], 'demote')
            await m.reply(`✅ *@${target.split('@')[0]}* Admin removed.`)
        }

        else if (cmd === 'mute' || cmd === 'lock') {
            if (!requireAdmin() || !requireBotAdmin()) return
            await sock.groupSettingUpdate(m.from, 'announcement')
            await m.reply('🔒 *Group Muted!* Only admins can send messages.')
        }

        else if (cmd === 'unmute' || cmd === 'unlock') {
            if (!requireAdmin() || !requireBotAdmin()) return
            await sock.groupSettingUpdate(m.from, 'not_announcement')
            await m.reply('🔓 *Group Unmuted!* Everyone can send messages.')
        }

        else if (cmd === 'setname') {
            if (!requireAdmin() || !requireBotAdmin()) return
            if (!m.q) return m.reply(`❌ *Usage:* ${m.prefix}setname New Group Name`)
            await sock.groupUpdateSubject(m.from, m.q)
            await m.reply(`✅ Group name changed to: *${m.q}*`)
        }

        else if (cmd === 'setdesc') {
            if (!requireAdmin() || !requireBotAdmin()) return
            if (!m.q) return m.reply(`❌ *Usage:* ${m.prefix}setdesc New description`)
            await sock.groupUpdateDescription(m.from, m.q)
            await m.reply('✅ Group description updated!')
        }

        else if (cmd === 'invite') {
            if (!requireAdmin() || !requireBotAdmin()) return
            const code = await sock.groupInviteCode(m.from)
            await m.reply(`🔗 *Group Invite Link:*\nhttps://chat.whatsapp.com/${code}`)
        }

        else if (cmd === 'groupinfo') {
            const text = `👥 *Group Info*\n\n📛 *Name:* ${groupMeta.subject}\n🆔 *ID:* ${m.from}\n👥 *Members:* ${groupMeta.participants.length}\n👑 *Admins:* ${groupMeta.participants.filter(p => p.admin).length}\n📝 *Description:* ${groupMeta.desc || 'No description'}\n📅 *Created:* ${new Date(groupMeta.creation * 1000).toLocaleDateString()}`
            await m.reply(text)
        }

        else if (cmd === 'members') {
            const members = groupMeta.participants.map((p, i) => `${i + 1}. @${p.id.split('@')[0]}${p.admin ? ' 👑' : ''}`).join('\n')
            await sock.sendMessage(m.from, {
                text: `👥 *Group Members (${groupMeta.participants.length}):*\n\n${members}`,
                mentions: groupMeta.participants.map(p => p.id)
            }, { quoted: { key: m.key, message: m.message } })
        }

        else if (cmd === 'admins') {
            const admins = groupMeta.participants.filter(p => p.admin).map((p, i) => `${i + 1}. @${p.id.split('@')[0]} (${p.admin})`).join('\n')
            await sock.sendMessage(m.from, {
                text: `👑 *Group Admins:*\n\n${admins}`,
                mentions: groupMeta.participants.filter(p => p.admin).map(p => p.id)
            }, { quoted: { key: m.key, message: m.message } })
        }
    }
}

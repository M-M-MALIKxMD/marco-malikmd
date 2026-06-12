module.exports = {
    name: 'tagall',
    aliases: ['tag', 'everyone', 'mentionall', 'all'],
    description: 'Tag all group members',
    category: 'group',
    groupOnly: true,
    async run({ sock, m }) {
        const groupMeta = await sock.groupMetadata(m.from)
        const members = groupMeta.participants.map(p => p.id)
        const msg = m.q || `📢 *Attention Everyone!*\n\n_From: ${m.pushName}_`

        let text = `${msg}\n\n`
        members.forEach(member => { text += `@${member.split('@')[0]} ` })

        await sock.sendMessage(m.from, { text, mentions: members }, { quoted: { key: m.key, message: m.message } })
    }
}

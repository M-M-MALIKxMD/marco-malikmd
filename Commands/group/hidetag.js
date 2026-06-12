module.exports = {
    name: 'hidetag',
    aliases: ['htag', 'stag', 'silentag'],
    description: 'Tag all members silently (hidden)',
    category: 'group',
    groupOnly: true,
    async run({ sock, m }) {
        const groupMeta = await sock.groupMetadata(m.from)
        const members = groupMeta.participants.map(p => p.id)
        const msg = m.q || '📢 Important Announcement!'

        await sock.sendMessage(m.from, { text: msg, mentions: members }, { quoted: { key: m.key, message: m.message } })
    }
}

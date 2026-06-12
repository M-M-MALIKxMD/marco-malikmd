const axios = require('axios')
const config = require('../../config')

const greetings = {
    gm: { emoji: '🌅', title: 'Good Morning', msg: 'صبح بخیر! آج کا دن مبارک ہو! 🌞\n\nHave a wonderful day!\n\n_Marco Malik MD Bot 👑_' },
    gn: { emoji: '🌙', title: 'Good Night', msg: 'شب بخیر! اچھی نیند آئے! 🌙\n\nSweet dreams!\n\n_Marco Malik MD Bot 👑_' },
    ge: { emoji: '☀️', title: 'Good Evening', msg: 'شام بخیر! ❤️\n\nHope you had a great day!\n\n_Marco Malik MD Bot 👑_' },
    jummah: { emoji: '🕌', title: 'Jumma Mubarak', msg: '🕌 *جمعہ مبارک!*\n\nAllah aapki har dua qabool farmaye!\nJumma Mubarak to all Muslims! 🤲\n\n_Marco Malik MD Bot 👑_' },
    eid: { emoji: '🎉', title: 'Eid Mubarak', msg: '🎉 *عید مبارک!*\n\nEid Mubarak to you and your family!\nAllah barkah dale! 🌙\n\n_Marco Malik MD Bot 👑_' },
    ramadan: { emoji: '🌙', title: 'Ramadan Mubarak', msg: '🌙 *رمضان مبارک!*\n\nRamadan Kareem!\nMay Allah accept your fasts and prayers! 🤲\n\n_Marco Malik MD Bot 👑_' },
    birthday: { emoji: '🎂', title: 'Happy Birthday', msg: '🎂 *جنم دن مبارک!*\n\nHappy Birthday!\nMay all your dreams come true! 🎁✨\n\n_Marco Malik MD Bot 👑_' },
    hug: { emoji: '🤗', title: 'Virtual Hug', msg: '🤗 *Virtual Hug!*\n\nYou deserve this hug!\nKeep smiling! 😊❤️\n\n_Marco Malik MD Bot 👑_' },
    dua: { emoji: '🤲', title: 'Islamic Dua', msg: '🤲 *دعا*\n\nاللہ تعالیٰ آپ کو دنیا و آخرت میں کامیابی عطا فرمائے۔ آمین\n\nAmeen Ya Rabb! 🕌\n\n_Marco Malik MD Bot 👑_' }
}

module.exports = {
    name: 'gm',
    aliases: ['gn', 'ge', 'jummah', 'eid', 'ramadan', 'birthday', 'hug', 'dua', 'goodmorning', 'goodnight', 'goodevening'],
    description: 'Greeting messages',
    category: 'misc',
    async run({ sock, m }) {
        const cmd = m.command
        const key = cmd === 'goodmorning' ? 'gm' : cmd === 'goodnight' ? 'gn' : cmd === 'goodevening' ? 'ge' : cmd
        const g = greetings[key] || greetings.gm
        const target = m.q ? `*${m.q}*\n\n` : ''

        await sock.sendMessage(m.from, {
            text: `${g.emoji} *${g.title}!*\n\n${target}${g.msg}`
        }, { quoted: { key: m.key, message: m.message } })
        await m.react(g.emoji)
    }
}

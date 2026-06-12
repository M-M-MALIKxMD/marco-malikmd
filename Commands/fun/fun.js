const { pickRandom } = require('../../lib/functions')

const jokes = [
    "Teacher: Kal raat mein tumne kya kiya?\nStudent: Padhai ki.\nTeacher: Thik hai, kal se padhai karna band karo! 😂",
    "Doctor: Beta kuch nahi hoga.\nPatient: Kya doctor sahab?\nDoctor: Tumhara bill nahi bhar paoge! 😂",
    "Wife: Tum mujhse pyar nahi karte!\nHusband: Karo karo, thak gaye hain 25 saal se 😂",
    "Ladka: Papa mobile le do.\nPapa: Pehle 90% lao.\nLadka: 90% ke baad kya zarorat hogi mobile ki? 😂",
    "Maths teacher: 2+2=?\nStudent: 4.\nTeacher: Bara soch!\nStudent: 4 crore 😂",
    "Biwi: Main ghar se chali jaongi!\nShauhar: Bus ki ticket chahiye? 😂",
    "Meri pocket mein sirf ek cheez hai - Hath! 😂",
    "Friend: Yaar kab shaadi kar raha hai?\nMain: Jab dushmani khatam ho jaye life se 😂"
]

const truths = [
    "Kya tum ne kabhi kisi dost se jhooti baat ki hai?",
    "Tum ne kisi ko secretly pasand kiya hai?",
    "Aaj kal koi tension hai zindagi mein?",
    "Kya tum ne kabhi exam mein cheating ki?",
    "Tumhari zindagi ka sabse sharmindagi wala moment kya hai?",
    "Tum ne kisi ka raaz bataya hai doosre ko?",
    "Sabse zyada kise miss karte ho?",
    "Kya kabhi bhai/behan pe gussa aaya aur khud par hasa?",
    "Sabse bura lie kya tha jo tune parents ko bola?",
    "Kya tujhe khud ki koi aadat pasand nahi?"
]

const dares = [
    "Apne WhatsApp Status par 'Main Pagal Hon' likhao 10 minute ke liye!",
    "Group mein sabse zyada unusual name wale ko tag karo!",
    "Apna favourite song voice note mein gao!",
    "5 minute ke liye apni DP hata do!",
    "Group admin ko Good Morning bol dena personally!",
    "Khud ki selfie bana ke group mein bhejo!",
    "Koi bhi funny poem banao aur group mein share karo!",
    "10 jumping jacks karo aur video bhejo!",
    "Apna koi secret fact group mein share karo!",
    "Apne bio mein 'Marco Malik Fan' likhao 1 ghante ke liye!"
]

const quotes = [
    "🌟 *Zindagi ek safar hai, manzil nahi.* - Unknown",
    "💪 *Mushkilat aati hain sirf unke liye jo kuch karne ki koshish karte hain.* - Marco Malik",
    "❤️ *Mohabbat ek ehsaas hai jo sirf dil samjhta hai.* - Unknown",
    "🔥 *Haar ke baad khade hona hi asli jeet hai.* - Unknown",
    "🌹 *Zindagi mein kuch pal aate hain jo humein badal dete hain.* - Unknown",
    "💡 *Kal ke sapne aaj ke effort se poore hote hain.* - Unknown",
    "🚀 *Khwaab wo nahi jo raat ko nazar aayein, khwaab wo hain jo rat ko sone nahi dete.* - Abdul Kalam",
    "🇵🇰 *Pakistan ka matlab kya? La ilaha illallah.* - Quaid-e-Azam"
]

const facts = [
    "🐝 Shahad kabhi kharab nahi hoti! 3000 saal purani shahad bhi khai ja sakti hai.",
    "🧠 Insani dimag 70-80% paani se bana hota hai.",
    "🌙 Chaand par paani ki buzurg deposits mili hain - 2009.",
    "🐙 Octopus ke 3 dil hote hain!",
    "🦁 Sher 24 ghante mein 20 ghante sota hai.",
    "🌍 Dharti ka 71% hissa paani hai lekin sirf 3% peene ke qaabil hai.",
    "🐘 Hathi ek baar sunne wali awaaz ko saalon tak yaad rakh sakta hai.",
    "🍯 Ek chammach shahad banane ke liye 12 machiyan poori zindagi kaam karti hain.",
    "🌿 Paudhe baat karte hain - chemical signals ke zariye!",
    "💤 Insaan apni zindagi ka 1/3 hissa soye guzarta hai."
]

const roasts = [
    "Yaar teri selfie dekh ke phone ka camera rone lag gaya! 😂",
    "Tu itna boring hai ke tere saath soye to neend bhi aa jaye! 😴",
    "Teri padhai ka haal dekh ke pencil ne resign kar di! ✏️",
    "Tu itna bhola hai ke Google Maps bhi tujhe dhundhne mein waqt lagata hai! 🗺️",
    "Teri personality itni unique hai ke... actually nahi hai! 😂",
    "Teri IQ dekh ke calculator ne chhutti le li! 🧮",
    "Tu itna dheeray boltha hai ke WhatsApp pe voice note double speed pe bhi slow lagti hai! 🎙️"
]

module.exports = {
    name: 'joke',
    aliases: ['jokes', 'lol', 'funny', 'mazak', 'latifa', 'truth', 'dare', 'quote', 'fact', 'roast', '8ball', 'flip', 'dice', 'rate', 'choose', 'ship', 'love', 'couple', 'flirt'],
    description: 'Fun commands',
    category: 'fun',
    async run({ sock, m }) {
        const cmd = m.command
        const q = m.q

        if (cmd === 'joke' || cmd === 'jokes' || cmd === 'lol' || cmd === 'funny' || cmd === 'mazak' || cmd === 'latifa') {
            await m.react('😂')
            await m.reply(`😂 *Random Joke:*\n\n${pickRandom(jokes)}\n\n_Powered by Marco Malik MD Bot 👑_`)
        }

        else if (cmd === 'truth') {
            await m.react('🎯')
            await m.reply(`🎯 *Truth Question:*\n\n${pickRandom(truths)}\n\n_Answer honestly! Marco Malik MD Bot 👑_`)
        }

        else if (cmd === 'dare') {
            await m.react('🎭')
            await m.reply(`🎭 *Dare Challenge:*\n\n${pickRandom(dares)}\n\n_Can you do it? Marco Malik MD Bot 👑_`)
        }

        else if (cmd === 'quote') {
            await m.react('🌟')
            await m.reply(`🌟 *Quote of the Moment:*\n\n${pickRandom(quotes)}\n\n_Marco Malik MD Bot 👑_`)
        }

        else if (cmd === 'fact') {
            await m.react('🧠')
            await m.reply(`🧠 *Random Fact:*\n\n${pickRandom(facts)}\n\n_Marco Malik MD Bot 👑_`)
        }

        else if (cmd === 'roast') {
            await m.react('🔥')
            const target = q ? `@${q.replace('@', '')}` : m.pushName
            await m.reply(`🔥 *Roast for ${target}:*\n\n${pickRandom(roasts)}\n\n_Just kidding! Marco Malik MD Bot 👑_`)
        }

        else if (cmd === '8ball') {
            const answers = ['✅ Bilkul Haan!', '❌ Nahi!', '🤔 Shayad...', '💯 Definitely!', '😅 Pata nahi yaar!', '🔮 Possible hai!', '🚫 Kabhi Nahi!', '⭐ Inshallah!']
            if (!q) return m.reply(`🎱 *Usage:* ${m.prefix}8ball <koi bhi sawaal>`)
            await m.reply(`🎱 *Sawaal:* ${q}\n\n*Jawab:* ${pickRandom(answers)}\n\n_Marco Malik MD Bot 👑_`)
        }

        else if (cmd === 'flip') {
            await m.react('🪙')
            const result = Math.random() > 0.5 ? '👑 HEADS' : '🦅 TAILS'
            await m.reply(`🪙 *Coin Flip Result:*\n\n*${result}*\n\n_Marco Malik MD Bot 👑_`)
        }

        else if (cmd === 'dice') {
            await m.react('🎲')
            const result = Math.floor(Math.random() * 6) + 1
            await m.reply(`🎲 *Dice Result: ${result}*\n\n${'⚀⚁⚂⚃⚄⚅'[result - 1]}\n\n_Marco Malik MD Bot 👑_`)
        }

        else if (cmd === 'rate') {
            if (!q) return m.reply(`⭐ *Usage:* ${m.prefix}rate <kuch bhi>`)
            const percent = Math.floor(Math.random() * 101)
            await m.reply(`⭐ *${q}* ki rating:\n\n${'█'.repeat(Math.floor(percent / 10))}${'░'.repeat(10 - Math.floor(percent / 10))} *${percent}%*\n\n_Marco Malik MD Bot 👑_`)
        }

        else if (cmd === 'choose') {
            if (!q) return m.reply(`🎭 *Usage:* ${m.prefix}choose option1 | option2 | option3`)
            const options = q.split('|').map(o => o.trim())
            if (options.length < 2) return m.reply('❌ At least 2 options chahiye! Use | to separate options.')
            const chosen = pickRandom(options)
            await m.reply(`🎯 *Options:* ${options.join(' vs ')}\n\n*Main choose karta hon:* ✅ *${chosen}*\n\n_Marco Malik MD Bot 👑_`)
        }

        else if (cmd === 'ship' || cmd === 'love' || cmd === 'couple') {
            const names = q?.split(' ') || []
            const name1 = names[0] || m.pushName
            const name2 = names[1] || 'Zindagi'
            const percent = Math.floor(Math.random() * 101)
            const heart = percent > 70 ? '❤️' : percent > 40 ? '🧡' : '💔'
            await m.reply(`${heart} *Love Calculator*\n\n*${name1}* + *${name2}*\n\n${'❤️'.repeat(Math.floor(percent / 10))}${'🖤'.repeat(10 - Math.floor(percent / 10))}\n\n*${percent}% Match!* ${heart}\n\n_Marco Malik MD Bot 👑_`)
        }

        else if (cmd === 'flirt') {
            const flirts = [
                'Tumhari muskurahat dekh ke mera din ban jata hai! 🌹',
                'Tum ho toh duniya khoobsoorat lagti hai! ❤️',
                'Teri aankhon mein sitare hain jo raat ko bhi roshni dete hain! ✨',
                'Tum se milna meri zindagi ka sabse accha lamha tha! 💕',
                'Tumhare bina yeh dil adhoora hai! 💖'
            ]
            const target = q || m.pushName
            await m.reply(`🌹 *Flirt Message for ${target}:*\n\n${pickRandom(flirts)}\n\n_Marco Malik MD Bot 👑_`)
        }
    }
}

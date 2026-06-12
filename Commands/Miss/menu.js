const { formatUptime } = require('../../lib/functions')
const config = require('../../config')
const axios = require('axios')

module.exports = {
    name: 'menu',
    aliases: ['help', 'start', 'list', 'cmds', 'commands', 'm'],
    description: 'Show full command menu with image',
    category: 'misc',
    async run({ sock, m }) {
        const uptime = formatUptime(process.uptime())
        const p = config.prefix
        const now = new Date().toLocaleString('ur-PK', { timeZone: 'Asia/Karachi' })

        const menu = `╭───────────────⭓
│ ✨ *MARCO MALIK MD BOT* ✨
╰───────────────⭓

┏━━━━━━━━━━━━━━━━━━━┓
👤 *OWNER :* ${config.ownerName}
🚀 *UPTIME :* ${uptime}
📂 *COMMANDS :* 500+
⚙️ *MODE :* ${config.mode.toUpperCase()}
🔥 *VERSION :* ${config.version}
🕐 *TIME :* ${now}
┗━━━━━━━━━━━━━━━━━━━┛

◇══════【 🤖 AI 】══════◇
⚡ ${p}ai — Chat with AI
⚡ ${p}gpt — GPT-4 Chat
⚡ ${p}gpt5 — GPT-5 Mode
⚡ ${p}deepseek — DeepSeek AI
⚡ ${p}gemini — Google Gemini
⚡ ${p}copilot — Microsoft Copilot
⚡ ${p}blackbox — BlackBox AI
⚡ ${p}codeai — Code Generator
⚡ ${p}bot — Bot Chat
⚡ ${p}claude — Claude AI
⚡ ${p}llama — LLaMA AI
⚡ ${p}imagine — AI Image Gen
⚡ ${p}draw — AI Draw
⚡ ${p}describe — Describe Image

◇══════【 📥 DOWNLOAD 】══════◇
📥 ${p}play — YouTube Song (Audio)
📥 ${p}song — Song Download
📥 ${p}music — Music Download
📥 ${p}audio — Audio Download
📥 ${p}video — YouTube Video
📥 ${p}yt — YouTube Audio URL
📥 ${p}ytv — YouTube Video
📥 ${p}tiktok — TikTok Video
📥 ${p}tt — TikTok DL
📥 ${p}fb — Facebook Video
📥 ${p}ig — Instagram Video
📥 ${p}apk — APK Download
📥 ${p}movie — Movie Download
📥 ${p}film — Film Search

◇══════【 🔍 SEARCH 】══════◇
🔍 ${p}google — Google Search
🔍 ${p}wiki — Wikipedia
🔍 ${p}news — Today's News (Urdu)
🔍 ${p}lyrics — Song Lyrics
🔍 ${p}weather — Weather Info
🔍 ${p}anime — Anime Search
🔍 ${p}gif — GIF Search

◇══════【 👥 GROUP 】══════◇
👥 ${p}tagall — Tag Everyone
👥 ${p}hidetag — Hidden Tag
👥 ${p}kick — Kick Member
👥 ${p}add — Add Member
👥 ${p}invite — Group Invite Link
👥 ${p}promote — Make Admin
👥 ${p}demote — Remove Admin
👥 ${p}mute — Mute Group
👥 ${p}unmute — Unmute Group
👥 ${p}lock — Lock Group
👥 ${p}unlock — Unlock Group
👥 ${p}setname — Set Group Name
👥 ${p}welcome — Welcome Toggle
👥 ${p}antilink — Anti-Link Toggle
👥 ${p}antidelete — Anti-Delete
👥 ${p}groupinfo — Group Info
👥 ${p}members — Group Members
👥 ${p}admins — List Admins

◇══════【 😂 FUN 】══════◇
😂 ${p}joke — Random Joke
❤️ ${p}ship — Love Calculator
🔥 ${p}roast — Roast Someone
🎯 ${p}truth — Truth Question
🎭 ${p}dare — Dare Challenge
💬 ${p}quote — Random Quote
🧠 ${p}fact — Random Fact
🎱 ${p}8ball — Magic 8-Ball
🪙 ${p}flip — Coin Flip
🎲 ${p}dice — Roll Dice

◇══════【 🖼 STICKER 】══════◇
🖼 ${p}sticker — Make Sticker
🖼 ${p}s — Quick Sticker
📦 ${p}toimg — Sticker to Image
✨ ${p}attp — Animated Text Sticker

◇══════【 🎨 IMAGE GEN 】══════◇
🎨 ${p}marco — Marco Style Name
🎨 ${p}neon — Neon Text Effect
🎨 ${p}fire — Fire Text Effect
🎨 ${p}stylish — Stylish Text
🎨 ${p}glitch — Glitch Text
🎨 ${p}rainbow — Rainbow Text
🎨 ${p}wanted — Wanted Poster

◇══════【 🎁 GREETINGS 】══════◇
🌅 ${p}gm — Good Morning
🌙 ${p}gn — Good Night
🕌 ${p}jummah — Jumma Mubarak
🎂 ${p}birthday — Birthday Wish
🌙 ${p}ramadan — Ramadan Mubarak
🎉 ${p}eid — Eid Mubarak
🤲 ${p}dua — Islamic Dua

◇══════【 ⚙️ TOOLS 】══════◇
🔊 ${p}tts — Text to Speech
🌐 ${p}translate — Translate Text
📱 ${p}qr — Generate QR Code
🔗 ${p}shorturl — Shorten URL
🔐 ${p}password — Gen Password
🏓 ${p}ping — Bot Speed

◇══════【 👑 OWNER 】══════◇
📢 ${p}broadcast — Broadcast Msg
🚫 ${p}block — Block User
🔄 ${p}restart — Restart Bot
🛑 ${p}shutdown — Shutdown Bot
📝 ${p}setbio — Set Bot Bio
⚙️ ${p}setprefix — Change Prefix
📋 ${p}eval — Run JS Code
💻 ${p}exec — Run Shell Cmd
📊 ${p}grouplist — All Groups

━━━━━━━━━━━━━━━━━━━━━━━━
📞 *CONTACT OWNER*
📲 wa.me/923001234567
━━━━━━━━━━━━━━━━━━━━━━━━

_Powered by *Marco Malik* 👑_
_Made with ❤️ in Pakistan 🇵🇰_`

        // ══════════════════════════════
        //   MENU IMAGE SUPPORT
        //   .env میں MENU_IMAGE لگائیں
        // ══════════════════════════════
        const menuImage = config.menuImage

        if (menuImage) {
            try {
                let imageBuffer

                // اگر URL ہے تو download کریں
                if (menuImage.startsWith('http')) {
                    const response = await axios.get(menuImage, {
                        responseType: 'arraybuffer',
                        timeout: 10000
                    })
                    imageBuffer = Buffer.from(response.data)
                }
                // اگر local file path ہے
                else {
                    const fs = require('fs')
                    const path = require('path')
                    const imgPath = path.join(__dirname, '../../', menuImage)
                    if (fs.existsSync(imgPath)) {
                        imageBuffer = fs.readFileSync(imgPath)
                    }
                }

                if (imageBuffer) {
                    // Image کے ساتھ menu text بھیجیں
                    await sock.sendMessage(m.from, {
                        image: imageBuffer,
                        caption: menu,
                        mimetype: 'image/jpeg'
                    }, { quoted: m.key ? { key: m.key, message: m.message } : undefined })
                    return
                }
            } catch (err) {
                // Image load نہ ہو تو صرف text بھیجیں
                console.log('Menu image error:', err.message)
            }
        }

        // Image نہ ہو یا error ہو تو صرف text menu
        await sock.sendMessage(m.from, { text: menu }, { quoted: m.key ? { key: m.key, message: m.message } : undefined })
    }
}

require('dotenv').config()

module.exports = {
    sessionId: process.env.SESSION_ID || '',
    botName: process.env.BOT_NAME || 'Marco Malik MD Bot',
    ownerName: process.env.OWNER_NAME || 'Marco Malik',
    ownerNumber: process.env.OWNER_NUMBER || '923001234567',
    prefix: process.env.PREFIX || '.',
    version: '5.0',
    mode: process.env.MODE || 'public',
    authDir: process.env.AUTH_DIR || 'auth_info',

    // ══ MENU IMAGE ══
    // اپنی picture کا URL یا filename یہاں لگائیں
    menuImage: process.env.MENU_IMAGE || '',

    openaiKey: process.env.OPENAI_API_KEY || '',
    openaiModel: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    channelLink: process.env.CHANNEL_LINK || 'https://whatsapp.com/channel/your-channel',
    repoLink: process.env.REPO_LINK || 'https://github.com/M-M-MALIKxMD/marco-malik_md',
    herokuLink: process.env.HEROKU_LINK || 'https://heroku.com/deploy?template=https://github.com/M-M-MALIKxMD/marco-malik_md',
    railwayLink: process.env.RAILWAY_LINK || 'https://railway.app/new/template?template=https://github.com/M-M-MALIKxMD/marco-malik_md',
    contactLink: process.env.CONTACT_LINK || 'https://wa.me/923001234567',
    antiLink: process.env.ANTI_LINK === 'true',
    antiDelete: process.env.ANTI_DELETE === 'true',
    autoRead: process.env.AUTO_READ === 'true',
    autoReact: process.env.AUTO_REACT === 'true',
    autoStatusRead: process.env.AUTO_STATUS_READ === 'true',
    autoRecord: process.env.AUTO_RECORD === 'true',
    antiCall: process.env.ANTI_CALL !== 'false',
    newsApiKey: process.env.NEWS_API_KEY || '',
    weatherApiKey: process.env.WEATHER_API_KEY || '',
}

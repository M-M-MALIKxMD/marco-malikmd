const { tmpdir } = require('os')
const path = require('path')
const fs = require('fs')
const config = require('../config')

function getTime() {
    return new Date().toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi', hour12: true })
}

function getDate() {
    return new Date().toLocaleDateString('en-PK', { timeZone: 'Asia/Karachi' })
}

function formatUptime(seconds) {
    const d = Math.floor(seconds / 86400)
    const h = Math.floor((seconds % 86400) / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    return `${d}d ${h}h ${m}m ${s}s`
}

function tmpFile(ext) {
    return path.join(tmpdir(), `mmmd_${Date.now()}.${ext}`)
}

function cleanTmp(filePath) {
    try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath) } catch (_) {}
}

function isOwner(jid) {
    const ownerJid = config.ownerNumber.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    return jid === ownerJid
}

function isGroup(jid) {
    return jid.endsWith('@g.us')
}

function mention(jid) {
    return `@${jid.split('@')[0]}`
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

function limitSize(filePath, maxMB) {
    const stat = fs.statSync(filePath)
    return (stat.size / (1024 * 1024)) <= maxMB
}

const reactEmojis = ['❤️', '🔥', '😂', '👍', '🎉', '💯', '😎', '🚀', '✨', '🌹', '💪', '🙌']

module.exports = {
    getTime,
    getDate,
    formatUptime,
    tmpFile,
    cleanTmp,
    isOwner,
    isGroup,
    mention,
    sleep,
    pickRandom,
    limitSize,
    reactEmojis
}

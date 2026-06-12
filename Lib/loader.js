const fs = require('fs')
const path = require('path')

const commands = new Map()
const aliases = new Map()

function loadCommands(dir) {
    const absDir = path.resolve(dir)
    const folders = fs.readdirSync(absDir)
    for (const folder of folders) {
        const folderPath = path.join(absDir, folder)
        if (!fs.statSync(folderPath).isDirectory()) continue
        const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'))
        for (const file of files) {
            try {
                const cmdPath = path.join(folderPath, file)
                const cmd = require(cmdPath)
                if (!cmd.name) continue
                commands.set(cmd.name, cmd)
                if (cmd.aliases && Array.isArray(cmd.aliases)) {
                    for (const alias of cmd.aliases) {
                        aliases.set(alias, cmd.name)
                    }
                }
            } catch (err) {
                console.error(`Error loading ${file}:`, err.message)
            }
        }
    }
    console.log(`✅ Loaded ${commands.size} commands with ${aliases.size} aliases`)
}

function getCommand(name) {
    if (commands.has(name)) return commands.get(name)
    if (aliases.has(name)) return commands.get(aliases.get(name))
    return null
}

function getAllCommands() {
    return commands
}

module.exports = { loadCommands, getCommand, getAllCommands }

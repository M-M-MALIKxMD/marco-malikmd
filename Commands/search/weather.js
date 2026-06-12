const axios = require('axios')
const config = require('../../config')

module.exports = {
    name: 'weather',
    aliases: ['climate', 'mosam', 'w8r'],
    description: 'Get weather information',
    category: 'search',
    async run({ sock, m }) {
        const city = m.q || 'Lahore'

        await m.react('🌤️')
        await m.reply(`🌤️ Fetching weather for: *${city}*...`)

        try {
            let data
            if (config.weatherApiKey) {
                const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${config.weatherApiKey}&units=metric`, { timeout: 10000 })
                data = res.data
                const w = data
                const text = `🌍 *Weather: ${w.name}, ${w.sys.country}*\n\n🌡️ *Temperature:* ${w.main.temp}°C (Feels ${w.main.feels_like}°C)\n💧 *Humidity:* ${w.main.humidity}%\n💨 *Wind:* ${w.wind.speed} m/s\n☁️ *Condition:* ${w.weather[0].description}\n👁️ *Visibility:* ${(w.visibility / 1000).toFixed(1)} km\n⬆️ *Max:* ${w.main.temp_max}°C | ⬇️ *Min:* ${w.main.temp_min}°C\n\n_Powered by Marco Malik MD Bot 👑_`
                return m.reply(text)
            }

            const res = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, { timeout: 10000 })
            const weather = res.data
            const current = weather.current_condition[0]
            const area = weather.nearest_area[0]

            const text = `🌍 *Weather: ${area.areaName[0].value}, ${area.country[0].value}*\n\n🌡️ *Temperature:* ${current.temp_C}°C (Feels ${current.FeelsLikeC}°C)\n💧 *Humidity:* ${current.humidity}%\n💨 *Wind:* ${current.windspeedKmph} km/h\n☁️ *Condition:* ${current.weatherDesc[0].value}\n👁️ *Visibility:* ${current.visibility} km\n\n_Powered by Marco Malik MD Bot 👑_`

            await m.reply(text)
            await m.react('✅')
        } catch (err) {
            await m.react('❌')
            await m.reply(`❌ Could not get weather for: *${city}*\n\nTry: ${m.prefix}weather Karachi`)
        }
    }
}

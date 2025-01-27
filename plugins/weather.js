// plugins/weather.js

const axios = require('axios');

class WeatherPlugin {
    constructor() {
        this.Options = {
            name: "weather",
            version: "1.0.0",
            author: ["Your Name"],
            description: {
                en: "A plugin to fetch and display current weather information for a given location."
            },
            role: 0,
            category: "utility",
            delay: 0,
            guides: {
                en: "Use the command 'weather <location>' to get the current weather information."
            }
        };

        this.Langs = {
            "en": {
                "no_location": "Please provide a location to get the weather information.",
                "fetching": "Fetching weather information for %1...",
                "error": "Could not fetch weather information. Please try again later.",
                "weather_info": "Current weather in %1: %2°C, %3"
            }
        };
    }

    async Main({ args, Messenger }) {
        if (args.length === 0) {
            return Messenger.reply(this.Langs["en"]["no_location"]);
        }

        const location = args.join(" ");
        Messenger.reply(this.Langs["en"]["fetching"].replace("%1", location));

        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=YOUR_API_KEY`);
            const weatherData = response.data;
            const temperature = weatherData.main.temp;
            const description = weatherData.weather[0].description;

            Messenger.reply(this.Langs["en"]["weather_info"].replace("%1", location).replace("%2", temperature).replace("%3", description));
        } catch (error) {
            Messenger.reply(this.Langs["en"]["error"]);
        }
    }
}

module.exports = WeatherPlugin;

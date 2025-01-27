// plugins/weather_alert.js

const axios = require('axios');

class WeatherAlertPlugin {
    constructor() {
        this.Options = {
            name: "weather_alert",
            version: "1.0.0",
            author: ["Your Name"],
            description: {
                en: "A plugin to provide weather alerts for specified locations."
            },
            role: 0,
            category: "information",
            delay: 0,
            guides: {
                en: "Use the command 'weather_alert <location>' to get weather alerts for the specified location."
            }
        };

        this.Langs = {
            "en": {
                "no_location": "Please provide a location to get weather alerts.",
                "fetching": "Fetching weather alerts for %1...",
                "error": "Could not fetch weather alerts. Please try again later.",
                "no_alerts": "There are no weather alerts for %1 at the moment.",
                "alerts": "Weather alerts for %1:\\\n%2"
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
            const response = await axios.get(`https://api.weatherapi.com/v1/alerts.json?key=YOUR_API_KEY&q=${encodeURIComponent(location)}`);
            const alertData = response.data.alerts;

            if (alertData && alertData.length > 0) {
                const alerts = alertData.map(alert => `- ${alert.headline}: ${alert.description}`).join('\\\n');
                Messenger.reply(this.Langs["en"]["alerts"].replace("%1", location).replace("%2", alerts));
            } else {
                Messenger.reply(this.Langs["en"]["no_alerts"].replace("%1", location));
            }
        } catch (error) {
            Messenger.reply(this.Langs["en"]["error"]);
        }
    }
}

module.exports = WeatherAlertPlugin;

// plugins/time.js

const moment = require('moment-timezone');

class TimePlugin {
    constructor() {
        this.Options = {
            name: "time",
            version: "1.0.0",
            author: ["Your Name"],
            description: {
                en: "A plugin to provide the current time for a specified timezone."
            },
            role: 0,
            category: "utility",
            delay: 0,
            guides: {
                en: "Use the command 'time <timezone>' to get the current time for the specified timezone."
            }
        };

        this.Langs = {
            "en": {
                "no_timezone": "Please provide a timezone to get the current time.",
                "invalid_timezone": "The specified timezone is invalid. Please try again.",
                "current_time": "The current time in %1 is %2."
            }
        };
    }

    Main({ args, Messenger }) {
        if (args.length === 0) {
            return Messenger.reply(this.Langs["en"]["no_timezone"]);
        }

        const timezone = args.join(" ");
        try {
            const currentTime = moment.tz(timezone).format('HH:mm:ss');
            Messenger.reply(this.Langs["en"]["current_time"].replace("%1", timezone).replace("%2", currentTime));
        } catch (error) {
            Messenger.reply(this.Langs["en"]["invalid_timezone"]);
        }
    }
}

module.exports = TimePlugin;

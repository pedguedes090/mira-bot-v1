// plugins/alarm.js

const moment = require('moment-timezone');

class AlarmPlugin {
    constructor() {
        this.Options = {
            name: "alarm",
            version: "1.0.0",
            author: ["Your Name"],
            description: {
                en: "A plugin to set and trigger alarms."
            },
            role: 0,
            category: "utility",
            delay: 0,
            guides: {
                en: "Use the command 'alarm set <time> <message>' to set an alarm."
            }
        };

        this.Langs = {
            "en": {
                "no_time": "Please provide a time for the alarm.",
                "invalid_time": "The specified time is invalid. Please use a valid time format.",
                "alarm_set": "Alarm set for %1: %2",
                "alarm_trigger": "Alarm: %1"
            }
        };

        this.alarms = [];
    }

    Main({ args, Messenger }) {
        if (args.length < 2) {
            return Messenger.reply(this.Langs["en"]["no_time"]);
        }

        const time = args[0];
        const message = args.slice(1).join(" ");

        const alarmTime = moment(time, "HH:mm:ss");
        if (!alarmTime.isValid()) {
            return Messenger.reply(this.Langs["en"]["invalid_time"]);
        }

        const now = moment();
        const duration = alarmTime.diff(now);

        if (duration <= 0) {
            return Messenger.reply(this.Langs["en"]["invalid_time"]);
        }

        this.alarms.push({ time: alarmTime, message });

        Messenger.reply(this.Langs["en"]["alarm_set"].replace("%1", alarmTime.format("HH:mm:ss")).replace("%2", message));

        setTimeout(() => {
            Messenger.reply(this.Langs["en"]["alarm_trigger"].replace("%1", message));
        }, duration);
    }
}

module.exports = AlarmPlugin;

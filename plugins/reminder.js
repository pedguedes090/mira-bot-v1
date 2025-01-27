// plugins/reminder.js

const moment = require('moment-timezone');

class ReminderPlugin {
    constructor() {
        this.Options = {
            name: "reminder",
            version: "1.0.0",
            author: ["Your Name"],
            description: {
                en: "A plugin to set and manage reminders."
            },
            role: 0,
            category: "utility",
            delay: 0,
            guides: {
                en: "Use the command 'reminder <time> <message>' to set a reminder."
            }
        };

        this.Langs = {
            "en": {
                "no_time": "Please provide a time for the reminder.",
                "invalid_time": "The specified time is invalid. Please use a valid time format.",
                "reminder_set": "Reminder set for %1: %2",
                "reminder_trigger": "Reminder: %1"
            }
        };

        this.reminders = [];
    }

    Main({ args, Messenger }) {
        if (args.length < 2) {
            return Messenger.reply(this.Langs["en"]["no_time"]);
        }

        const time = args[0];
        const message = args.slice(1).join(" ");

        const reminderTime = moment(time, "HH:mm:ss");
        if (!reminderTime.isValid()) {
            return Messenger.reply(this.Langs["en"]["invalid_time"]);
        }

        const now = moment();
        const duration = reminderTime.diff(now);

        if (duration <= 0) {
            return Messenger.reply(this.Langs["en"]["invalid_time"]);
        }

        this.reminders.push({ time: reminderTime, message });

        Messenger.reply(this.Langs["en"]["reminder_set"].replace("%1", reminderTime.format("HH:mm:ss")).replace("%2", message));

        setTimeout(() => {
            Messenger.reply(this.Langs["en"]["reminder_trigger"].replace("%1", message));
        }, duration);
    }
}

module.exports = ReminderPlugin;

// plugins/greeting.js

class GreetingPlugin {
    constructor() {
        this.Options = {
            name: "greeting",
            version: "1.0.0",
            author: ["Your Name"],
            description: {
                en: "A plugin to handle basic greeting commands."
            },
            role: 0,
            category: "utility",
            delay: 0,
            guides: {
                en: "Use the command 'greet' to receive a greeting message."
            }
        };

        this.Langs = {
            "en": {
                "greet": "Hello! How can I assist you today?"
            }
        };
    }

    Main({ args, Messenger }) {
        if (args[0] === "greet") {
            Messenger.reply(this.Langs["en"]["greet"]);
        }
    }
}

module.exports = GreetingPlugin;

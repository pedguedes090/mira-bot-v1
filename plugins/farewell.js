// plugins/farewell.js

class FarewellPlugin {
    constructor() {
        this.Options = {
            name: "farewell",
            version: "1.0.0",
            author: ["Your Name"],
            description: {
                en: "A plugin to handle basic farewell commands."
            },
            role: 0,
            category: "utility",
            delay: 0,
            guides: {
                en: "Use the command 'farewell' to receive a farewell message."
            }
        };

        this.Langs = {
            "en": {
                "farewell": "Goodbye! Have a great day!"
            }
        };
    }

    Main({ args, Messenger }) {
        if (args[0] === "farewell") {
            Messenger.reply(this.Langs["en"]["farewell"]);
        }
    }
}

module.exports = FarewellPlugin;

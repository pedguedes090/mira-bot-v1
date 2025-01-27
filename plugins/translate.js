// plugins/translate.js

const axios = require('axios');

class TranslatePlugin {
    constructor() {
        this.Options = {
            name: "translate",
            version: "1.0.0",
            author: ["Your Name"],
            description: {
                en: "A plugin to translate text from one language to another."
            },
            role: 0,
            category: "utility",
            delay: 0,
            guides: {
                en: "Use the command 'translate <source_language> <target_language> <text>' to translate text."
            }
        };

        this.Langs = {
            "en": {
                "no_text": "Please provide the text to translate.",
                "invalid_languages": "The specified languages are invalid. Please provide valid language codes.",
                "fetching": "Translating your text...",
                "error": "An error occurred while translating the text. Please try again later.",
                "translation": "Translation: %1"
            }
        };
    }

    async Main({ args, Messenger }) {
        if (args.length < 3) {
            return Messenger.reply(this.Langs["en"]["no_text"]);
        }

        const [sourceLang, targetLang, ...textArray] = args;
        const text = textArray.join(" ");

        Messenger.reply(this.Langs["en"]["fetching"]);

        try {
            const response = await axios.post('https://api.example.com/translate', {
                source: sourceLang,
                target: targetLang,
                text: text
            }, {
                headers: {
                    'Authorization': 'Bearer YOUR_API_KEY'
                }
            });

            const translation = response.data.translation;

            if (translation) {
                Messenger.reply(this.Langs["en"]["translation"].replace("%1", translation));
            } else {
                Messenger.reply(this.Langs["en"]["error"]);
            }
        } catch (error) {
            Messenger.reply(this.Langs["en"]["error"]);
        }
    }
}

module.exports = TranslatePlugin;

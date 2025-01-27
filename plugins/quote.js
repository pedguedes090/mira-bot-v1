// plugins/quote.js

const axios = require('axios');

class QuotePlugin {
    constructor() {
        this.Options = {
            name: "quote",
            version: "1.0.0",
            author: ["Your Name"],
            description: {
                en: "A plugin to fetch and display a random inspirational quote."
            },
            role: 0,
            category: "fun",
            delay: 0,
            guides: {
                en: "Use the command 'quote' to receive a random inspirational quote."
            }
        };

        this.Langs = {
            "en": {
                "no_quote": "Sorry, I couldn't find a quote for you right now.",
                "fetching": "Fetching an inspirational quote for you...",
                "error": "An error occurred while fetching the quote. Please try again later.",
                "quote": "Here's an inspirational quote for you: \"%1\""
            }
        };
    }

    async Main({ args, Messenger }) {
        if (args[0] === "quote") {
            Messenger.reply(this.Langs["en"]["fetching"]);

            try {
                const response = await axios.get('https://api.quotable.io/random');
                const quoteData = response.data;

                if (quoteData && quoteData.content) {
                    Messenger.reply(this.Langs["en"]["quote"].replace("%1", quoteData.content));
                } else {
                    Messenger.reply(this.Langs["en"]["no_quote"]);
                }
            } catch (error) {
                Messenger.reply(this.Langs["en"]["error"]);
            }
        }
    }
}

module.exports = QuotePlugin;

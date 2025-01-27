// plugins/joke.js

const axios = require('axios');

class JokePlugin {
    constructor() {
        this.Options = {
            name: "joke",
            version: "1.0.0",
            author: ["Your Name"],
            description: {
                en: "A plugin to fetch and display a random joke."
            },
            role: 0,
            category: "fun",
            delay: 0,
            guides: {
                en: "Use the command 'joke' to receive a random joke."
            }
        };

        this.Langs = {
            "en": {
                "no_joke": "Sorry, I couldn't find a joke for you right now.",
                "fetching": "Fetching a joke for you...",
                "error": "An error occurred while fetching the joke. Please try again later.",
                "joke": "Here's a joke for you: %1"
            }
        };
    }

    async Main({ args, Messenger }) {
        if (args[0] === "joke") {
            Messenger.reply(this.Langs["en"]["fetching"]);

            try {
                const response = await axios.get('https://v2.jokeapi.dev/joke/Any');
                const jokeData = response.data;

                let joke;
                if (jokeData.type === "single") {
                    joke = jokeData.joke;
                } else if (jokeData.type === "twopart") {
                    joke = `${jokeData.setup} ... ${jokeData.delivery}`;
                }

                if (joke) {
                    Messenger.reply(this.Langs["en"]["joke"].replace("%1", joke));
                } else {
                    Messenger.reply(this.Langs["en"]["no_joke"]);
                }
            } catch (error) {
                Messenger.reply(this.Langs["en"]["error"]);
            }
        }
    }
}

module.exports = JokePlugin;

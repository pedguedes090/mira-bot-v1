// plugins/dictionary.js

const axios = require('axios');

class DictionaryPlugin {
    constructor() {
        this.Options = {
            name: "dictionary",
            version: "1.0.0",
            author: ["Your Name"],
            description: {
                en: "A plugin to fetch and display word definitions."
            },
            role: 0,
            category: "utility",
            delay: 0,
            guides: {
                en: "Use the command 'define <word>' to get the definition of a word."
            }
        };

        this.Langs = {
            "en": {
                "no_word": "Please provide a word to define.",
                "fetching": "Fetching the definition for '%1'...",
                "error": "An error occurred while fetching the definition. Please try again later.",
                "definition": "Definition of '%1': %2",
                "no_definition": "Sorry, no definition found for '%1'."
            }
        };
    }

    async Main({ args, Messenger }) {
        if (args.length === 0) {
            return Messenger.reply(this.Langs["en"]["no_word"]);
        }

        const word = args[0];
        Messenger.reply(this.Langs["en"]["fetching"].replace("%1", word));

        try {
            const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const definitions = response.data[0].meanings.map(meaning => meaning.definitions.map(def => def.definition)).flat();

            if (definitions.length > 0) {
                const definitionText = definitions.join('; ');
                Messenger.reply(this.Langs["en"]["definition"].replace("%1", word).replace("%2", definitionText));
            } else {
                Messenger.reply(this.Langs["en"]["no_definition"].replace("%1", word));
            }
        } catch (error) {
            Messenger.reply(this.Langs["en"]["error"]);
        }
    }
}

module.exports = DictionaryPlugin;

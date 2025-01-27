// plugins/currency.js

const axios = require('axios');

class CurrencyPlugin {
    constructor() {
        this.Options = {
            name: "currency",
            version: "1.0.0",
            author: ["Your Name"],
            description: {
                en: "A plugin to convert currency values."
            },
            role: 0,
            category: "utility",
            delay: 0,
            guides: {
                en: "Use the command 'convert <amount> <from_currency> <to_currency>' to convert currency values."
            }
        };

        this.Langs = {
            "en": {
                "no_amount": "Please provide an amount to convert.",
                "no_currency": "Please provide both source and target currencies.",
                "fetching": "Converting %1 %2 to %3...",
                "error": "An error occurred while converting the currency. Please try again later.",
                "conversion_result": "%1 %2 is approximately %3 %4."
            }
        };
    }

    async Main({ args, Messenger }) {
        if (args.length < 3) {
            return Messenger.reply(this.Langs["en"]["no_amount"]);
        }

        const [amount, fromCurrency, toCurrency] = args;
        Messenger.reply(this.Langs["en"]["fetching"].replace("%1", amount).replace("%2", fromCurrency).replace("%3", toCurrency));

        try {
            const response = await axios.get('https://api.exchangerate-api.com/v4/latest/' + fromCurrency);
            const rates = response.data.rates;
            const rate = rates[toCurrency];

            if (!rate) {
                return Messenger.reply(this.Langs["en"]["no_currency"]);
            }

            const convertedAmount = (amount * rate).toFixed(2);
            Messenger.reply(this.Langs["en"]["conversion_result"].replace("%1", amount).replace("%2", fromCurrency).replace("%3", convertedAmount).replace("%4", toCurrency));
        } catch (error) {
            Messenger.reply(this.Langs["en"]["error"]);
        }
    }
}

module.exports = CurrencyPlugin;

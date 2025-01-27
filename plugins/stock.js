// plugins/stock.js

const axios = require('axios');

class StockPlugin {
    constructor() {
        this.Options = {
            name: "stock",
            version: "1.0.0",
            author: ["Your Name"],
            description: {
                en: "A plugin to fetch and display stock market information."
            },
            role: 0,
            category: "information",
            delay: 0,
            guides: {
                en: "Use the command 'stock <symbol>' to get the current stock information for the specified symbol."
            }
        };

        this.Langs = {
            "en": {
                "no_symbol": "Please provide a stock symbol to get the information.",
                "fetching": "Fetching stock information for %1...",
                "error": "An error occurred while fetching the stock information. Please try again later.",
                "stock_info": "Current stock information for %1: Price: %2, Change: %3"
            }
        };
    }

    async Main({ args, Messenger }) {
        if (args.length === 0) {
            return Messenger.reply(this.Langs["en"]["no_symbol"]);
        }

        const symbol = args[0].toUpperCase();
        Messenger.reply(this.Langs["en"]["fetching"].replace("%1", symbol));

        try {
            const response = await axios.get(`https://api.example.com/stock/${symbol}`, {
                params: {
                    apiKey: 'YOUR_STOCK_API_KEY'
                }
            });
            const stockData = response.data;
            const price = stockData.price;
            const change = stockData.change;

            Messenger.reply(this.Langs["en"]["stock_info"].replace("%1", symbol).replace("%2", price).replace("%3", change));
        } catch (error) {
            Messenger.reply(this.Langs["en"]["error"]);
        }
    }
}

module.exports = StockPlugin;

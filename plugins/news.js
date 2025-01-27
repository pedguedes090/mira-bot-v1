// plugins/news.js

const axios = require('axios');

class NewsPlugin {
    constructor() {
        this.Options = {
            name: "news",
            version: "1.0.0",
            author: ["Your Name"],
            description: {
                en: "A plugin to fetch and display the latest news headlines."
            },
            role: 0,
            category: "information",
            delay: 0,
            guides: {
                en: "Use the command 'news' to receive the latest news headlines."
            }
        };

        this.Langs = {
            "en": {
                "fetching": "Fetching the latest news headlines for you...",
                "error": "An error occurred while fetching the news. Please try again later.",
                "no_news": "Sorry, I couldn't find any news for you right now.",
                "news_headlines": "Here are the latest news headlines:\\n%1"
            }
        };
    }

    async Main({ args, Messenger }) {
        if (args[0] === "news") {
            Messenger.reply(this.Langs["en"]["fetching"]);

            try {
                const response = await axios.get('https://newsapi.org/v2/top-headlines', {
                    params: {
                        country: 'us',
                        apiKey: 'YOUR_NEWS_API_KEY'
                    }
                });
                const articles = response.data.articles;

                if (articles.length > 0) {
                    const headlines = articles.map(article => `- ${article.title}`).join('\\n');
                    Messenger.reply(this.Langs["en"]["news_headlines"].replace("%1", headlines));
                } else {
                    Messenger.reply(this.Langs["en"]["no_news"]);
                }
            } catch (error) {
                Messenger.reply(this.Langs["en"]["error"]);
            }
        }
    }
}

module.exports = NewsPlugin;

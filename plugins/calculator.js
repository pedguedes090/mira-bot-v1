// plugins/calculator.js

class CalculatorPlugin {
    constructor() {
        this.Options = {
            name: "calculator",
            version: "1.0.0",
            author: ["Your Name"],
            description: {
                en: "A plugin to perform basic arithmetic operations."
            },
            role: 0,
            category: "utility",
            delay: 0,
            guides: {
                en: "Use the command 'calculate <expression>' to evaluate an arithmetic expression."
            }
        };

        this.Langs = {
            "en": {
                "no_expression": "Please provide an arithmetic expression to evaluate.",
                "invalid_expression": "The expression is invalid. Please provide a valid arithmetic expression.",
                "result": "The result of the expression is: %1"
            }
        };
    }

    Main({ args, Messenger }) {
        if (args.length === 0) {
            return Messenger.reply(this.Langs["en"]["no_expression"]);
        }

        const expression = args.join(" ");
        try {
            // Evaluate the expression using the Function constructor
            const result = new Function(`return ${expression}`)();
            Messenger.reply(this.Langs["en"]["result"].replace("%1", result));
        } catch (error) {
            Messenger.reply(this.Langs["en"]["invalid_expression"]);
        }
    }
}

module.exports = CalculatorPlugin;

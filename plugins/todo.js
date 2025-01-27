// plugins/todo.js

class TodoPlugin {
    constructor() {
        this.Options = {
            name: "todo",
            version: "1.0.0",
            author: ["Your Name"],
            description: {
                en: "A plugin to manage a to-do list for users."
            },
            role: 0,
            category: "utility",
            delay: 0,
            guides: {
                en: "Use the command 'todo add <item>' to add an item, 'todo remove <item>' to remove an item, and 'todo list' to list all items."
            }
        };

        this.Langs = {
            "en": {
                "add_success": "Added '%1' to your to-do list.",
                "remove_success": "Removed '%1' from your to-do list.",
                "not_found": "Item '%1' not found in your to-do list.",
                "list_empty": "Your to-do list is empty.",
                "list_items": "Your to-do list:\\n%1"
            }
        };

        this.todoList = [];
    }

    Main({ args, Messenger }) {
        if (args.length === 0) {
            return Messenger.reply("Please specify a command: 'add', 'remove', or 'list'.");
        }

        const command = args[0].toLowerCase();
        const item = args.slice(1).join(" ");

        if (command === "add") {
            if (!item) {
                return Messenger.reply("Please specify an item to add.");
            }
            this.todoList.push(item);
            Messenger.reply(this.Langs["en"]["add_success"].replace("%1", item));
        } else if (command === "remove") {
            const index = this.todoList.indexOf(item);
            if (index === -1) {
                return Messenger.reply(this.Langs["en"]["not_found"].replace("%1", item));
            }
            this.todoList.splice(index, 1);
            Messenger.reply(this.Langs["en"]["remove_success"].replace("%1", item));
        } else if (command === "list") {
            if (this.todoList.length === 0) {
                return Messenger.reply(this.Langs["en"]["list_empty"]);
            }
            const list = this.todoList.map((todo, index) => `${index + 1}. ${todo}`).join("\\n");
            Messenger.reply(this.Langs["en"]["list_items"].replace("%1", list));
        } else {
            Messenger.reply("Unknown command. Please use 'add', 'remove', or 'list'.");
        }
    }
}

module.exports = TodoPlugin;

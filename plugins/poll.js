// plugins/poll.js

class PollPlugin {
    constructor() {
        this.Options = {
            name: "poll",
            version: "1.0.0",
            author: ["Your Name"],
            description: {
                en: "A plugin to create and participate in polls."
            },
            role: 0,
            category: "utility",
            delay: 0,
            guides: {
                en: "Use the command 'poll create <question> | <option1> | <option2> ...' to create a poll, and 'poll vote <poll_id> <option_number>' to vote."
            }
        };

        this.Langs = {
            "en": {
                "no_command": "Please specify a command: 'create' or 'vote'.",
                "create_success": "Poll created successfully! Poll ID: %1",
                "vote_success": "Your vote has been recorded.",
                "invalid_poll_id": "Invalid poll ID. Please try again.",
                "invalid_option": "Invalid option number. Please try again.",
                "poll_not_found": "Poll not found. Please check the poll ID.",
                "poll_closed": "This poll is closed and cannot accept more votes.",
                "poll_results": "Poll Results for '%1':\\n%2"
            }
        };

        this.polls = {};
        this.pollCounter = 0;
    }

    Main({ args, Messenger }) {
        if (args.length === 0) {
            return Messenger.reply(this.Langs["en"]["no_command"]);
        }

        const command = args[0].toLowerCase();

        if (command === "create") {
            const pollData = args.slice(1).join(" ").split("|").map(item => item.trim());
            if (pollData.length < 3) {
                return Messenger.reply("Please provide a question and at least two options.");
            }

            const [question, ...options] = pollData;
            const pollId = ++this.pollCounter;
            this.polls[pollId] = {
                question,
                options,
                votes: Array(options.length).fill(0),
                open: true
            };

            Messenger.reply(this.Langs["en"]["create_success"].replace("%1", pollId));
        } else if (command === "vote") {
            const [pollIdStr, optionStr] = args.slice(1);
            const pollId = parseInt(pollIdStr, 10);
            const optionIndex = parseInt(optionStr, 10) - 1;

            const poll = this.polls[pollId];
            if (!poll) {
                return Messenger.reply(this.Langs["en"]["poll_not_found"]);
            }

            if (!poll.open) {
                return Messenger.reply(this.Langs["en"]["poll_closed"]);
            }

            if (isNaN(optionIndex) || optionIndex < 0 || optionIndex >= poll.options.length) {
                return Messenger.reply(this.Langs["en"]["invalid_option"]);
            }

            poll.votes[optionIndex]++;
            Messenger.reply(this.Langs["en"]["vote_success"]);
        } else if (command === "results") {
            const pollId = parseInt(args[1], 10);
            const poll = this.polls[pollId];
            if (!poll) {
                return Messenger.reply(this.Langs["en"]["poll_not_found"]);
            }

            const results = poll.options.map((option, index) => `${option}: ${poll.votes[index]} votes`).join("\\n");
            Messenger.reply(this.Langs["en"]["poll_results"].replace("%1", poll.question).replace("%2", results));
        } else {
            Messenger.reply(this.Langs["en"]["no_command"]);
        }
    }
}

module.exports = PollPlugin;

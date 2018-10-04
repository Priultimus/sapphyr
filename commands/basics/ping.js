var { Command } = require("discord.js-commando");
module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: "ping",
            description: "Checks the bot's ping.",
            group: "basics",
            memberName: "ping"
        });
    }

    async run(msg) {
        let pingMsg = await msg.channel.send("🔁 | Pinging ...");
        return await pingMsg.edit(`✅ | ${Date.now() - pingMsg.createdAt.getMilliseconds()}ms.`);
    }
};

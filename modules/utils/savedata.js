module.exports = class SaveDataCommand extends global.utils.baseCommand {
	constructor(client) {
		super(client, {
			name: "savedata",
			description: "Saves some data for this guild",
			group: "utils",
			memberName: "savedata",
			userPermissions: ["ADMINISTRATOR"],
			clientPermissions: ["SEND_MESSAGES"],
			args: [
				{
					key: "key",
					prompt: "Key to store the data under",
					type: "string",
					default: "data",
				},
				{
					key: "value",
					prompt: "Value to store",
					type: "string",
				},
			],
		});
	}

	async task(ctx) {
		await ctx.db.set(ctx.args.key, ctx.args.value);
		await ctx.message.channel.send("Data successfully saved!");
	}
};

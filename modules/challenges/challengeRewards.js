const toTitleCase = str => str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

module.exports = class ChallengeRewards extends global.utils.baseCommand {
	constructor(client) {
		super(client, {
			name: "challengerewards",
			memberName: "challengerewards",
			aliases: ["chrews"],
			userPermissions: ["ADMINISTRATOR"],
			clientPermissions: ["SEND_MESSAGES"],
			group: "challenges",
			description: "Set/get/remove a challenge reward for one of 3 difficulties.",
			args: [
				{
					key: "action",
					prompt: "Set, get or remove a challenge reward.",
					type: "string",
					oneOf: ["set", "get", "remove"]
				},
				{
					key: "difficulty",
					prompt: "Name of the difficulty",
					type: "string",
					default: ""
				},
				{
					key: "amount",
					prompt: "Amount to reward for the challenge difficulty level.",
					type: "integer",
					default: ""
				}
			]
		});
	}
	async task(ctx) {
		const challengeData = await ctx.db.get("challengeData") || await ctx.db.set("challengeData", { rewards: {} });
		if (!challengeData.rewards) challengeData.rewards = {};
		if (ctx.args.action === "set") {
			if (typeof ctx.args.amount !== "number")
				return ctx.send("Invalid amount specified.");
			if (ctx.args.amount < 1)
				return ctx.send("Challenge reward can't be lesser than or equal to 0.");
			if (!ctx.args.difficulty)
				return ctx.send("Invalid difficulty specified.");
			else if (ctx.args.amount > Number.MAX_SAFE_INTEGER)
				return ctx.send(`Challenge reward can't be greater than ${Number.MAX_SAFE_INTEGER}`);
			challengeData.rewards[ctx.args.difficulty.toLowerCase()] = ctx.args.amount;
			await ctx.db.set("challengeData", challengeData);
			return ctx.send(`Successfully set challenge reward for ${toTitleCase(ctx.args.difficulty.toLowerCase())} to ${ctx.args.amount}.`);
		}
		else if (ctx.args.action === "get") {
			if (Object.keys(challengeData.rewards).length < 1)
				return ctx.send("No challenge rewards set.");
			const rewards = Object.entries(challengeData.rewards).map(([difficulty, reward]) => reward ? `${toTitleCase(difficulty)}: ${reward}` : "");
			return ctx.send(rewards.filter(reward => reward || false).join("\n"));
		}
		else if (ctx.args.action === "remove") {
			if (!Object.keys(challengeData.rewards).includes(ctx.args.difficulty.toLowerCase()))
				return ctx.send("Invalid difficulty specified.");
			delete challengeData.rewards[ctx.args.difficulty.toLowerCase()];
			await ctx.db.set("challengeData", challengeData);
			return ctx.send(`Successfully removed challenge reward for ${toTitleCase(ctx.args.difficulty)}.`);
		}
	}
};

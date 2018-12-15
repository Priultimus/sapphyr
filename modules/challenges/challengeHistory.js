const toTitleCase = str => str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
const chunk = (a, l) => a.length === 0 ? [] : [a.slice(0, l)].concat(chunk(a.slice(l), l));

module.exports = class ChallengeHistoryCommand extends global.utils.baseCommand {
	constructor(client) {
		super(client, {
			name: "challengehistory",
			memberName: "challengehistory",
			aliases: ["chhis"],
			group: "challenges",
			description: "Get challenge history of a user.",
			clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			guildOnly: true,
			args: [
				{
					key: "user",
					prompt: "User to get the challenge history of.",
					type: "user",
					default: "self"
				}
			]
		});
	}
	async task(ctx) {
		const challengeData = await ctx.db.get("challengeData") || await ctx.db.set("challengeData", {});
		if (typeof challengeData.users !== "object") {
			challengeData.users = {};
			await ctx.db.set("challengeData", challengeData);
		}
		const { users } = challengeData;
		const user = ctx.args.user === "self" ? ctx.user : ctx.args.user;
		if (!Object.keys(users).includes(user.id))
			return ctx.send("No challenge data found.");
		if (!Array.isArray(users[user.id]))
			return ctx.send("Invalid challenge data stored.");
		if (users[user.id].length < 1)
			return ctx.send("No challenge history found!");
		const result = await ctx.nadekoConnector.getBotInfo();
		if (result.error) {
			console.log(`[Error] NadekoConnector: ${result.message}`);
			return ctx.send("Unable to get bot information.");
		}
		const sign = result.bot.currency.sign;
		const fields = users[user.id].map(entry => {
			const approver = this.client.users.get(entry.approver.id) || entry.approver;
			return {
				name: `Challenge #${entry.challenge.id}: [${toTitleCase(entry.challenge.difficulty)}] ${entry.challenge.challenge}`,
				value: [
					`**Submitted on**: ${new Date(entry.timestamp).toISOString().replace(/[TZ]/g, " ")}`,
					`**Approved by**: ${approver.tag} (${approver.id})`,
					`**Rewarded with**: ${entry.challenge.reward} ${sign}`
				].join("\n"),
				inline: false
			};
		}).reverse();
		return new global.utils.fieldPaginator(ctx.channel, ctx.user, fields, 15, {
			numberFields: true, embedTemplate: { title: `Challenge history of ${user.tag}` }
		});
	}
};

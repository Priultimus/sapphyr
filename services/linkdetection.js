var fs = require("fs");
var regex = require("../localdata/regex.json");
var diepregex = RegExp(regex.diep);
var Discord = require('discord.js');
var datahandler = require('../utils/datahandler.js');
module.exports = {
	name: "Link detection service",
	description: "Creates an embed for party invites.",
	type: "event",
	on: {
		message: async function (message) {
			let notes = message.content.split(" ");
			let args = notes.slice(0);
			try {
			if (message.author.bot) return;
			if (diepregex.test(args[0])) {
				function clearLink () {
					global.client.datahandler.remove1Link();
				}
				var link = args[0];
				if (link.substr(0, 8) !== 'https://') {
					link = 'https://' + args[0];
				}
				 notes = args.slice(1).join(" ");
				if (notes.length < 1) {
					notes = 'No informtion provided.'
				};
				var linkchannel = client.channels.get('508478089072738314');
				var insert = { name: message.member.user.tag, notes: message.content.split(" ").slice(1).join(" "), link: link }
 				var embed = new Discord.RichEmbed()
				.setColor(0x0000FF)
				.setTitle(message.member.user.tag)
				.addField('Party invite', notes)
				.addField('Members', message.member.user.tag)
				.setFooter('React with 🔗 to recieve the link, \nReact with ☠ if the link is invalid, \n And react with ⚠ if there is a troller present. \n Be aware that false alarms are punishable.')
				await global.client.datahandler.insertLink(insert);
				message.delete(1000);
				linkchannel.send({embed}).then(function (message) {message.react('🔗')});
				message.channel.send('Your link has successfully been posted.').then(message => {message.delete(5000)});
			}
	}catch(e) {
		console.error(e);
	}
	}
}
};
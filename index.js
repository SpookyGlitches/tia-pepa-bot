require("dotenv").config();

const { Client: DiscordClient } = require("discord.js");
const {
	ComprehendClient,
	DetectSentimentCommand,
} = require("@aws-sdk/client-comprehend");

const client = new DiscordClient({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const AWSClient = new ComprehendClient({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

const gifSources = [
	"https://64.media.tumblr.com/0152a92598204b55716926c16f01a4f6/3b997f335a5f24fe-cb/s640x960/8f0091d3b85de50081e1d152d9dea03a9aa2294e.gif",
	"https://i.pinimg.com/originals/e7/20/c1/e720c1ed9b7db4a371b9d0d875cfbb00.gif",
];

client.on("ready", async () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
	if (message.author.bot) return;

	const params = {
		LanguageCode: "en",
		Text: message.content,
	};

	const embed = {
		image: {
			url:
				Math.random() < 0.5
					? gifSources[0]
					: gifSources[1],
		},
		color: "#f8a20b",
		description: `Here's my handy line for you!`,
		title: `Keep calm ✨`,
		footer: {
			text: `- Pepa Madrigal, Encanto `,
		},
	};

	try {
		const command = new DetectSentimentCommand(params);
		const { Sentiment, SentimentScore } = await AWSClient.send(
			command
		);
		if (
			Sentiment === "NEGATIVE" &&
			SentimentScore.Negative >= 0.5
		) {
			// this guy is probably mad
			await message.reply({
				embeds: [embed],
			});
		}
	} catch (err) {
		console.log(err);
	}
});

client.login(process.env.BOT_TOKEN);

const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const { WebHookListener } = require('twitch-webhooks');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
    client.channels.cache.get('956280063073083462').send("@everyone https://www.twitch.tv/esl_csgo")

});

// Login to Discord with your client's token
client.login(token);
const { MessageEmbed, Client, Intents } = require('discord.js');
const { DiscordToken, TwitchClientId, TwitchClientSecret, Interval, DiscordChannel, TaggedRole } = require('./config.json');
const axios = require('axios')

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

var streamers = [{streamer: "riotgames", live: false},{streamer: "esl_csgo", live: false},{streamer: "ocority", live: true},{streamer: "evo_monkey_x", live: false},{streamer: "bosf_esports", live: false},{streamer: "realmwizard", live: false},{streamer: "scrake_killer", live: false} ];
var url ="";

function Embed(obj,pfp) {
	return new MessageEmbed()
	.setColor('#0099ff')
	.setTitle(obj.title)
	.setURL('https://twitch.tv/'+ obj.user_login)
	.setAuthor({ name: obj.user_name, iconURL: pfp, url:  'https://twitch.tv/'+ obj.user_login})
	.addField('Game', obj.game_name, true)
	.addField('Viewers', obj.viewer_count.toString(), true)
	.setImage('https://static-cdn.jtvnw.net/previews-ttv/live_user_' + obj.user_login +'-1920x1080.jpg');
}


function CheckStreamers() {
	setInterval(function() {
		axios.get('https://api.twitch.tv/helix/streams?' + url, {
			headers: {
				"Authorization": 'Bearer ' + twitchToken, 
				"Client-ID": TwitchClientId
			}
			}).then(function (response) {
				streamers.forEach(streamer=> {
					var live = false;
					response.data.data.forEach(twitchData=> {
						if(twitchData.user_login == streamer.streamer){
							live = true;
							if(streamer.live == false){
								axios.get('https://api.twitch.tv/helix/users?id=' + twitchData.user_id, {
								headers: {
									"Authorization": 'Bearer ' + twitchToken, //the token is a variable which holds the token
									"Client-ID": TwitchClientId
								}}).then(function (response) {
									client.channels.cache.get(DiscordChannel).send({ content: "Hey, @"+ TaggedRole + " " + twitchData.user_name + ", is live! https://twitch.tv/"+ twitchData.user_login,embeds: [Embed(twitchData, response.data.data[0].profile_image_url)] })
								});
							}
							streamer.live = true;
						}
					})
					streamer.live = false;
				})
			})
	}, Interval * 1000);
}

function RenewToken() {
	setInterval(function() {
		axios.post('https://id.twitch.tv/oauth2/token?client_id=' + TwitchClientId + '&client_secret='+ TwitchClientSecret +'&grant_type=client_credentials'
		).then(function (response) {
		 twitchToken = response.data.access_token;
	   })
	}, 1728000000);
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
	axios.post('https://id.twitch.tv/oauth2/token?client_id=' + TwitchClientId + '&client_secret='+ TwitchClientSecret +'&grant_type=client_credentials'
	   ).then(function (response) {
		twitchToken = response.data.access_token;
	  })
	streamers.map(x => url = url + "user_login=" + x.streamer + "&");
	CheckStreamers();
	RenewToken();

});

// Login to Discord with your client's token
client.login(DiscordToken);
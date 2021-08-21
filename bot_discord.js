const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios');

const { urlCheck } = require('./helpers')

module.exports = bot_discord = () => {

  client.on('ready', () => { console.log(`Discord bot: Logged in as ${client.user.tag}!`) });

  // Listens for every message
  client.on('message', msg => {

    // Check and filter URL
    const url = urlCheck(msg.content);

    // Fires on every link longer than 32 characters
    if (!msg.author.bot && url && url.length > 32) {

      // Send GoTiny link in chat
      axios.post('https://gotiny.cc/api', { long: url })
        .then(res => client.channels.cache.get(msg.channel.id).send(res.data.tiny));
    };

  });

  client.login(process.env.DISCORD_TOKEN);

}
import Discord, { Client, Intents } from 'discord.js';
const client = new Discord.Client();

import dotenv from 'dotenv';

dotenv.config()

client.on('ready', () => {
    console.log(`Logged in as ${client.user ? client.user.tag : "null"}!`);
});

client.on('message', message => {
    if (message.content === 'ping') {
        message.channel.send('pong');
    }
});

client.login(process.env.DISCORD_TOKEN);
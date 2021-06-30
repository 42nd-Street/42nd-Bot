import Discord, { Client, Intents } from 'discord.js';
const client = new Discord.Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES]});

import dotenv from 'dotenv';

dotenv.config()

const DevIDs = ["170960451704717312"/*dislocated*/, "428934780764160010"/*tomkettle*/]

client.on('ready', () => {
    console.log(`Logged in as ${client.user ? client.user.tag : "null"}!`);
});

client.on('message', async message => {
    if (message.content === 'ping') { //Debug test code, see if its still breathing
        message.channel.send('pong');
        console.log('pong');
        return;
    }
    if (message.content === '~registerslashcommands') { //Register slash commands
        if (!DevIDs.includes(message.author.id)) return; // Check if author is a bot dev
        await registerSlashCommands(message);
        return;
    }
});

client.on('interaction', async interaction => { // stolen from https://deploy-preview-638--discordjs-guide.netlify.app/interactions/replying-to-slash-commands.html
	if (!interaction.isCommand()) return;

    console.log("Command called: "+interaction.commandName);

	if (interaction.commandName === 'ping') await interaction.reply('Pong!');
    // Calls to other command functions go here. Unless your command is a very simple single line (such as with /ping), please call a seperate function
});

client.login(process.env.DISCORD_TOKEN);

async function registerSlashCommands(message: Discord.Message){
    // see https://deploy-preview-638--discordjs-guide.netlify.app/interactions/registering-slash-commands.html
    
    // IMPORTANT: Remember to give the bot perms to create slash commands w/ the oauth page (application.commands privileges)

    await client.application?.fetch();
    
    // Please add your command name & description here. 
    const data = [
        {
            name: 'ping',
            description: 'Test command, replies with pong.',
        } // ,
        // {
        //     name: '',
        //     description: '',
        // },
    ];

    const commands = await client.application?.commands.set(data);
    console.log(commands);

    message.reply("Added commands");
}

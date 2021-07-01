import Discord, { Client, Intents } from 'discord.js';
const client = new Discord.Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES]});

import dotenv from 'dotenv';

dotenv.config()

const DevIDs = ["170960451704717312"/*dislocated*/, "428934780764160010"/*tomkettle*/]

const messageHandlers: {name: string; match: (msg: Discord.Message) => boolean; execute: (msg: Discord.Message) => void}[] = [
    {
        "name": "nice autoreply", //name for our reference only
        "match": niceMatch,
        "execute": niceExecute
    },
    {
        "name": "woob autoreply",
        "match": woobMatch,
        "execute": woobExecute
    }
];

function AutoreplyEmbedsGen(name:string, imgurl:string, msg:Discord.Message){
    const embed = new Discord.MessageEmbed()
        .setImage(imgurl)
        .setFooter(name+" from "+msg.author.username); // Can put a link here if we want (idk what)
    return { embeds: [embed] };
}

function niceMatch(msg: Discord.Message):boolean {
    if (msg.content.toLowerCase() === "nice") return true;
    else return false;
}
function niceExecute(msg: Discord.Message) {
    // Note: As of writing (1/7/21) info on the new embed sytem is not properly documented
    msg.channel.send(AutoreplyEmbedsGen("Nice", "https://cdn.discordapp.com/attachments/367021334217359361/455826116943413262/nice.png", msg))
    msg.delete();
}

function woobMatch(msg: Discord.Message):boolean {
    if (msg.content.toLowerCase() === "woob") return true;
    else return false;
}
function woobExecute(msg: Discord.Message) {
    msg.channel.send(AutoreplyEmbedsGen("WOOB", "https://cdn.discordapp.com/attachments/367021334217359361/587651957368291331/woobSmall.png", msg))
    msg.delete();
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user ? client.user.tag : "null"}!`);
});

client.on('message', async message => {
    if (message.content === 'ping') { //Debug test code, see if its still breathing, plz don't touch
        message.channel.send('pong');
        console.log('pong');
        return;
    }
    if (message.content === '~registerslashcommands') { //Register slash commands
        if (!DevIDs.includes(message.author.id)) return; // Check if author is a bot dev
        await registerSlashCommands(message);
        return;
    }

    messageHandlers.forEach(handler => {
        if (handler.match(message)){
            handler.execute(message);
        }
    });
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

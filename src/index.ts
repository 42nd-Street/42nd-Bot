import Discord, { Client, Collection, Intents, Message } from 'discord.js';
const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });

import dotenv from 'dotenv';
import {msgEvent} from './shared/events'

dotenv.config()

const DevIDs: string[] = process.env.DISCORD_ADMIN_IDS?.split(", ")!;

const commands: Collection<(msg: Message)=> boolean, (event: msgEvent) => any> = new Collection();

const slashCommandHandlers: { command: string; execute: (interaction: Discord.CommandInteraction) => void }[] = [
    {
        "command": "ping",
        "execute": pingExecute
    },
    {
        "command": "admintest",
        "execute": admintestExecute
    }
];

import fs from 'fs'

fs.readdir('./dist/commands/message', (err, allFiles) => {
    if (err) console.log(err);

    let files = allFiles.filter(f => f.split('.').pop() === ('js')); // ignore .js.map files

    if (files.length <= 0) console.log('No commands found!');
    else for (let file of files) {
        const props = require(`./commands/message/${file}`) as { match: (msg: Message) => boolean, run: (event: msgEvent) => any };
        commands.set(props.match, props.run);
    }
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user ? client.user.tag : "null"}!`);
});

client.on('messageCreate', async msg => {
    if (msg.content === 'alive?') { //Debug test code, see if its still breathing, plz don't touch
        msg.reply('yes');
        return;
    }

    if (msg.content === '~registerslashcommands') { //Register slash commands
        if (!DevIDs.includes(msg.author.id)) {
            msg.reply("Not Dev")
            return; // Check if author is a bot dev
        }
        await registerSlashCommands(msg);
        return;
    }

    // Command handler
    const commandModule = commands.find((_run, match) => match(msg))
    if (commandModule) commandModule({ msg, client })

});

client.on('interaction', async interaction => { // stolen from https://deploy-preview-638--discordjs-guide.netlify.app/interactions/replying-to-slash-commands.html
    if (!interaction.isCommand()) return;

    console.log("Command called: " + interaction.commandName);

    slashCommandHandlers.forEach(handler => {
        if (interaction.commandName === handler.command) {
            handler.execute(interaction);
        }
    })
});

client.login(process.env.DISCORD_TOKEN);

async function registerSlashCommands(msg: Discord.Message) {
    // see https://deploy-preview-638--discordjs-guide.netlify.app/interactions/registering-slash-commands.html

    // IMPORTANT: Remember to give the bot perms to create slash commands w/ the oauth page (application.commands privileges)

    await client.application?.fetch();

    // Please add your command name & description here. 
    const data = [
        {
            name: 'ping',
            description: 'Test command, replies with pong.',
        },
        {
            name: 'admintest',
            description: 'Test command, see if you\'ve been set as a bot developer',
        },
    ];

    const commands = await client.application?.commands.set(data);
    console.log(commands);

    msg.reply("Added commands");
}

function admintestExecute(interaction: Discord.CommandInteraction) {
    if (DevIDs.includes(interaction.user.id.toString())) {
        interaction.reply(`Yes, you are an admin.(ID: ${interaction.user.id.toString()}, Dev IDs: ${JSON.stringify(DevIDs)})`);
    }
    else {
        interaction.reply(`Nope, not an admin. (ID: ${interaction.user.id.toString()}, Dev IDs: ${JSON.stringify(DevIDs)})`);
    }
}
function pingExecute(interaction: Discord.CommandInteraction) {
    interaction.reply("Pong!");
}
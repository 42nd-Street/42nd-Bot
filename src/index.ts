import Discord, { ApplicationCommandData, Collection, DiscordAPIError, Message, Snowflake, Intents } from 'discord.js';
const client = new Discord.Client(
    {
        intents: new Intents([
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.DIRECT_MESSAGES,
            Intents.FLAGS.GUILD_VOICE_STATES])
    });

import dotenv from 'dotenv';
import { cmdEvent, msgEvent } from '@interactions/interfaces'
import { GetFilesRec, FilterByExt } from '@shared/files'

require('console-stamp')(console);

dotenv.config()

export const DevIDs: string[] = process.env.DISCORD_ADMIN_IDS?.split(", ")!;
const Dev: boolean = process.env.NODE_ENV === "development"

const messageReplies: Collection<(msg: Message) => boolean, (event: msgEvent) => any> = new Collection();
const slashCommands: Collection<ApplicationCommandData, (event: cmdEvent) => any> = new Collection();


function SetupMessageHandlers() {
    let files = FilterByExt(GetFilesRec('./dist/commands/message'), '.js'); // get all .js files

    if (files.length <= 0) {
        console.log('No message handlers found!');
    }
    else {
        for (let file of files) {
            const props = require(`./commands/${file}`) as { match: (msg: Message) => boolean, run: (event: msgEvent) => any };
            messageReplies.set(props.match, props.run);
        }
    }
}

function SetupSlashHandlers() {
    let files = FilterByExt(GetFilesRec('./dist/commands/slash'), '.js'); // get all .js files

    if (files.length <= 0) {
        console.log('No slash commands found!');
    }
    else {
        for (let file of files) {
            const props = require(`./commands/${file}`) as { data: ApplicationCommandData, run: (event: cmdEvent) => any };
            slashCommands.set(props.data, props.run);
        }
    }

    console.log(files)
    console.log(slashCommands)
}

SetupMessageHandlers();
SetupSlashHandlers();

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
    const commandModule = messageReplies.find((_run, match) => match(msg));
    if (commandModule) {
        try {
            commandModule({ msg, client });
        } catch (err) {
            let willThrow = true;
            if (err instanceof DiscordAPIError) {
                console.warn(`${err.message}: in ${msg.guild?.name}:${msg.channel.id} when executing ${commandModule.name} for message: ${msg.content}`);
                willThrow = false;
            }
            if (willThrow) { throw err }
        }
    }
});

client.on('interactionCreate', async interaction => { // stolen from https://deploy-preview-638--discordjs-guide.netlify.app/interactions/replying-to-slash-commands.html
    if (!interaction.isCommand()) return;

    console.log("Command called: " + interaction.commandName);

    const commandModule = slashCommands.find((_run, data) => interaction.commandName === data.name);
    if (commandModule) commandModule({ interaction, client });

});

async function registerSlashCommands(msg: Discord.Message) {
    // see https://deploy-preview-638--discordjs-guide.netlify.app/interactions/registering-slash-commands.html

    // IMPORTANT: Remember to give the bot perms to create slash commands using the oauth page (application.commands privileges)

    await client.application?.fetch();

    let data: Discord.ApplicationCommandData[] = [];

    for (const v of slashCommands.entries()) {
        data.push(v[0] as ApplicationCommandData);
    }

    // Setting global commands can take up to an hour so this should speed up the process.
    // see: https://gist.github.com/advaith1/287e69c3347ef5165c0dbde00aa305d2#global-commands

    if (!Dev) {
        // Set commands as global
        await client.application?.commands.set(data);
    }
    else {

        // set a custom test server or our default (leaving this here for convienience)
        const guildID: Snowflake = msg.guild?.id || `${BigInt(process.env.DISCORD_TEST_GUILDID || '859489322587521054')}`;
        // Set commands as test server-only
        const guild = await client.guilds.fetch(guildID);

        // clear commands just in case
        try {
            const commands = await guild.commands.fetch()
            for (const command of commands.values()) {
                command.delete();
            }
        }
        catch (err) {
            if (err instanceof DiscordAPIError) {
                console.warn(err.message);
            }
            else {
                throw err;
            }
        }


        const commands = await guild.commands.set(data);
        console.log(commands);
    }

    console.log(`Set commands in${Dev ? '\x1b[36m dev' : '\x1b[33m prod'}\x1b[0m mode`)
    msg.reply("Added commands");
}

client.login(process.env.DISCORD_TOKEN);
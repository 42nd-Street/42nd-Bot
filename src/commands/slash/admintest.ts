import { cmdEvent } from '@interactions/interfaces'
import { DevIDs } from 'index'
import { ApplicationCommandData } from 'discord.js';

export const data: ApplicationCommandData = {
    name: "admintest",
    description: "Checks if you are an admin."
}

export function run(e: cmdEvent) {
    if (DevIDs.includes(e.interaction.user.id.toString())) {
        e.interaction.reply(`Yes, you are an admin.(ID: ${e.interaction.user.id.toString()}, Dev IDs: ${JSON.stringify(DevIDs)})`);
    }
    else {
        e.interaction.reply(`Nope, not an admin. (ID: ${e.interaction.user.id.toString()}, Dev IDs: ${JSON.stringify(DevIDs)})`);
    }
}
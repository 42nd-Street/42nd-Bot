import { ApplicationCommandData, ApplicationCommandOptionType } from "discord.js";
import { cmdEvent } from "@interactions/interfaces";
import { subscriptions } from "@voice/subscription";
import { userInCorrectChannel } from "@interactions/utils";
import { notInVc } from "@shared/interactions/responses";


export const data : ApplicationCommandData = {
    name: "jump",
    description: "Jumps to a specific position in the queue",
    options: [{
        name: "index",
        description: "the index of the track",
        type: 'INTEGER',
        required: true
    }]
}

export async function run(e: cmdEvent) {
    
    if (!e.interaction.guildId) return;

    const subscription = subscriptions.get(e.interaction.guildId);

    if (!subscription) {
        await notInVc(e);
        return;
    }

    if (!userInCorrectChannel(e, subscription)) return;

    const input = e.interaction.options.get("index",true).value as number;

    try {
        subscription.jump(input);
        e.interaction.reply(`Jumped to ${input}`)
    }
    catch (err) {
        console.warn(err);
        e.interaction.reply('Failed to jump');
    }
}
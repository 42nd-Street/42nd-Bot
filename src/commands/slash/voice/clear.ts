import { ApplicationCommandData } from "discord.js";
import { cmdEvent } from '@interactions/interfaces'
import { subscriptions } from "@shared/voice/subscription";
import { userInCorrectChannel } from "@interactions/utils";

export const data: ApplicationCommandData = {
    name: "clear",
    description: "Stop playing the current track and clear the queue."
}

export async function run(e: cmdEvent) {
    if (!e.interaction.guildId) return;

    const subscription = subscriptions.get(e.interaction.guildId)
    
    if (!subscription) {
        await e.interaction.reply('Not in a voice channel!');
        return;
    }
    
    if (!userInCorrectChannel(e, subscription)) return;

    subscription.stop();
    await e.interaction.reply(`Cleared the queue!`);
    subscription.queueLock = false;
}
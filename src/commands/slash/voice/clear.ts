import { ApplicationCommandData } from "discord.js";
import { cmdEvent } from '@shared/interfaces'
import { subscriptions } from "@shared/voice/subscription";

export const data: ApplicationCommandData = {
    name: "clear",
    description: "Stop playing the current track and clear the queue."
}

export async function run(e: cmdEvent) {
    if (!e.interaction.guildId) return;
    const subscription = subscriptions.get(e.interaction.guildId);

    if (subscription) {
        subscription.stop();
        await e.interaction.reply(`Cleared the queue!`);
        subscription.queueLock = false;
    }
    else {
        await e.interaction.reply('Not in a voice channel!');
    }
}
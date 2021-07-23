import { ApplicationCommandData } from "discord.js";
import { cmdEvent } from '@shared/interfaces'

import { subscriptions } from "@shared/voice/subscription";

export const data: ApplicationCommandData = {
    name: "leave",
    description: "Leave the current voice channel."
}

export async function run(e: cmdEvent) {
    if (!e.interaction.guildId) return;

    const subscription = subscriptions.get(e.interaction.guildId);

    if (subscription) {
        subscription.voiceConnection.destroy();
        subscriptions.delete(e.interaction.guildId)
        await e.interaction.reply('Left channel!')
    }
    else {
        await e.interaction.reply('Not in a voice channel!');
    }
}
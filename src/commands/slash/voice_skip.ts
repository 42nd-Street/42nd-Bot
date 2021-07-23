import { ApplicationCommandData } from "discord.js";
import { cmdEvent } from "@shared/interfaces";
import { subscriptions } from "@voice/subscription";

export const data: ApplicationCommandData = {
    name: 'skip',
    description: 'Skips the current track'
}

export async function run(e: cmdEvent) {
    if (!e.interaction.guildId) return;
    
    const subscription = subscriptions.get(e.interaction.guildId);

    if (subscription) {
        // Calling .stop() on an AudioPlayer causes it to transition into the Idle state. Because of a state transition
        // listener defined in music/subscription.ts, transitions into the Idle state mean the next track from the queue
        // will be loaded and played.
        subscription.audioPlayer.stop();
        await e.interaction.reply('Skipped song!');
    } else {
        await e.interaction.reply('Not playing in this server!');
    }
}
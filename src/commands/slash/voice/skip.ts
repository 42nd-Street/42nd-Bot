import { ApplicationCommandData } from "discord.js";
import { cmdEvent } from "@interactions/interfaces";
import { subscriptions } from "@voice/subscription";
import { userInCorrectChannel } from "@interactions/utils";

export const data: ApplicationCommandData = {
    name: 'skip',
    description: 'Skips the current track'
}

export async function run(e: cmdEvent) {
    if (!e.interaction.guildId) return;

    const subscription = subscriptions.get(e.interaction.guildId);

    if (!subscription) {
        await e.interaction.reply('Not in a voice channel!');
        return;
    }

    if (!userInCorrectChannel(e, subscription)) return;
    
    // Calling .stop() on an AudioPlayer causes it to transition into the Idle state. Because of a state transition
    // listener defined in music/subscription.ts, transitions into the Idle state mean the next track from the queue
    // will be loaded and played.
    subscription.audioPlayer.stop();
    await e.interaction.reply('Skipped song!');
}
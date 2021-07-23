import { ApplicationCommandData } from "discord.js";
import { cmdEvent } from '@shared/interfaces'
import { subscriptions } from "@shared/voice/subscription";

export const data: ApplicationCommandData = {
    name: "resume",
    description: "Resume playback."
}

export async function run(e: cmdEvent) {
    if (!e.interaction.guildId) return;
    const subscription = subscriptions.get(e.interaction.guildId);

    if (subscription) {
        subscription.audioPlayer.unpause();
        await e.interaction.reply(`Unpaused!`);
    }
    else {
        await e.interaction.reply('Not in a voice channel!');
    }
}

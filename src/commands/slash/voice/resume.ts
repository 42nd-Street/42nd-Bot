import { ApplicationCommandData } from "discord.js";
import { cmdEvent } from '@interactions/interfaces'
import { subscriptions } from "@shared/voice/subscription";
import { userInCorrectChannel } from "@interactions/utils";

export const data: ApplicationCommandData = {
    name: "resume",
    description: "Resume playback."
}

export async function run(e: cmdEvent) {
    if (!e.interaction.guildId) return;
    const subscription = subscriptions.get(e.interaction.guildId);

    if (!subscription) {
        await e.interaction.reply('Not in a voice channel!');
        return;
    }

    if (!userInCorrectChannel(e, subscription)) return;

    subscription.audioPlayer.unpause();
    await e.interaction.reply(`Unpaused!`);
}

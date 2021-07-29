import { ApplicationCommandData } from "discord.js";
import { cmdEvent } from '@interactions/interfaces'
import { subscriptions } from "@shared/voice/subscription";
import { userInCorrectChannel } from "@interactions/utils";
import { notInVc } from "@interactions/responses";

export const data: ApplicationCommandData = {
    name: "pause",
    description: "Pause playback."
}

export async function run(e: cmdEvent) {
    if (!e.interaction.guildId) return;
    const subscription = subscriptions.get(e.interaction.guildId);

    if (!subscription) {
        await notInVc(e);
        return;
    }
    
    if (!userInCorrectChannel(e, subscription)) return;

    subscription.audioPlayer.pause();
    await e.interaction.reply(`Paused!`);
}

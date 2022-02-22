import { ApplicationCommandData } from "discord.js";
import { cmdEvent } from '@interactions/interfaces';
import { notInVc } from "@interactions/responses";
import { subscriptions } from "@shared/voice/subscription";

export const data: ApplicationCommandData = {
    name: "loop",
    description: "Loop the queue."
}

export async function run(e: cmdEvent) {
    if (!e.interaction.guildId) return;
    const subscription = subscriptions.get(e.interaction.guildId);

    if (!subscription) {
        await notInVc(e);
        return;
    }

    if (!subscription.MusicQueue.looping) {
        subscription.MusicQueue.looping = true;
        e.interaction.reply('Now looping the queue!');
    }
    else {
        subscription.MusicQueue.looping = false;
        e.interaction.reply('No longer looping the queue!')
    }
}
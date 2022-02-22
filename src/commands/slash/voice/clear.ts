import { ApplicationCommandData } from "discord.js";
import { cmdEvent } from '@interactions/interfaces'
import { subscriptions } from "@shared/voice/subscription";
import { userInCorrectChannel } from "@interactions/utils";
import { incorrectChannel, notInVc } from '@interactions/responses'
export const data: ApplicationCommandData = {
    name: "clear",
    description: "Stop playing the current track and clear the queue."
}

export async function run(e: cmdEvent) {
    if (!e.interaction.guildId) return;

    const subscription = subscriptions.get(e.interaction.guildId)

    if (!subscription) {
        await notInVc(e);
        return;
    }

    if (!userInCorrectChannel(e, subscription)) { 
        await incorrectChannel(e);
        return; 
    }

    subscription.clear();
    await e.interaction.reply(`Cleared the queue!`);
}
import { ApplicationCommandData, ApplicationCommandOptionType } from "discord.js";
import { cmdEvent } from "@interactions/interfaces";
import { MusicSubscription, subscriptions } from "@voice/subscription";
import { notInVc } from "@interactions/responses";
import { AudioPlayerStatus, AudioResource } from "@discordjs/voice";
import { Track } from "@voice/track";

export const data: ApplicationCommandData = {
    name: "remove",
    description: "Remove an item from the queue",
    options: [{
        name: 'position',
        description: 'the position of the track you want to remove from the queue',
        type: 'INTEGER',
        required: true
    }]
}

export async function run(e: cmdEvent) {
    if (!e.interaction.guildId) return;
    const subscription = subscriptions.get(e.interaction.guildId);

    if (!subscription) {
        await notInVc(e);
        return;
    }

    try {
        const index = e.interaction.options.get('position', true).value as number;

        // If the track to remove is the current track, skip it first 
        if (subscription.audioPlayer.state.status != AudioPlayerStatus.Idle
            && (subscription.audioPlayer.state.resource as AudioResource<Track>).metadata == subscription.MusicQueue.queue[index - 1]) {
            subscription.audioPlayer.stop();
        }

        subscription.MusicQueue.remove(index - 1);
        
        e.interaction.reply(`Removed track #${index}`)
    }
    catch (err) {
        if (err instanceof Error) {
            e.interaction.reply(err.message)
        }
        else {
            throw err;
        }
    }
}
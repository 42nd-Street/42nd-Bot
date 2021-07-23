import { ApplicationCommandData } from "discord.js";
import { cmdEvent } from '@shared/interfaces'

import { subscriptions } from "@shared/voice/subscription";
import { AudioPlayerStatus, AudioResource } from "@discordjs/voice";
import { Track } from "@shared/voice/track";

export const data: ApplicationCommandData = {
    name: "queue",
    description: "Display the current queue"
}

export async function run(e: cmdEvent) {
    if (!e.interaction.guildId) return;

    const subscription = subscriptions.get(e.interaction.guildId);

    if (subscription) {
        const current =
            subscription.audioPlayer.state.status === AudioPlayerStatus.Idle
                ? `Nothing is currently playing!`
                : `Playing **${(subscription.audioPlayer.state.resource as AudioResource<Track>).metadata.title}**`;

        const queue = subscription.queue
            .slice(0, 5)
            .map((track, index) => `${index + 1}) ${track.title}`)
            .join('\n');

        await e.interaction.reply(`${current}\n\n${queue}`);
    }
    else {
        await e.interaction.reply('Not in a voice channel!');
    }
}
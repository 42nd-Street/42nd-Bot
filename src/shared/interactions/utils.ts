import { VoiceConnectionStatus } from "@discordjs/voice";
import { MusicSubscription } from "@shared/voice/subscription";
import { GuildMember, Message, MessageEmbed } from "discord.js";
import { cmdEvent } from "@interactions/interfaces";

/**
 * Check if the user is in the correct channel.
 * @param e the event of the current interaction
 * @param subscription the music subscription of the guild
 * @returns True if user is in correct channel, false otherwise
 */
export async function userInCorrectChannel(e: cmdEvent, subscription: MusicSubscription) : Promise<Boolean> {
    if (subscription.voiceConnection.state.status === VoiceConnectionStatus.Ready
        && subscription.voiceConnection.joinConfig.channelId !== (e.interaction.member as GuildMember).voice.channelId) {
        await e.interaction.followUp('Someone else is already listening to music in another channel!');
        return false;
    }
    else {
        return true;
    }
}


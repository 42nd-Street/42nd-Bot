import { createAudioPlayer } from "@discordjs/voice";
import { ApplicationCommandData, GuildMember, Interaction, VoiceChannel } from "discord.js";
import { cmdEvent } from "../../shared/interfaces";
import { connectToChannel, playSong } from "../../shared/voice/voice";

export const data: ApplicationCommandData = {
    name: "play",
    description: "plays noise",
    options: [{
        name: 'url',
        type: 'STRING',
        description: 'url of the sound file',
        required: true
    }]
}


/**
 * This command uses @discordjs/voice for voice as it seems that the .join() method on VoiceChannel 
 * is missing in the latest version of discord.js (i assume they migrated it?)
 * @discordjs/voice can be found at: https://github.com/discordjs/voice
 * I took an example and modified it slightly but no behaviour should be affected.
 * The files from the example are at src/shared/voice
 * The example can be found at: https://github.com/discordjs/voice/tree/main/examples/basic
*/


export async function run(e: cmdEvent) {
    if (e.interaction.member instanceof GuildMember) {
        const member = e.interaction.member as GuildMember
        if (member.voice.channel instanceof VoiceChannel) {
            const url = e.interaction.options.get('url')?.value?.toString()
            if (typeof url === "string") {

                await e.interaction.reply(`got url ${url}`)

                const player = createAudioPlayer()

                // This does not seem to work.
                // Therefore it errors out after a timeout, see the method definition.
                const connection = await connectToChannel(member.voice.channel);
                               
                await playSong(player, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3')

                connection.subscribe(player);

                await e.interaction.followUp('playing song')
            }
        }
    }
}
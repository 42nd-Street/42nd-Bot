import { createAudioPlayer } from "@discordjs/voice";
import { ApplicationCommandData, GuildMember, Message, MessageAttachment, VoiceChannel } from "discord.js";
import { cmdEvent } from "../../../shared/interfaces";
import { connectToChannel, playSong } from "../../../shared/voice/voice";
import { getStream } from '../../../shared/interactions/recieveAttachment'
import https from 'https'

export const data: ApplicationCommandData = {
    name: "oldplay",
    description: "plays noise",
    options: [{
        name: 'url',
        type: 'STRING',
        description: 'url of the sound file, if not present send an attachment',
        required: false
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
        if (!(member.voice.channel instanceof VoiceChannel)) {
            e.interaction.reply({ content: "You are not in a voice channel.", ephemeral: true })
        }
        else {
            const channel: VoiceChannel = member.voice.channel
            const url = e.interaction.options.get('url')?.value?.toString()
            if (typeof url === "string") {

                await e.interaction.reply(`got url ${url}`)

                const player = createAudioPlayer()

                const connection = await connectToChannel(channel);

                await playSong(player, url)

                connection.subscribe(player);

                await e.interaction.followUp('playing song')
            }
            else {
                await e.interaction.reply(`waiting for an attachment to be sent`);

                const listener = async (msg: Message) => {
                    if (msg.author === e.interaction.member?.user) {
                        const attachment = msg.attachments.first()
                        if (attachment instanceof MessageAttachment) {

                            const stream = await getStream(attachment.url)
                            e.interaction.followUp(`recieved file ${attachment.name}`)

                            const player = createAudioPlayer()
                            const connection = await connectToChannel(channel)
                            await playSong(player, stream)

                            connection.subscribe(player);

                            await e.interaction.followUp('playing song')
                    }
                    else {
                        e.interaction.followUp(`Bruh where's the file huh`)
                    }
                    e.client.removeListener('messageCreate', listener);

                }
            }
            e.client.on('messageCreate', listener);
        }
    }
}
}


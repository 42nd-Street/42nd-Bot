import { cmdEvent } from "@shared/interactions/interfaces";
import { MusicSubscription } from "@shared/voice/subscription";
import { Track } from "@shared/voice/track";
import { getSubscription } from "@shared/voice/utils";
import { ApplicationCommandData, Message, MessageAttachment } from "discord.js";

/** Interaction reply timeout in ms */
const recieveTimeout: number = 15000;

export const data: ApplicationCommandData = {
    name: 'file',
    description: 'Plays a song from an attachment. Send the attachment after the command within 15s.',
}

export async function run(e: cmdEvent) {
    let subscription: MusicSubscription
    try {
        subscription = await getSubscription(e);
    }
    catch (error) {
        if (error instanceof Error) {
            e.interaction.reply(error.message);
        }
        console.log(error);
        return;
    }

    // Define responses for this interaction.
    const eventMethods = {
        onStart(title: string) {
            e.interaction.followUp({ content: `Now playing **${title}**!` }).catch(console.warn);
        },
        onFinish(title: string) {
            e.interaction.followUp({ content: `Now finished **${title}**!`, ephemeral: true }).catch(console.warn);
        },
        onError(title: string, error: Error) {
            console.warn(error);
            e.interaction.followUp({ content: `**${title}** error: ${error.message}` }).catch(console.warn);
        },
    }

    // Recieve attachment here
    const listener = async (msg: Message) => {
        if (msg.author === e.interaction.member?.user) {
            const attachment = msg.attachments.first()
            if (Date.now() - startTime >= recieveTimeout) {
                e.client.off('messageCreate', listener);
                return;
            }
            if (attachment instanceof MessageAttachment) {
                try {
                    const track = await Track.from(attachment.url, 'DISCORD_ATTACHMENT', eventMethods, attachment.name!.split('.')[0])
                    subscription!.enqueue(track);
                    await e.interaction.followUp(`Enqueued **${track.title}**`);
                }
                catch (error) {
                    console.warn(error);
                    await e.interaction.reply('Failed to play track, please try again later!');
                }
            }
            else {
                e.interaction.followUp("bruh where's the file huh");
            }
            e.client.off('messageCreate', listener);
        }
    }
    const startTime = Date.now();
    e.client.on('messageCreate', listener);
}
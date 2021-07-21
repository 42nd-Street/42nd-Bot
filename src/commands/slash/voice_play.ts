import { entersState, joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";
import { ApplicationCommandData, GuildMember, Message, MessageAttachment, VoiceChannel } from "discord.js";
import { cmdEvent } from "../../shared/interfaces"
import { createDiscordJSAdapter } from "../../shared/voice/adapter";
import { MusicSubscription, subscriptions } from "../../shared/voice/subscription"
import { Track } from "../../shared/voice/track";

export const data: ApplicationCommandData = {
    name: 'play',
    description: 'Plays a song or a sound file',
    options: [{
        name: 'url',
        description: 'The (yt) url of the song to play',
        type: 'STRING',
        required: false
    }]
}

export async function run(e: cmdEvent) {
    if (!e.interaction.guildId) return;

    await e.interaction.defer();

    let subscription = subscriptions.get(e.interaction.guildId)

    const urlOption = e.interaction.options.get('url');

    const eventMethods = {
        onStart() {
            e.interaction.followUp({ content: 'Now playing!' }).catch(console.warn);
        },
        onFinish() {
            //e.interaction.followUp({ content: 'Now finished!' }).catch(console.warn);
        },
        onError(error: Error) {
            console.warn(error);
            e.interaction.followUp({ content: `Error: ${error.message}` }).catch(console.warn);
        },
    }


    if (!subscription) {
        if (e.interaction.member instanceof GuildMember && e.interaction.member.voice.channel) {
            const channel = e.interaction.member.voice.channel;
            subscription = new MusicSubscription(
                joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: createDiscordJSAdapter(channel as VoiceChannel),
                }),
            );
            subscription.voiceConnection.on('error', console.warn);
            subscriptions.set(e.interaction.guildId, subscription);
        }
    }
    
    // If there is no subscription, tell the user they need to join a channel.
    if (!subscription) {
        await e.interaction.followUp('Join a voice channel and then try that again!');
        return;
    }

    // Make sure the connection is ready before processing the user's request
    try {
        await entersState(subscription.voiceConnection, VoiceConnectionStatus.Ready, 20e3);
    } catch (error) {
        console.warn(error);
        await e.interaction.followUp('Failed to join voice channel within 20 seconds, please try again later!');
        return;
    }

    if (!urlOption) {

        // Recieve attachment here
        await e.interaction.followUp(`You have an unlimited amount of seconds to send an attachment before I add you to the list of the NSF casualties.`);
        //try {
        //    e.interaction.channel!.awaitMessages({ max: 5, time: 5000, errors: ['time'] }).then((messages) => {
        //        messages?.forEach((msg: Message) => {
        //            if (msg.author === e.interaction.member?.user) {
        //                const attachment = msg.attachments.first()
        //                if (attachment instanceof MessageAttachment) {
        //                    url = attachment.url;
        //                    tracktype = 'DISCORD_ATTACHMENT'
        //                    e.interaction.reply('Good.');
        //                }
        //                else {
        //                    e.interaction.followUp("Not an attachment. You want soy food?")
        //                }
        //            }
        //        })
        //    }, (reason) => {
        //        e.interaction.followUp(reason.toString())
        //    })
        //}
        //catch (err) {
        //    e.interaction.followUp(err.message || 'no message found')
        //}
        const listener = async (msg: Message) => {
            if (msg.author === e.interaction.member?.user) {
                const attachment = msg.attachments.first()
                if (attachment instanceof MessageAttachment) {
                    try {
                        const track = await Track.from(attachment.url, 'DISCORD_ATTACHMENT', eventMethods, attachment.name!)
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
                e.client.removeListener('messageCreate', listener);
            }
        }
        e.client.on('messageCreate', listener);
    }
    else {
        // Determine whether it's a youtube or direct link
        // for now, if not yt then direct

        const url = urlOption.value! as string;

        // Big regex from https://stackoverflow.com/questions/3717115/regular-expression-for-youtube-links
        const isYt = url.match(/(http:|https:)?\/\/(www\.)?(youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?/) != null;

        if (isYt) {
            e.interaction.followUp('yt branch')

            try {
                // Attempt to create a Track from the user's video URL
                const track = await Track.from(url, 'YOUTUBE', eventMethods);
                // Enqueue the track and reply a success message to the user
                subscription.enqueue(track);
                await e.interaction.followUp(`Enqueued **${track.title}**`);
            } catch (error) {
                console.warn(error);
                await e.interaction.reply('Failed to play track, please try again later!');
            }

        }
        else {
            const isUrl = url.match(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/) != null
            if (isUrl) {
                e.interaction.followUp('direct branch')
            }
            else {
                e.interaction.followUp('bad url')
                return;
            }
        }
    }
}
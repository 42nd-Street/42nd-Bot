import { cmdEvent } from "@shared/interactions/interfaces";
import { MusicSubscription } from "@shared/voice/subscription";
import { Track } from "@shared/voice/track";
import { getSubscription } from "@shared/voice/utils";
import { ApplicationCommandData } from "discord.js";
import { YT } from '@voice/youtubeapi'

export const data: ApplicationCommandData = {
    name: 'url',
    description: 'Plays a song or a playlist from url. Supports YT only right now.',
    options: [{
        name: 'input',
        description: 'the input url link',
        type: 'STRING',
        required: true
    }]
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



    const urlInput = e.interaction.options.get('input')!.value! as string;

    // Regex: https://regexr.com/62j9j
    const isYtVid = urlInput.match(/((http(s)?:)(\/\/))?(www\.)?((m.)?youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?/) != null;

    const urls: string[] = []
    let isPlaylist: boolean = false;

    if (isYtVid) {
        try {
            const youtube = YT()
            const playlist = await youtube.getPlaylist(urlInput);
            await playlist.fetchVideos(0);

            // For each video in the playlist
            playlist.videos.forEach((video) => {
                urls.push(video.url);
            });

            await e.interaction.followUp(`Enqueued **${playlist.title}**`)

            isPlaylist = true;
        } catch (error) {
            console.warn(error);
            urls.push(urlInput);
        }

        for (const url of urls) {
            try {
                // Do not attempt to queue more tracks if queue just got cleared.
                if (subscription.enqueueLock) { return; }   
                // Attempt to create a Track from the user's video URL
                const track = await Track.from(url, 'YOUTUBE', eventMethods);
                // Enqueue the track and reply a success message to the user
                subscription.enqueue(track);
                if (!isPlaylist) {
                    await e.interaction.followUp(`Enqueued **${track.title}**`);
                }

            } catch (error) {
                console.warn(error);
                await e.interaction.followUp(`Failed to play track ${url}, please try again later!`);
            }
        }
        return;
    }

    const isUrl = urlInput.match(/(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/) != null

    if (isUrl) {
        e.interaction.followUp('Non-yt not supported yet')
        return;
    }
    else {
        e.interaction.followUp('bad url')
        return;
    }
}


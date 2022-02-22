import { cmdEvent } from "@shared/interactions/interfaces";
import { MusicSubscription } from "@shared/voice/subscription";
import { Track } from "@shared/voice/track";
import { getSubscription } from "@shared/voice/utils";
import { ApplicationCommandData, ApplicationCommandOptionType } from "discord.js";
import { YT } from '@voice/youtubeapi'
import { Playlist } from "popyt";

export const data: ApplicationCommandData = {
    name: 'url',
    description: 'Plays a song or a playlist from url. Supports YT only right now.',
    options: [{
        name: 'input',
        description: 'the input url link',
        type: 'STRING',
        required:true
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

    // Define responses for this track.
    const eventMethods = {
        onStart(title: string) {
            e.interaction.followUp({ content: `Now playing **${title}**!` }).catch(console.warn);
        },
        onFinish(title: string) {
            e.interaction.followUp({ content: `Now finished **${title}**!`, ephemeral: true }).catch(console.warn);
            subscription.MusicQueue.finish();
        },
        onError(title: string, error: Error) {
            console.warn(error + "here");
            e.interaction.followUp({ content: `**${title}** error: ${error.message}` }).catch(console.warn);
        },
    }

    const input = e.interaction.options.get('input')!.value! as string;

    // Regex: https://regexr.com/62j9j
    const isYtVid = input.match(/((http(s)?:)(\/\/))?(www\.)?((m.)?youtube.com|youtu.be)\/(watch)?(\?v=)?(\S+)?/) != null;

    if (isYtVid) {
        await playYtUrl(input, e, subscription, eventMethods); 
    }
    else {
        const isUrl = input.match(/(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/) != null
        if (isUrl) {
            e.interaction.followUp('Non-yt not supported yet');
            return;
        }
        else {
            e.interaction.followUp(`Searching for ${input}`);

            const youtube = YT();

            const query = await youtube.searchVideos(input, 10);

            const resultsStr = query.results
                .map(item => `${item.title}: ${item.url} \n`)
                .reduce((acc, cur) => acc += cur);

            e.interaction.followUp(`Results: ${resultsStr}`);

            let defaultVideo = query.results[0];

            for (const video of query.results) {

                if (video.title.includes('music')) {
                    defaultVideo = video;
                    //break;
                }
            }

            await playYtUrl(defaultVideo.url, e, subscription, eventMethods);
        }

    }
}

async function playYtUrl(url: string, e: cmdEvent, subscription: MusicSubscription, eventMethods: any) {

    const urls: string[] = []
    let isPlaylist: boolean = false;
    let playlist : Playlist;

    try {
        const youtube = YT()
        playlist = await youtube.getPlaylist(url);
        await playlist.fetchVideos(0);

        // For each video in the playlist
        for (const video of playlist.videos) {
            urls.push(video.url);
        }

        isPlaylist = true;

        await e.interaction.followUp(`Enqueued **${playlist.title}**`)
    } catch (error) {
        if (error == "Item not found") {
            urls.push(url);
        }
        else {
            console.warn(error);
            await e.interaction.followUp(`Failed to play track ${url}, please try again later!`);
        }
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


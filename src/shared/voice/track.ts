import ytdl from 'ytdl-core-discord';
import { AudioResource, createAudioResource, StreamType } from '@discordjs/voice';
import { getStream } from '@voice/utils';

/**
 * This is the data required to create a Track object
 */

export type TrackType = 'YOUTUBE' | 'DIRECTURL' | 'DISCORD_ATTACHMENT'

export interface TrackData {
	url: string;
	title: string;
	type: TrackType;
	onStart: () => void;
	onFinish: () => void;
	onError: (error: Error) => void;
}

const noop = () => { };

/**
 * A Track represents information about a YouTube video (in this context) that can be added to a queue.
 * It contains the title and URL of the video, as well as functions onStart, onFinish, onError, that act
 * as callbacks that are triggered at certain points during the track's lifecycle.
 *
 * Rather than creating an AudioResource for each video immediately and then keeping those in a queue,
 * we use tracks as they don't pre-emptively load the videos. Instead, once a Track is taken from the
 * queue, it is converted into an AudioResource just in time for playback.
 */
export class Track implements TrackData {
	public readonly url: string;
	public readonly title: string;
	public readonly type: TrackType
	public readonly onStart: () => void;
	public readonly onFinish: () => void;
	public readonly onError: (error: Error) => void;

	private constructor({ url, title, type, onStart, onFinish, onError }: TrackData) {
		this.url = url;
		this.title = title;
		this.onStart = onStart;
		this.onFinish = onFinish;
		this.onError = onError;
		this.type = type;
	}

	/**
	 * Creates an AudioResource from this Track.
	 */
	public createAudioResource(): Promise<AudioResource<Track>> {
		return new Promise(async (resolve, reject) => {

			let audio: AudioResource<this extends null | undefined ? null : this> | undefined;

			switch (this.type) {
				case 'YOUTUBE':
					audio = createAudioResource(await ytdl(this.url, {}), { metadata: this })
					break;
				case 'DISCORD_ATTACHMENT':
					audio = createAudioResource(await getStream(this.url), {inputType: StreamType.Arbitrary, metadata: this})
					break;
				default:
					throw new Error(`The type ${this.type} is not yet supported.`)
					break;
			}

			if (audio) {
				resolve(audio);
			}
			else {
				reject(this.onError)
			}

		});
	}



	/**
	 * Creates a Track from a video URL and lifecycle callback methods.
	 *
	 * @param url The URL of the video
	 * @param methods Lifecycle callbacks
	 * @returns The created Track
	 */
	public static async from(url: string, type: TrackType, methods: Pick<Track, 'onStart' | 'onFinish' | 'onError'>, name?: string): Promise<Track> {
		// The methods are wrapped so that we can ensure that they are only called once.
		const wrappedMethods = {
			onStart() {
				wrappedMethods.onStart = noop;
				methods.onStart();
			},
			onFinish() {
				wrappedMethods.onFinish = noop;
				methods.onFinish();
			},
			onError(error: Error) {
				wrappedMethods.onError = noop;
				methods.onError(error);
			},
		};
		let title: string;
		switch (type) {
			case 'YOUTUBE':
				const info = await ytdl.getInfo(url);
				title = info.videoDetails.title
				break;
			case 'DISCORD_ATTACHMENT':
				if (name) {
					title = name;
				}
				else {
					throw new Error(`Type ${type} is used but argument name is not provided`)
				}
				break;
			default:
				throw new Error(`Type ${type} is not implemented`)
				break;
		}

		return new Track({
			title,
			url,
			type,
			...wrappedMethods
		});
	}
}
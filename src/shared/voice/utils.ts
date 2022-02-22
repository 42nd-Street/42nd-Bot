import { VoiceChannel, GuildMember } from 'discord.js';
import {
	joinVoiceChannel,
	entersState,
	VoiceConnectionStatus,
	DiscordGatewayAdapterCreator,
} from '@discordjs/voice';


import https from 'https';
import { PassThrough } from 'stream';
import { cmdEvent } from '@shared/interactions/interfaces';
import { userInCorrectChannel } from '@shared/interactions/utils';
import { MusicSubscription, subscriptions } from './subscription';

export async function getStream(url: string) {
	let stream = new PassThrough();

	https.get(url, (res) => res.pipe(stream))

	return stream;
}

export async function getSubscription(e: cmdEvent): Promise<MusicSubscription> {
	if (!e.interaction.guildId) { throw new Error('Not in guild!'); }

	await e.interaction.deferReply();

	let subscription = subscriptions.get(e.interaction.guildId)

	if (!subscription) {
		if (e.interaction.member instanceof GuildMember && e.interaction.member.voice.channel) {
			const channel = e.interaction.member.voice.channel;
			subscription = new MusicSubscription(
				joinVoiceChannel({
					channelId: channel.id,
					guildId: channel.guild.id,
					adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
				}),
			);
			subscription.voiceConnection.on('error', console.warn);
			subscriptions.set(e.interaction.guildId, subscription);
		}
		else {
			throw new Error('Join a voice channel and then try that again!');
		}
	}

	// Check if the user's channel corresponds to the existing subscription
	if (!userInCorrectChannel(e, subscription)) {
		throw new Error('Someone else is already listening to music in another channel!');
	}

	// Make sure the connection is ready before processing the user's request
	try {
		await entersState(subscription.voiceConnection, VoiceConnectionStatus.Ready, 15e3);
		// Unlock the queue so new requests go through
		subscription.enqueueLock = false;
		return subscription;
	} catch (error) {
		console.warn(error);
		throw new Error('Failed to join voice channel within 20 seconds, please try again later!');
	}
}
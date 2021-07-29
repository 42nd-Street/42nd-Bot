import { VoiceChannel, GuildMember } from 'discord.js';
import {
	joinVoiceChannel,
	entersState,
	VoiceConnectionStatus,
} from '@discordjs/voice';
import { createDiscordJSAdapter } from './adapter';

export async function connectToChannel(channel: VoiceChannel) {
	/*
		Here, we try to establish a connection to a voice channel. If we're already connected
		to this voice channel, @discordjs/voice will just return the existing connection for
		us!
	*/
	const connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: createDiscordJSAdapter(channel),
	});

	/*
		If we're dealing with a connection that isn't yet Ready, we can set a reasonable
		time limit before giving up. In this example, we give the voice connection 30 seconds
		to enter the ready state before giving up.
	*/
	try {
		/*
			Allow ourselves 30 seconds to join the voice channel. If we do not join within then,
			an error is thrown.
		*/
		await entersState(connection, VoiceConnectionStatus.Connecting, 3e3);
		/*
			At this point, the voice connection is ready within 30 seconds! This means we can
			start playing audio in the voice channel. We return the connection so it can be
			used by the caller.
		*/
		return connection;
	} catch (error) {
		/*
			At this point, the voice connection has not entered the Ready state. We should make
			sure to destroy it, and propagate the error by throwing it, so that the calling function
			is aware that we failed to connect to the channel.
		*/
		connection.destroy();
		throw error;
	}
}

import https from 'https';
import { PassThrough } from 'stream';
import { cmdEvent } from '@shared/interactions/interfaces';
import { userInCorrectChannel } from '@shared/interactions/utils';
import { MusicSubscription, subscriptions } from './subscription';

export async function getStream(url: string) {
	let stream = new PassThrough();

	https.get(url, (res) => res.pipe(stream))

	//await new Promise(fullfill => stream.on('end',fullfill))
	return stream;
}

export async function getSubscription(e: cmdEvent): Promise<MusicSubscription> {
	if (!e.interaction.guildId) { throw new Error('Not in guild!'); }

	await e.interaction.defer();

	let subscription = subscriptions.get(e.interaction.guildId)

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
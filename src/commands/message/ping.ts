import { Message } from 'discord.js'
import { msgEvent } from '../../shared/events';

export function run(e: msgEvent) {
	e.msg.reply(`Pong!`);
}

export function match(msg: Message) {
	if (msg.content.toLowerCase() === "ping") return true;

	return false;
}
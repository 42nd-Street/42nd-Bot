import { Message } from 'discord.js'
import { msgEvent } from '../../shared/interfaces';

export function run(e: msgEvent) {
	e.msg.reply(`Pong!`);
}

export function match(msg: Message) {
	return msg.content.toLowerCase() === "ping";
}
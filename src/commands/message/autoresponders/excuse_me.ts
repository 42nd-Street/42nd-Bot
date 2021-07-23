import { Message } from 'discord.js';
import { msgEvent } from '@interactions/interfaces';
import { AutoreplyEmbedGen } from '@shared/embed';

export function run(e: msgEvent) {
    e.msg.channel.send(AutoreplyEmbedGen("Excuse me", "https://cdn.discordapp.com/attachments/470215521141391360/516040429402324992/shirtimage-3.png", e.msg))
}

export function match(msg: Message) {
    return msg.content.toLowerCase() === "excuse me";
}
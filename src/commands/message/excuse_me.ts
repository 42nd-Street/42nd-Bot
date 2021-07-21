import { Message } from 'discord.js';
import { msgEvent } from '../../shared/interfaces';
import { AutoreplyEmbedGen } from '../../shared/embed';

export function run(e: msgEvent) {
    // Note: As of writing (1/7/21) info on the new embed sytem is not properly documented
    e.msg.channel.send(AutoreplyEmbedGen("Excuse me", "https://cdn.discordapp.com/attachments/470215521141391360/516040429402324992/shirtimage-3.png", e.msg))
    e.msg.delete();
}

export function match(msg: Message) {
    return msg.content.toLowerCase() === "excuse me";
}
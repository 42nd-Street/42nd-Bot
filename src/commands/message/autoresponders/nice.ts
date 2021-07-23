import { Message } from 'discord.js';
import { msgEvent } from '@interactions/interfaces';
import { AutoreplyEmbedGen } from '@shared/embed';

export function run(e: msgEvent) {
    // Note: As of writing (1/7/21) info on the new embed sytem is not properly documented
    e.msg.channel.send(AutoreplyEmbedGen("Nice", "https://cdn.discordapp.com/attachments/367021334217359361/455826116943413262/nice.png", e.msg))
    e.msg.delete();
}

export function match(msg: Message) {
    return msg.content.toLowerCase() === "nice";
}